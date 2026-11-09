/**
 * Full-screen boot sequence for the Web shell. It covers the blank document and
 * the framework-free boot page until the UI renderer takes the mount point, then
 * dissolves into the application.
 *
 * The sequence is decorative: it never delays a failed boot report, it can be
 * skipped from the first interaction, and automation (`navigator.webdriver`)
 * skips it entirely.
 * @module dsh-boot-splash/client
 */
import styles from './styles-scoped.css'
import { BootSound } from './boot-sound.ts'

const STYLE_ID = 'dsh-boot-splash-style'
const SEEN_KEY = 'dsh.boot.splash.plugin.seen.v1'
const OFF_KEY = 'dsh.boot.splash.off'

const ENTER_MS = 900
const FORM_MS = 2600
const LINK_MS = 4300
const CHARGE_MS = 5400
const READY_MS = 6100
const MAX_HOLD_MS = 1600
const GLITCH_MS = 4060
const GLITCH_SPAN_MS = 180
const DECODE_START_MS = 2800
const DECODE_SPAN_MS = 1300
const SKIP_DELAY_MS = 700

const MAX_PARTICLES = 900
const ICON_SAMPLE_SIZE = 260
const WORDMARK = 'DEEPSEEK HARNESS'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|=+*#'
const TELEMETRY_LABELS = ['NEURAL', 'OPTIC', 'TORQUE', 'CACHE', 'LINK']

/** Resolve a class name scoped to this plugin's injected stylesheet. */
function cssClass(name: string): string {
  return `dbs-${name}`
}

/** Inject the scoped stylesheet once per document. */
function mountStyles(doc: Document): void {
  if (doc.getElementById(STYLE_ID) !== null) return
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.dataset.pluginCss = 'dsh-boot-splash'
  style.textContent = styles
  doc.head.append(style)
}

/** Remove the injected stylesheet. */
function removeStyles(doc: Document): void {
  doc.getElementById(STYLE_ID)?.remove()
}

/** One point of the whale silhouette, normalized to the icon square. */
interface SplashTarget {
  /** Horizontal offset from the icon center, in icon widths. */
  nx: number
  /** Vertical offset from the icon center, in icon widths. */
  ny: number
}

/** One particle of the forming silhouette. */
interface SplashParticle extends SplashTarget {
  /** Starting orbit angle around the viewport center. */
  angle: number
  /** Starting orbit radius as a fraction of the viewport diagonal. */
  radiusFactor: number
  /** Phase offset for the idle wobble. */
  phase: number
  /** Formation delay after the formation phase begins, in milliseconds. */
  delay: number
  /** Square particle edge in CSS pixels. */
  size: number
  /** `r, g, b` channel triplet for the particle fill. */
  tint: string
}

/** A boot-log line revealed at its own moment. */
interface BootLine {
  at: number
  text: string
}

const BOOT_LINES: readonly BootLine[] = [
  { at: 380, text: 'KERNEL 0x2F ......... OK' },
  { at: 760, text: 'NEURAL BUS .......... LINKED' },
  { at: 1140, text: 'QUANTUM CACHE ....... WARM' },
  { at: 1520, text: 'PLUGIN GRAPH ........ MOUNTING' },
  { at: 1900, text: 'SANDBOX ............. SEALED' },
  { at: 2280, text: 'SESSION CORE ........ AWAKE' },
  { at: 2660, text: 'WHALE DRIVE ......... SPINNING' },
  { at: 3040, text: 'TENSOR LINK ......... 1.2 TB/s' },
  { at: 3800, text: 'OPTICS .............. ALIGNED' },
  { at: 4560, text: 'HANDSHAKE ........... 0x9F3A' },
]

/** Clamp a number into an inclusive range. */
function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Read a key from a storage without letting a denied storage break boot. */
function storageRead(kind: 'local' | 'session', key: string): string | null {
  try {
    return (kind === 'local' ? localStorage : sessionStorage).getItem(key)
  } catch (error) {
    console.debug('boot-splash: storage is unavailable', error)
    return null
  }
}

