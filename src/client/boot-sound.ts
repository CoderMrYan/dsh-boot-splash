/**
 * Synthesized startup score for the Web boot sequence. Every cue is generated
 * with the Web Audio API, so the sequence ships no audio assets and needs no
 * network request.
 *
 * The score starts on its own when the browser allows it. When autoplay policy
 * keeps the context suspended, {@link BootSound.start} reports `blocked` and the
 * splash offers an explicit enable action; later cues are scheduled from the
 * current moment instead of replaying from the beginning.
 * @module apps/web/src/boot-sound
 */

const MUTE_KEY = 'dsh.boot.sound.muted'
const MASTER_LEVEL = 0.42
const RESUME_TIMEOUT_MS = 350

/** Result of asking the score to start. */
export type BootSoundState = 'playing' | 'blocked' | 'muted'

/** One score event, positioned in seconds from the start of the sequence. */
interface BootCue {
  at: number
  play: (at: number) => void
}

/** Wait for a bounded time without keeping the caller alive. */
function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => { setTimeout(resolve, milliseconds) })
}

/** Read the persisted mute choice, treating unavailable storage as unmuted. */
function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch (error) {
    console.debug('boot-sound: storage is unavailable', error)
    return false
  }
}

/** Persist the mute choice without letting a denied storage break boot. */
function writeMuted(muted: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch (error) {
    console.debug('boot-sound: could not persist the mute choice', error)
  }
}

/** The generated score and the analyser the splash draws from. */
export class BootSound {
  private readonly context: AudioContext
  private readonly master: GainNode
  private readonly analyser: AnalyserNode
  private readonly reverb: ConvolverNode
  private readonly cues: BootCue[]
  private readonly frequency: Uint8Array<ArrayBuffer>
  private started = false
  private muted: boolean

  constructor() {
    this.muted = readMuted()
    this.context = new AudioContext({ latencyHint: 'interactive' })
    this.master = this.context.createGain()
    this.master.gain.value = 0
    const compressor = this.context.createDynamicsCompressor()
    compressor.threshold.value = -16
    compressor.knee.value = 22
    compressor.ratio.value = 10
    compressor.attack.value = 0.004
    compressor.release.value = 0.24
    this.analyser = this.context.createAnalyser()
    this.analyser.fftSize = 256
    this.analyser.smoothingTimeConstant = 0.82
    this.frequency = new Uint8Array(this.analyser.frequencyBinCount)
    this.reverb = this.context.createConvolver()
    this.reverb.buffer = this.impulse()
    const wet = this.context.createGain()
    wet.gain.value = 0.34
    this.master.connect(compressor)
    this.master.connect(wet)
    wet.connect(this.reverb)
    this.reverb.connect(compressor)
    compressor.connect(this.analyser)
    this.analyser.connect(this.context.destination)
    this.cues = this.buildCues()
  }

  /** Whether the person switched the score off. */
  get isMuted(): boolean {
    return this.muted
  }

  /**
   * Ask the browser to run the score.
   * @param from - Seconds into the sequence where the caller currently is.
   * @returns Whether the score is playing, blocked by autoplay, or muted.
   */
  async start(from: number): Promise<BootSoundState> {
    if (this.muted) return 'muted'
    if (this.context.state !== 'running') {
      try {
        await Promise.race([this.context.resume().then(() => true), delay(RESUME_TIMEOUT_MS)])
      } catch (error) {
        console.debug('boot-sound: the audio context could not start', error)
      }
    }
    if (this.context.state !== 'running') return 'blocked'
    this.activate(from)
    return 'playing'
  }

  /**
   * Resume from a user gesture, scheduling the remaining cues.
   * @param from - Seconds into the sequence where the caller currently is.
   * @returns Whether the score is now running.
   */
  async enable(from: number): Promise<boolean> {
    try {
      await this.context.resume()
    } catch (error) {
      console.debug('boot-sound: the audio context could not resume', error)
    }
    if (this.context.state !== 'running') return false
    this.muted = false
    writeMuted(false)
    this.activate(from)
    return true
  }