/** Persist the played marker without letting a denied storage break boot. */
function markPlayed(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch (error) {
    console.debug('boot-splash: could not record the played marker', error)
  }
}

/**
 * Whether this document should play the sequence. `?boot=1` forces a replay,
 * `?boot=0` disables it, automation is left alone, and a tab plays it once.
 * @returns Whether to mount the sequence.
 */
export function shouldPlayBootSplash(): boolean {
  const mode = new URLSearchParams(window.location.search).get('boot')
  if (mode === '1') return true
  if (mode === '0') return false
  if (navigator.webdriver) return false
  if (storageRead('local', OFF_KEY) === '1') return false
  return storageRead('session', SEEN_KEY) !== '1'
}

/** The overlay, its canvas loop, the generated score, and the handoff. */
class BootSplash {
  private readonly doc: Document
  private readonly root: HTMLDivElement
  private readonly canvas: HTMLCanvasElement
  private readonly context: CanvasRenderingContext2D | null
  private readonly percent: HTMLSpanElement
  private readonly fill: HTMLDivElement
  private readonly tagline: HTMLDivElement
  private readonly phase: HTMLDivElement
  private readonly wordmark: HTMLHeadingElement
  private readonly hint: HTMLDivElement
  private readonly soundButton: HTMLButtonElement
  private readonly flash: HTMLDivElement
  private readonly emblem: HTMLDivElement
  private readonly log: HTMLDivElement
  private readonly lines: HTMLDivElement[] = []
  private readonly telemetry: HTMLDivElement[] = []
  private readonly bars: HTMLElement[] = []
  private readonly reduced: boolean
  private readonly touch: boolean
  private particles: SplashParticle[] = []
  private observer: MutationObserver | undefined
  private sound: BootSound | undefined
  private audioBlocked = false
  private audioMuted = false
  private lastWordmark = ''
  private lastPhase = ''
  private lastTagline = ''
  private lastTelemetryAt = -1
  private raf = 0
  private startTimer = 0
  private fadeTimer = 0
  private removeTimer = 0
  private soundTimer = 0
  private startedAt = 0
  private elapsed = 0
  private width = 0
  private height = 0
  private mounted = false
  private finishing = false