  /** Switch the master level without stopping the scheduled score. */
  setMuted(muted: boolean): void {
    this.muted = muted
    writeMuted(muted)
    const now = this.context.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, now, 0.08)
  }

  /** Read normalized spectrum buckets for the visualizer. */
  levels(count: number): number[] {
    if (this.context.state !== 'running' || this.muted) return new Array<number>(count).fill(0)
    this.analyser.getByteFrequencyData(this.frequency)
    const buckets: number[] = []
    const width = Math.max(1, Math.floor(this.frequency.length / count))
    for (let index = 0; index < count; index += 1) {
      let sum = 0
      for (let offset = 0; offset < width; offset += 1) {
        sum += this.frequency[index * width + offset] ?? 0
      }
      buckets.push(sum / width / 255)
    }
    return buckets
  }

  /** Fade out and release the audio context. */
  dispose(): void {
    const now = this.context.currentTime
    this.master.gain.cancelScheduledValues(now)
    this.master.gain.setTargetAtTime(0, now, 0.06)
    setTimeout(() => { void this.context.close() }, 700)
  }

  /** Fade the master in and schedule every cue at or after `from`. */
  private activate(from: number): void {
    const now = this.context.currentTime
    if (!this.started) {
      this.started = true
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setValueAtTime(0.0001, now)
      this.master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 0.55)
    } else if (!this.muted) {
      this.master.gain.cancelScheduledValues(now)
      this.master.gain.setTargetAtTime(MASTER_LEVEL, now, 0.08)
    }
    this.schedule(from)
  }

  /** Schedule the remaining score relative to the current audio clock. */
  private schedule(from: number): void {
    const origin = this.context.currentTime + 0.05
    for (const cue of this.cues) {
      if (cue.at < from - 0.12) continue
      cue.play(origin + Math.max(0, cue.at - from))
    }
  }

  /** Build the ordered cue list for the full sequence. */
  private buildCues(): BootCue[] {
    return [
      { at: 0.0, play: (at) => { this.click(at) } },
      { at: 0.02, play: (at) => { this.bed(at) } },
      { at: 0.05, play: (at) => { this.thump(at) } },
      { at: 0.42, play: (at) => { this.servo(at) } },
      { at: 0.9, play: (at) => { this.riser(at, 1.6) } },
      { at: 1.35, play: (at) => { this.chirp(at, 1520, -0.45) } },
      { at: 1.52, play: (at) => { this.chirp(at, 1980, 0.3) } },
      { at: 1.7, play: (at) => { this.chirp(at, 2460, -0.1) } },
      { at: 1.95, play: (at) => { this.pad(at) } },
      { at: 2.6, play: (at) => { this.ticks(at) } },
      { at: 3.0, play: (at) => { this.bell(at) } },
      { at: 3.45, play: (at) => { this.arp(at) } },
      { at: 4.3, play: (at) => { this.sonar(at) } },
      { at: 5.15, play: (at) => { this.riser(at, 0.9, 0.5) } },
      { at: 5.62, play: (at) => { this.impact(at) } },
      { at: 6.0, play: (at) => { this.chord(at) } },
    ]
  }

  /** Relay click that starts the sequence. */
  private click(at: number): void {
    const noise = this.context.createBufferSource()
    noise.buffer = this.noiseBuffer()
    const filter = this.context.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 1600
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.12, at + 0.004)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.05)
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    noise.start(at)
    noise.stop(at + 0.06)
  }

  /** Low reactor bed that holds the sequence together. */
  private bed(at: number): void {
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(180, at)
    filter.frequency.linearRampToValueAtTime(320, at + 3)
    filter.frequency.linearRampToValueAtTime(220, at + 6)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.linearRampToValueAtTime(0.024, at + 1)
    gain.gain.setValueAtTime(0.024, at + 5.2)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 6.6)
    filter.connect(gain)
    gain.connect(this.master)
    for (const [frequency, detune] of [[55, -4], [55, 5], [82.5, 1]] as const) {
      const oscillator = this.context.createOscillator()
      oscillator.type = 'sawtooth'
      oscillator.frequency.value = frequency
      oscillator.detune.value = detune
      oscillator.connect(filter)
      oscillator.start(at)
      oscillator.stop(at + 6.65)
    }
  }

  /** Deep sub-bass ignition thump. */
  private thump(at: number): void {
    const oscillator = this.context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(64, at)
    oscillator.frequency.exponentialRampToValueAtTime(31, at + 1.1)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.55, at + 0.018)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.25)
    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(at)
    oscillator.stop(at + 1.3)
  }

  /** Metallic servo spool-up with a slow band sweep. */
  private servo(at: number): void {
    const oscillator = this.context.createOscillator()
    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(68, at)
    oscillator.frequency.linearRampToValueAtTime(112, at + 1.4)
    const filter = this.context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 6
    filter.frequency.setValueAtTime(280, at)
    filter.frequency.exponentialRampToValueAtTime(1400, at + 1.3)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.05, at + 0.2)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.5)
    const tremolo = this.context.createOscillator()
    tremolo.frequency.value = 17
    const depth = this.context.createGain()
    depth.gain.value = 0.018
    tremolo.connect(depth)
    depth.connect(gain.gain)
    oscillator.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    oscillator.start(at)
    tremolo.start(at)
    oscillator.stop(at + 1.55)
    tremolo.stop(at + 1.55)
  }

  /** Filtered noise and a sine sweep that lift into the next phase. */
  private riser(at: number, duration: number, peak = 0.1): void {
    const noise = this.context.createBufferSource()
    noise.buffer = this.noiseBuffer()
    noise.loop = true
    const filter = this.context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.Q.value = 1.4
    filter.frequency.setValueAtTime(220, at)
    filter.frequency.exponentialRampToValueAtTime(5200, at + duration)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.linearRampToValueAtTime(peak, at + duration * 0.72)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.master)
    noise.start(at)
    noise.stop(at + duration + 0.05)

    const sine = this.context.createOscillator()
    sine.type = 'sine'
    sine.frequency.setValueAtTime(110, at)
    sine.frequency.exponentialRampToValueAtTime(440, at + duration)
    const sineGain = this.context.createGain()
    sineGain.gain.setValueAtTime(0.0001, at)
    sineGain.gain.linearRampToValueAtTime(0.035, at + duration * 0.8)
    sineGain.gain.exponentialRampToValueAtTime(0.0001, at + duration)
    sine.connect(sineGain)
    sineGain.connect(this.master)
    sine.start(at)
    sine.stop(at + duration + 0.05)
  }

  /** Short digital chirp with stereo placement. */
  private chirp(at: number, frequency: number, pan: number): void {
    const oscillator = this.context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, at)
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, at + 0.05)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.065, at + 0.006)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09)
    const panner = this.context.createStereoPanner()
    panner.pan.value = pan
    oscillator.connect(gain)
    gain.connect(panner)
    panner.connect(this.master)
    oscillator.start(at)
    oscillator.stop(at + 0.1)
  }

  /** Warm minor pad under the convergence phase. */
  private pad(at: number): void {
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(400, at)
    filter.frequency.linearRampToValueAtTime(1100, at + 1.4)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.linearRampToValueAtTime(0.045, at + 1.3)
    gain.gain.linearRampToValueAtTime(0.03, at + 3.4)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 4.6)
    filter.connect(gain)
    gain.connect(this.master)
    for (const frequency of [73.42, 110, 174.61]) {
      const oscillator = this.context.createOscillator()
      oscillator.type = 'sawtooth'
      oscillator.frequency.value = frequency
      oscillator.detune.value = (Math.random() - 0.5) * 8
      oscillator.connect(filter)
      oscillator.start(at)
      oscillator.stop(at + 4.65)
    }
  }

  /** Quiet data ticks while the wordmark decodes. */
  private ticks(at: number): void {
    for (let index = 0; index < 11; index += 1) {
      const tickAt = at + index * 0.13
      const oscillator = this.context.createOscillator()
      oscillator.type = 'square'
      oscillator.frequency.value = index % 3 === 0 ? 1760 : 1320
      const gain = this.context.createGain()
      gain.gain.setValueAtTime(0.0001, tickAt)
      gain.gain.exponentialRampToValueAtTime(0.018, tickAt + 0.004)
      gain.gain.exponentialRampToValueAtTime(0.0001, tickAt + 0.035)
      oscillator.connect(gain)
      gain.connect(this.master)
      oscillator.start(tickAt)
      oscillator.stop(tickAt + 0.04)
    }
  }

  /** FM bell when the whale resolves. */
  private bell(at: number): void {
    const carrier = this.context.createOscillator()
    carrier.type = 'sine'
    carrier.frequency.value = 660
    const modulator = this.context.createOscillator()
    modulator.type = 'sine'
    modulator.frequency.value = 990
    const depth = this.context.createGain()
    depth.gain.setValueAtTime(380, at)
    depth.gain.exponentialRampToValueAtTime(12, at + 0.9)
    modulator.connect(depth)
    depth.connect(carrier.frequency)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.1, at + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.5)
    carrier.connect(gain)
    gain.connect(this.master)
    gain.connect(this.reverb)
    carrier.start(at)
    modulator.start(at)
    carrier.stop(at + 1.55)
    modulator.stop(at + 1.55)
  }

  /** Four-note rising arpeggio. */
  private arp(at: number): void {
    const notes = [293.66, 349.23, 440, 587.33]
    notes.forEach((frequency, index) => {
      const noteAt = at + index * 0.16
      const oscillator = this.context.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      const gain = this.context.createGain()
      gain.gain.setValueAtTime(0.0001, noteAt)
      gain.gain.exponentialRampToValueAtTime(0.06, noteAt + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, noteAt + 0.55)
      oscillator.connect(gain)
      gain.connect(this.master)
      gain.connect(this.reverb)
      oscillator.start(noteAt)
      oscillator.stop(noteAt + 0.6)
    })
  }

  /** Two-tone sonar handshake with a long tail. */
  private sonar(at: number): void {
    for (const [index, frequency] of [880, 660].entries()) {
      const pingAt = at + index * 0.18
      const oscillator = this.context.createOscillator()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      const gain = this.context.createGain()
      gain.gain.setValueAtTime(0.0001, pingAt)
      gain.gain.exponentialRampToValueAtTime(0.09, pingAt + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, pingAt + 0.95)
      oscillator.connect(gain)
      gain.connect(this.master)
      gain.connect(this.reverb)
      oscillator.start(pingAt)
      oscillator.stop(pingAt + 1)
    }
  }

  /** Power impact that lands with the final flash. */
  private impact(at: number): void {
    const oscillator = this.context.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(72, at)
    oscillator.frequency.exponentialRampToValueAtTime(27, at + 1.2)
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.exponentialRampToValueAtTime(0.5, at + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.4)
    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start(at)
    oscillator.stop(at + 1.45)

    const burst = this.context.createBufferSource()
    burst.buffer = this.noiseBuffer()
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2400, at)
    filter.frequency.exponentialRampToValueAtTime(180, at + 0.5)
    const burstGain = this.context.createGain()
    burstGain.gain.setValueAtTime(0.18, at)
    burstGain.gain.exponentialRampToValueAtTime(0.0001, at + 0.6)
    burst.connect(filter)
    filter.connect(burstGain)
    burstGain.connect(this.master)
    burst.start(at)
    burst.stop(at + 0.65)
  }

  /** Final sustained chord with a long reverb tail. */
  private chord(at: number): void {
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2200
    const gain = this.context.createGain()
    gain.gain.setValueAtTime(0.0001, at)
    gain.gain.linearRampToValueAtTime(0.055, at + 0.12)
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 2.2)
    filter.connect(gain)
    gain.connect(this.master)
    gain.connect(this.reverb)
    for (const frequency of [146.83, 174.61, 220, 293.66]) {
      const oscillator = this.context.createOscillator()
      oscillator.type = 'triangle'
      oscillator.frequency.value = frequency
      oscillator.connect(filter)
      oscillator.start(at)
      oscillator.stop(at + 2.25)
    }
  }

  /** Two seconds of mono white noise, created once per context. */
  private noiseBuffer(): AudioBuffer {
    if (this.cachedNoise !== undefined) return this.cachedNoise
    const length = Math.floor(this.context.sampleRate * 2)
    const buffer = this.context.createBuffer(1, length, this.context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1
    this.cachedNoise = buffer
    return buffer
  }

  private cachedNoise: AudioBuffer | undefined

  /** Build a short stereo impulse response for the boot reverb. */
  private impulse(): AudioBuffer {
    const seconds = 2.1
    const length = Math.floor(this.context.sampleRate * seconds)
    const buffer = this.context.createBuffer(2, length, this.context.sampleRate)
    for (let channel = 0; channel < 2; channel += 1) {
      const data = buffer.getChannelData(channel)
      for (let index = 0; index < length; index += 1) {
        const decay = (1 - index / length) ** 2.6
        data[index] = (Math.random() * 2 - 1) * decay
      }
    }
    return buffer
  }
}