  constructor(doc: Document) {
    this.doc = doc
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.touch = window.matchMedia('(pointer: coarse)').matches
    this.root = this.element('div', cssClass('root'))
    this.root.dataset.dshSplash = ''
    this.root.setAttribute('aria-hidden', 'true')

    this.canvas = doc.createElement('canvas')
    this.canvas.className = cssClass('canvas')
    this.context = this.canvas.getContext('2d')

    const grid = this.element('div', cssClass('grid'))
    const scan = this.element('div', cssClass('scan'))
    const hud = this.element('div', cssClass('hud'))
    this.flash = this.element('div', cssClass('flash'))

    const corners = ['cornerTl', 'cornerTr', 'cornerBl', 'cornerBr']
    for (const corner of corners) {
      hud.append(this.element('div', `${cssClass('corner')} ${cssClass(corner)}`))
    }

    const meta = this.element('div', cssClass('meta'))
    meta.append(
      this.element('span', undefined, 'DSH // WEB KERNEL'),
      this.element('span', undefined, 'ABYSS PROTOCOL // 047'),
    )

    this.phase = this.element('div', cssClass('phase'), 'PHASE 01 // IGNITION')
    this.soundButton = this.element('button', cssClass('sound'), 'AUDIO ON')
    this.soundButton.type = 'button'
    this.soundButton.dataset.dshSound = ''
    this.soundButton.setAttribute('aria-label', 'Toggle the boot sequence sound')
    this.soundButton.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      void this.toggleAudio()
    })

    const center = this.element('div', cssClass('center'))
    const emblem = this.element('div', cssClass('emblem'))
    this.emblem = emblem
    for (const ring of ['ring', 'ringThree']) {
      emblem.append(this.element('div', cssClass(ring)))
    }
    const sigil = this.element('img')
    sigil.src = new URL('favicon-dark.svg', doc.baseURI).href
    sigil.alt = ''
    sigil.decoding = 'async'
    sigil.draggable = false
    emblem.append(sigil)

    const initialWordmark = this.scrambled(WORDMARK, 0)
    this.wordmark = this.element('h1', cssClass('wordmark'), initialWordmark)
    this.wordmark.dataset.text = initialWordmark
    this.tagline = this.element('div', cssClass('tagline'), 'ABYSSAL BOOT SEQUENCE // HANDSHAKE')
    center.append(emblem, this.wordmark, this.tagline)

    this.log = this.element('div', cssClass('log'))
    for (const line of BOOT_LINES) {
      const element = this.element('div', cssClass('line'), line.text)
      element.dataset.at = String(line.at)
      this.log.append(element)
      this.lines.push(element)
    }

    const telemetry = this.element('div', cssClass('telemetry'))
    for (const label of TELEMETRY_LABELS) {
      const entry = this.element('div', undefined, `0x0000 // ${label}`)
      telemetry.append(entry)
      this.telemetry.push(entry)
    }

    const spectrum = this.element('div', cssClass('spectrum'))
    for (let index = 0; index < 12; index += 1) {
      const bar = this.element('i')
      bar.style.transform = 'scaleY(0.15)'
      spectrum.append(bar)
      this.bars.push(bar)
    }

    const progress = this.element('div', cssClass('progress'))
    this.percent = this.element('span', undefined, '000')
    this.percent.className = cssClass('percent')
    const bar = this.element('div', cssClass('bar'))
    this.fill = this.element('div', cssClass('fill'))
    bar.append(this.fill)
    progress.append(this.percent, bar)

    this.hint = this.element('div', cssClass('skip'), 'CLICK OR ESC TO SKIP')

    hud.append(meta, this.phase, this.soundButton, center, this.log, telemetry, spectrum, progress, this.hint)
    this.root.append(grid, this.canvas, scan, hud, this.flash)
    doc.body.append(this.root)
  }

  /** Create one element with an optional class and text. */
  private element<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    text?: string,
  ): HTMLElementTagNameMap[K] {
    const element = this.doc.createElement(tag)
    if (className !== undefined) element.className = className
    if (text !== undefined) element.textContent = text
    return element
  }

  /** Start the overlay, the score, timers, and interaction listeners. */
  start(): void {
    this.resize()
    window.addEventListener('resize', this.onResize)
    const mount = this.doc.getElementById('root')
    if (mount !== null) {
      this.observer = new MutationObserver(() => { this.checkMounted() })
      this.observer.observe(mount, { childList: true })
    }
    this.checkMounted()
    this.doc.documentElement.classList.add(cssClass('lock'))
    this.doc.addEventListener('pointerdown', this.onPointer, true)
    this.doc.addEventListener('keydown', this.onKey, true)
    this.startedAt = performance.now()

    this.startSound()

    if (this.reduced) {
      this.root.classList.add(cssClass('reduced'))
      this.percent.textContent = '100'
      this.fill.style.width = '100%'
      this.startTimer = window.setTimeout(() => { this.finish(true) }, 1000)
      return
    }
    void this.loadTargets()
    this.raf = requestAnimationFrame(this.tick)
  }

  /** Create the score and let the browser decide whether it may start. */
  private startSound(): void {
    try {
      this.sound = new BootSound()
    } catch (error) {
      console.debug('boot-splash: the boot score is unavailable', error)
      this.syncAudioUi()
      return
    }
    this.audioMuted = this.sound.isMuted
    this.syncAudioUi()
    void this.sound.start(0).then((state) => {
      if (this.finishing) return
      this.audioBlocked = state === 'blocked'
      if (state === 'playing') this.audioMuted = false
      this.syncAudioUi()
    }).catch((error: unknown) => {
      console.debug('boot-splash: the boot score could not start', error)
      this.audioBlocked = true
      this.syncAudioUi()
    })
  }

  /** Reflect the score state in the hint and the small sound control. */
  private syncAudioUi(): void {
    const skip = this.touch ? 'TAP TO SKIP' : 'CLICK OR ESC TO SKIP'
    if (this.sound === undefined) {
      this.soundButton.textContent = 'AUDIO OFF'
      this.hint.textContent = skip
      return
    }
    this.soundButton.textContent = this.audioBlocked
      ? 'ENABLE AUDIO'
      : this.audioMuted ? 'AUDIO OFF' : 'AUDIO ON'
    this.hint.textContent = this.audioBlocked && !this.touch
      ? 'CLICK FOR AUDIO // ESC TO SKIP'
      : skip
  }

  /** Enable the score from the current moment, or switch it on or off. */
  private async toggleAudio(): Promise<void> {
    if (this.sound === undefined) return
    if (this.audioBlocked || this.audioMuted) {
      const playing = await this.sound.enable(this.elapsed / 1000)
      this.audioBlocked = !playing
      this.audioMuted = !playing
    } else {
      this.sound.setMuted(true)
      this.audioMuted = true
      this.audioBlocked = false
    }
    this.syncAudioUi()
  }

  /** Enable the score from a pointer gesture without skipping. */
  private async enableAudio(): Promise<void> {
    if (this.sound === undefined) return
    const playing = await this.sound.enable(this.elapsed / 1000)
    this.audioBlocked = !playing
    this.audioMuted = !playing
    this.syncAudioUi()
  }

  /** The boot-page handoff: the renderer replaced the boot page in `#root`. */
  private checkMounted(): void {
    const mount = this.doc.getElementById('root')
    if (mount === null || mount.childElementCount === 0) return
    if (mount.querySelector('[data-dsh-boot]') !== null) return
    this.mounted = true
  }

  /** Draw one animation frame and decide whether the sequence may end. */
  private readonly tick = (now: number): void => {
    if (this.finishing) return
    this.elapsed = now - this.startedAt
    this.checkMounted()
    this.updateHud()
    this.draw(this.elapsed)
    if (this.elapsed >= READY_MS && (this.mounted || this.elapsed >= READY_MS + MAX_HOLD_MS)) {
      this.finish()
      return
    }
    this.raf = requestAnimationFrame(this.tick)
  }

  /** Project elapsed time onto the displayed percentage. */
  private progressAt(t: number): number {
    if (t <= 0) return 0
    if (t < ENTER_MS) return (t / ENTER_MS) * 10
    if (t < FORM_MS) return 10 + ((t - ENTER_MS) / (FORM_MS - ENTER_MS)) * 45
    if (t < LINK_MS) return 55 + ((t - FORM_MS) / (LINK_MS - FORM_MS)) * 21
    if (t < CHARGE_MS) return 76 + ((t - LINK_MS) / (CHARGE_MS - LINK_MS)) * 10
    if (t < READY_MS) return 86 + ((t - CHARGE_MS) / (READY_MS - CHARGE_MS)) * 2
    return 88
  }

  /** The phase caption for the current moment. */
  private phaseAt(t: number): string {
    if (t < ENTER_MS) return 'PHASE 01 // IGNITION'
    if (t < FORM_MS) return 'PHASE 02 // DIAGNOSTICS'
    if (t < LINK_MS) return 'PHASE 03 // CONVERGENCE'
    if (t < CHARGE_MS) return 'PHASE 04 // HANDSHAKE'
    return 'PHASE 05 // ONLINE'
  }

  /** Reveal the log, decode the wordmark, and animate the telemetry. */
  private updateHud(): void {
    const t = this.elapsed
    const progress = this.progressAt(t)
    this.percent.textContent = String(Math.round(progress)).padStart(3, '0')
    this.fill.style.width = `${progress.toFixed(1)}%`

    for (const line of this.lines) {
      if (line.classList.contains(cssClass('lineOn'))) continue
      if (t >= Number(line.dataset.at ?? 0)) line.classList.add(cssClass('lineOn'))
    }

    const phase = this.phaseAt(t)
    if (phase !== this.lastPhase) {
      this.phase.textContent = phase
      this.lastPhase = phase
    }

    const tagline = t < LINK_MS ? 'ABYSSAL BOOT SEQUENCE // HANDSHAKE' : 'NEURAL LINK // ESTABLISHED'
    if (tagline !== this.lastTagline) {
      this.tagline.textContent = tagline
      this.lastTagline = tagline
    }

    this.updateWordmark(t)
    this.updateTelemetry(t)
    this.updateSpectrum(t)

    if (t >= CHARGE_MS) this.root.classList.add(cssClass('charging'))
    const glitching = t >= GLITCH_MS && t <= GLITCH_MS + GLITCH_SPAN_MS
    this.root.classList.toggle(cssClass('glitch'), glitching)
  }

  /** Decode the wordmark from random glyphs into the final lettering. */
  private updateWordmark(t: number): void {
    let text: string
    if (t >= DECODE_START_MS + DECODE_SPAN_MS) {
      text = WORDMARK
    } else if (t < DECODE_START_MS) {
      text = this.scrambled(WORDMARK, t)
    } else {
      const reveal = Math.floor(clamp((t - DECODE_START_MS) / DECODE_SPAN_MS, 0, 1) * WORDMARK.length)
      text = ''
      for (let index = 0; index < WORDMARK.length; index += 1) {
        const character = WORDMARK[index] ?? ''
        if (character === ' ') {
          text += ' '
        } else if (index < reveal) {
          text += character
        } else {
          text += GLYPHS[(Math.floor(t / 55) + index * 11) % GLYPHS.length] ?? '?'
        }
      }
    }
    if (text === this.lastWordmark) return
    this.lastWordmark = text
    this.wordmark.textContent = text
    this.wordmark.dataset.text = text
  }

  /** Replace every non-space character with a moving glyph. */
  private scrambled(text: string, t: number): string {
    let scrambled = ''
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index] ?? ''
      scrambled += character === ' '
        ? ' '
        : GLYPHS[(Math.floor(t / 55) + index * 13) % GLYPHS.length] ?? '?'
    }
    return scrambled
  }

  /** Refresh the right-edge hex telemetry about seven times a second. */
  private updateTelemetry(t: number): void {
    if (t - this.lastTelemetryAt < 140) return
    this.lastTelemetryAt = t
    this.telemetry.forEach((line, index) => {
      const value = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0').toUpperCase()
      line.textContent = `0x${value} // ${TELEMETRY_LABELS[index] ?? 'SYS'}`
    })
  }

  /** Drive the small spectrum from the live analyser, or an idle breath. */
  private updateSpectrum(t: number): void {
    const levels = this.sound?.levels(this.bars.length) ?? []
    this.bars.forEach((bar, index) => {
      const level = levels[index] ?? 0.12 + 0.06 * Math.sin(t * 0.002 + index * 0.8)
      bar.style.transform = `scaleY(${clamp(0.12 + level * 1.15, 0.12, 1).toFixed(3)})`
    })
  }

  /** Sample the product icon into particle targets. */
  private async loadTargets(): Promise<void> {
    for (const icon of ['favicon-dark.svg', 'favicon.svg']) {
      try {
        const targets = await this.sampleIcon(icon)
        if (targets.length === 0) continue
        this.particles = this.createParticles(targets)
        return
      } catch (error) {
        console.debug('boot-splash: icon sampling failed', icon, error)
      }
    }
  }

  /** Rasterize one icon and collect the covered sample points. */
  private async sampleIcon(icon: string): Promise<SplashTarget[]> {
    const surface = this.doc.createElement('canvas')
    surface.width = ICON_SAMPLE_SIZE
    surface.height = ICON_SAMPLE_SIZE
    const context = surface.getContext('2d', { willReadFrequently: true })
    if (context === null) return []
    const image = new Image()
    image.decoding = 'async'
    image.src = new URL(icon, this.doc.baseURI).href
    await image.decode()
    context.clearRect(0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE)
    context.drawImage(image, 0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE)
    const pixels = context.getImageData(0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE).data
    const targets: SplashTarget[] = []
    const step = 3
    for (let y = 0; y < ICON_SAMPLE_SIZE; y += step) {
      for (let x = 0; x < ICON_SAMPLE_SIZE; x += step) {
        const alpha = pixels[(y * ICON_SAMPLE_SIZE + x) * 4 + 3] ?? 0
        if (alpha < 96) continue
        targets.push({
          nx: (x - ICON_SAMPLE_SIZE / 2) / ICON_SAMPLE_SIZE,
          ny: (y - ICON_SAMPLE_SIZE / 2) / ICON_SAMPLE_SIZE,
        })
      }
    }
    return targets
  }

  /** Shuffle and cap the sampled targets, and assign each one an orbit. */
  private createParticles(targets: readonly SplashTarget[]): SplashParticle[] {
    return targets
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, MAX_PARTICLES)
      .map(target => ({
        ...target,
        angle: Math.random() * Math.PI * 2,
        radiusFactor: 0.45 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        delay: Math.random() * 300,
        size: 0.8 + Math.random() * 1.3,
        tint: Math.random() < 0.62 ? '96, 165, 250' : '34, 211, 238',
      }))
  }

  /** Match the canvas backing store to the viewport. */
  private readonly onResize = (): void => { this.resize() }

  /** Match the canvas backing store to the viewport. */
  private resize(): void {
    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.canvas.width = Math.round(this.width * ratio)
    this.canvas.height = Math.round(this.height * ratio)
    this.context?.setTransform(ratio, 0, 0, ratio, 0, 0)
  }

  /** Draw the glow, the sonar rings, and the forming silhouette. */
  private draw(t: number): void {
    const context = this.context
    if (context === null) return
    const width = this.width
    const height = this.height
    const rect = this.emblem.getBoundingClientRect()
    const emblemWidth = rect.width === 0 ? Math.min(width, height) * 0.25 : rect.width
    const cx = rect.width === 0 ? width / 2 : rect.left + rect.width / 2
    const cy = rect.height === 0 ? height * 0.45 : rect.top + rect.height / 2
    const span = emblemWidth * 0.7
    context.clearRect(0, 0, width, height)
    this.drawGlow(context, cx, cy, span, t)
    this.drawRings(context, cx, cy, width, height, t)
    this.drawParticles(context, cx, cy, span, t)
  }

  /** Paint the central halo behind the emblem. */
  private drawGlow(
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    span: number,
    t: number,
  ): void {
    const pulse = 0.5 + 0.5 * Math.sin(t * 0.002)
    const glow = context.createRadialGradient(cx, cy, 0, cx, cy, span)
    glow.addColorStop(0, `rgba(77, 107, 254, ${(0.1 + pulse * 0.05).toFixed(3)})`)
    glow.addColorStop(0.55, 'rgba(34, 211, 238, 0.02)')
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    context.fillStyle = glow
    context.beginPath()
    context.arc(cx, cy, span, 0, Math.PI * 2)
    context.fill()
  }

  /** Expand three offset sonar rings. */
  private drawRings(
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    width: number,
    height: number,
    t: number,
  ): void {
    const maximum = Math.min(width, height) * 0.62
    context.lineWidth = 1
    for (let index = 0; index < 3; index += 1) {
      const phase = ((t + index * 1000) % 3000) / 3000
      const radius = 70 + phase * maximum
      context.beginPath()
      context.arc(cx, cy, radius, 0, Math.PI * 2)
      context.strokeStyle = `rgba(77, 107, 254, ${(0.16 * (1 - phase)).toFixed(3)})`
      context.stroke()
    }
  }

  /** Stream the particles from their orbits onto the whale silhouette. */
  private drawParticles(
    context: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    span: number,
    t: number,
  ): void {
    const reach = Math.max(this.width, this.height)
    for (const particle of this.particles) {
      const formation = clamp((t - FORM_MS - particle.delay) / 1500, 0, 1)
      const eased = 1 - (1 - formation) ** 3
      const orbit = particle.angle + t * 0.00012
      const radius = reach * particle.radiusFactor
      const startX = cx + Math.cos(orbit) * radius
      const startY = cy + Math.sin(orbit) * radius * 0.62
      const targetX = cx + particle.nx * span
      const targetY = cy + particle.ny * span
      const loosened = 1 - eased
      const x = startX + (targetX - startX) * eased
        + Math.sin(t * 0.0016 + particle.phase) * 3 * loosened
      const y = startY + (targetY - startY) * eased
        + Math.cos(t * 0.0014 + particle.phase) * 2 * loosened
      const alpha = (0.1 + 0.9 * eased) * (0.72 + 0.28 * Math.sin(t * 0.003 + particle.phase))
      context.fillStyle = `rgba(${particle.tint}, ${alpha.toFixed(3)})`
      context.fillRect(x, y, particle.size, particle.size)
    }
  }

  /** Skip from a click, or enable audio when autoplay was blocked. */
  private readonly onPointer = (event: PointerEvent): void => {
    const target = event.target
    if (target instanceof Element && target.closest('[data-dsh-sound]') !== null) return
    if (this.audioBlocked) {
      event.preventDefault()
      void this.enableAudio()
      return
    }
    this.requestSkip()
  }

  /** Skip from Escape, Enter, or Space. */
  private readonly onKey = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' && event.key !== 'Enter' && event.key !== ' ') return
    this.requestSkip()
  }

  /** End the sequence early without letting a stray first-frame click do it. */
  private requestSkip(): void {
    if (this.finishing || performance.now() - this.startedAt < SKIP_DELAY_MS) return
    this.finish(true)
  }

  /** Flash, fade, and remove the overlay. */
  private finish(fast = false): void {
    if (this.finishing) return
    this.finishing = true
    cancelAnimationFrame(this.raf)
    window.clearTimeout(this.startTimer)
    this.observer?.disconnect()
    this.doc.removeEventListener('pointerdown', this.onPointer, true)
    this.doc.removeEventListener('keydown', this.onKey, true)
    window.removeEventListener('resize', this.onResize)
    if (fast) {
      this.sound?.dispose()
    } else {
      this.soundTimer = window.setTimeout(() => { this.sound?.dispose() }, 1200)
    }
    this.percent.textContent = '100'
    this.fill.style.width = '100%'
    this.tagline.textContent = 'SYSTEM ONLINE'
    this.root.classList.add(cssClass('online'), cssClass('charging'))
    this.flash.classList.add(cssClass('flashOn'))
    this.fadeTimer = window.setTimeout(() => { this.root.classList.add(cssClass('out')) }, fast ? 120 : 260)
    this.removeTimer = window.setTimeout(() => {
      this.root.remove()
      this.doc.documentElement.classList.remove(cssClass('lock'))
      removeStyles(this.doc)
    }, fast ? 460 : 900)
  }

  /** Remove the overlay immediately when the plugin is disposed. */
  dispose(): void {
    this.finishing = true
    cancelAnimationFrame(this.raf)
    window.clearTimeout(this.startTimer)
    window.clearTimeout(this.fadeTimer)
    window.clearTimeout(this.removeTimer)
    window.clearTimeout(this.soundTimer)
    this.observer?.disconnect()
    this.doc.removeEventListener('pointerdown', this.onPointer, true)
    this.doc.removeEventListener('keydown', this.onKey, true)
    window.removeEventListener('resize', this.onResize)
    this.sound?.dispose()
    this.doc.documentElement.classList.remove(cssClass('lock'))
    this.root.remove()
    removeStyles(this.doc)
  }
}

/**
 * Play the boot sequence when this document is eligible and has not mounted its
 * application yet, and return a disposer for the plugin lifecycle.
 * @returns A disposer when the sequence started; `undefined` when it did not.
 */
export function startBootSplash(): (() => void) | undefined {
  const doc = document
  if (doc.querySelector('[data-dsh-splash]') !== null) return undefined
  const mode = new URLSearchParams(window.location.search).get('boot')
  const booting = doc.readyState === 'loading' || doc.querySelector('[data-dsh-boot]') !== null
  if (mode !== '1' && !booting) return undefined
  if (!shouldPlayBootSplash()) return undefined
  mountStyles(doc)
  markPlayed()
  const splash = new BootSplash(doc)
  splash.start()
  return () => { splash.dispose() }
}
