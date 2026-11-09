(() => {
  // src/client/styles-scoped.css
  var styles_scoped_default = '/* Full-screen boot sequence shown while the Web client loads its plugin graph. */\n\n.dbs-root {\n  --splash-brand: #4d6bfe;\n  --splash-cyan: #22d3ee;\n  position: fixed;\n  inset: 0;\n  z-index: 2147483647;\n  display: grid;\n  place-items: center;\n  overflow: hidden;\n  background:\n    radial-gradient(ellipse 58% 46% at 50% 42%, rgb(18 40 92 / 55%), transparent 72%),\n    radial-gradient(ellipse 70% 50% at 50% 112%, rgb(12 28 66 / 72%), transparent 70%),\n    #02040a;\n  color: #e8efff;\n  font-family: ui-monospace, "SFMono-Regular", "Cascadia Mono", Consolas, monospace;\n  isolation: isolate;\n  opacity: 1;\n  transform: scale(1);\n  filter: blur(0);\n  transition:\n    opacity 520ms ease,\n    transform 520ms ease,\n    filter 520ms ease;\n}\n\n.dbs-root::before {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 6;\n  pointer-events: none;\n  background: repeating-linear-gradient(\n    0deg,\n    rgb(255 255 255 / 3%) 0,\n    rgb(255 255 255 / 3%) 1px,\n    transparent 1px,\n    transparent 3px\n  );\n  opacity: 0.45;\n}\n\n.dbs-root::after {\n  content: "";\n  position: absolute;\n  inset: 0;\n  z-index: 5;\n  pointer-events: none;\n  background: radial-gradient(ellipse at 50% 45%, transparent 40%, rgb(0 0 0 / 62%) 100%);\n}\n\n.dbs-canvas {\n  position: absolute;\n  inset: 0;\n  z-index: 1;\n  width: 100%;\n  height: 100%;\n}\n\n.dbs-grid {\n  position: absolute;\n  inset: -38% -20% -12%;\n  z-index: 0;\n  background-image:\n    linear-gradient(rgb(77 107 254 / 9%) 1px, transparent 1px),\n    linear-gradient(90deg, rgb(77 107 254 / 9%) 1px, transparent 1px);\n  background-size: 72px 72px;\n  transform: perspective(720px) rotateX(62deg) translateY(16%);\n  transform-origin: 50% 100%;\n  mask-image: radial-gradient(ellipse 62% 58% at 50% 86%, #000 8%, transparent 72%);\n  opacity: 0.55;\n  animation: grid-drift 6s linear infinite;\n}\n\n.dbs-scan {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  z-index: 4;\n  height: 1px;\n  background: linear-gradient(90deg, transparent, rgb(34 211 238 / 55%), transparent);\n  box-shadow: 0 0 22px 3px rgb(34 211 238 / 22%);\n  opacity: 0.45;\n  animation: scan-sweep 3.8s cubic-bezier(0.45, 0, 0.55, 1) infinite;\n}\n\n.dbs-hud {\n  position: relative;\n  z-index: 3;\n  width: 100%;\n  height: 100%;\n}\n\n.dbs-corner {\n  position: absolute;\n  width: 58px;\n  height: 58px;\n  border: 1px solid rgb(77 107 254 / 42%);\n  opacity: 0.65;\n}\n\n.dbs-cornerTl {\n  top: 26px;\n  left: 26px;\n  border-right: 0;\n  border-bottom: 0;\n}\n\n.dbs-cornerTr {\n  top: 26px;\n  right: 26px;\n  border-bottom: 0;\n  border-left: 0;\n}\n\n.dbs-cornerBl {\n  bottom: 26px;\n  left: 26px;\n  border-top: 0;\n  border-right: 0;\n}\n\n.dbs-cornerBr {\n  right: 26px;\n  bottom: 26px;\n  border-top: 0;\n  border-left: 0;\n}\n\n.dbs-meta {\n  position: absolute;\n  top: 38px;\n  right: 104px;\n  left: 104px;\n  display: flex;\n  justify-content: space-between;\n  gap: 16px;\n  font-size: 10px;\n  letter-spacing: 0.3em;\n  color: rgb(167 190 255 / 58%);\n  text-transform: uppercase;\n}\n\n.dbs-meta strong {\n  font-weight: 500;\n  color: rgb(202 219 255 / 82%);\n}\n\n.dbs-phase {\n  position: absolute;\n  top: 64px;\n  left: 50%;\n  font-size: 9px;\n  letter-spacing: 0.42em;\n  color: rgb(34 211 238 / 68%);\n  text-transform: uppercase;\n  white-space: nowrap;\n  transform: translateX(-50%);\n}\n\n.dbs-sound {\n  position: absolute;\n  top: 58px;\n  right: 104px;\n  padding: 5px 9px;\n  border: 1px solid rgb(77 107 254 / 35%);\n  background: rgb(5 12 28 / 55%);\n  color: rgb(167 190 255 / 72%);\n  font: inherit;\n  font-size: 9px;\n  letter-spacing: 0.22em;\n  text-transform: uppercase;\n  cursor: pointer;\n  transition:\n    color 200ms ease,\n    border-color 200ms ease;\n}\n\n.dbs-sound:hover,\n.dbs-sound:focus-visible {\n  border-color: rgb(34 211 238 / 70%);\n  color: #e8efff;\n  outline: none;\n}\n\n.dbs-telemetry {\n  position: absolute;\n  top: 50%;\n  right: 44px;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  font-size: 9px;\n  letter-spacing: 0.14em;\n  color: rgb(148 180 255 / 36%);\n  text-align: right;\n  transform: translateY(-50%);\n}\n\n.dbs-spectrum {\n  position: absolute;\n  bottom: 42px;\n  left: 50%;\n  display: flex;\n  align-items: flex-end;\n  gap: 4px;\n  height: 22px;\n  transform: translateX(-50%);\n}\n\n.dbs-spectrum i {\n  display: block;\n  width: 3px;\n  height: 22px;\n  background: linear-gradient(180deg, var(--splash-cyan), var(--splash-brand));\n  opacity: 0.72;\n  transform-origin: bottom;\n  transition: transform 80ms linear;\n}\n\n.dbs-center {\n  position: absolute;\n  top: 45%;\n  left: 50%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: clamp(14px, 2.4vh, 24px);\n  width: min(92vw, 760px);\n  transform: translate(-50%, -50%);\n}\n\n.dbs-emblem {\n  position: relative;\n  width: clamp(180px, 25vmin, 268px);\n  aspect-ratio: 1;\n}\n\n.dbs-emblem img {\n  position: absolute;\n  inset: 15%;\n  width: 70%;\n  height: 70%;\n  padding: 0;\n  object-fit: contain;\n  background: transparent;\n  border: 0;\n  border-radius: 0;\n  box-shadow: none;\n  filter:\n    brightness(0) invert(1)\n    drop-shadow(0 0 16px rgb(77 107 254 / 85%))\n    drop-shadow(0 0 48px rgb(34 211 238 / 38%));\n  opacity: 0;\n  transform: scale(0.9);\n  animation: sigil-in 1.2s 2.8s cubic-bezier(0.16, 0.8, 0.24, 1) forwards;\n}\n\n.dbs-ring {\n  position: absolute;\n  inset: 0;\n  border: 1px solid rgb(77 107 254 / 26%);\n  border-radius: 50%;\n}\n\n.dbs-ring::before {\n  content: "";\n  position: absolute;\n  inset: -2px;\n  border: 1px solid transparent;\n  border-top-color: var(--splash-brand);\n  border-right-color: rgb(34 211 238 / 55%);\n  border-radius: 50%;\n  filter: drop-shadow(0 0 6px var(--splash-brand));\n  animation: ring-spin 3.2s linear infinite;\n}\n\n.dbs-ringThree {\n  inset: 10%;\n  border-color: rgb(34 211 238 / 24%);\n  animation: ring-pulse 2.8s ease-out infinite;\n}\n\n.dbs-wordmark {\n  position: relative;\n  margin: 0;\n  font-family: Montserrat, ui-sans-serif, system-ui, sans-serif;\n  font-size: clamp(19px, 3.4vw, 40px);\n  font-weight: 300;\n  line-height: 1.1;\n  letter-spacing: 0.34em;\n  text-indent: 0.34em;\n  color: #edf3ff;\n  text-transform: uppercase;\n  text-shadow: 0 0 26px rgb(77 107 254 / 65%);\n  white-space: nowrap;\n  opacity: 0;\n  animation: word-in 1.1s 2.1s cubic-bezier(0.16, 0.8, 0.24, 1) forwards;\n}\n\n.dbs-wordmark::after {\n  content: attr(data-text);\n  position: absolute;\n  inset: 0;\n  color: var(--splash-cyan);\n  opacity: 0.3;\n  clip-path: inset(46% 0 38% 0);\n  transform: translateX(1.5px);\n  mix-blend-mode: screen;\n}\n\n.dbs-tagline {\n  margin: 0;\n  font-size: clamp(9px, 1vw, 11px);\n  letter-spacing: 0.38em;\n  color: rgb(148 180 255 / 62%);\n  text-transform: uppercase;\n  opacity: 0;\n  animation: fade-in 0.8s 4.2s ease forwards;\n}\n\n.dbs-log {\n  position: absolute;\n  bottom: 56px;\n  left: 44px;\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  max-width: 44vw;\n  font-size: 10.5px;\n  letter-spacing: 0.08em;\n  color: rgb(150 180 245 / 72%);\n}\n\n.dbs-line {\n  display: flex;\n  gap: 9px;\n  opacity: 0;\n  transform: translateY(4px);\n  transition:\n    opacity 340ms ease,\n    transform 340ms ease;\n}\n\n.dbs-line::before {\n  content: "\u25B8";\n  color: var(--splash-cyan);\n}\n\n.dbs-lineOn {\n  opacity: 1;\n  transform: translateY(0);\n}\n\n.dbs-progress {\n  position: absolute;\n  right: 44px;\n  bottom: 54px;\n  width: min(300px, 30vw);\n  font-size: 10px;\n  letter-spacing: 0.24em;\n  color: rgb(202 219 255 / 78%);\n  text-align: right;\n}\n\n.dbs-percent {\n  font-variant-numeric: tabular-nums;\n}\n\n.dbs-bar {\n  height: 2px;\n  margin-top: 9px;\n  overflow: hidden;\n  background: rgb(77 107 254 / 16%);\n}\n\n.dbs-fill {\n  width: 0%;\n  height: 100%;\n  background: linear-gradient(90deg, var(--splash-brand), var(--splash-cyan));\n  box-shadow: 0 0 12px var(--splash-cyan);\n  transition: width 180ms linear;\n}\n\n.dbs-skip {\n  position: absolute;\n  bottom: 22px;\n  left: 50%;\n  font-size: 9px;\n  letter-spacing: 0.32em;\n  color: rgb(148 180 255 / 34%);\n  text-transform: uppercase;\n  white-space: nowrap;\n  opacity: 0;\n  transform: translateX(-50%);\n  animation: fade-in 0.7s 1.2s ease forwards;\n}\n\n.dbs-flash {\n  position: absolute;\n  inset: 0;\n  z-index: 7;\n  pointer-events: none;\n  background: radial-gradient(circle at 50% 45%, #dbeafe, rgb(77 107 254 / 55%) 24%, transparent 62%);\n  opacity: 0;\n}\n\n.dbs-flashOn {\n  animation: flash-burst 620ms ease-out forwards;\n}\n\n.dbs-online .dbs-tagline {\n  color: #7ff3e1;\n  text-shadow: 0 0 14px rgb(34 211 238 / 80%);\n}\n\n.dbs-charging .dbs-ring::before {\n  animation-duration: 0.7s;\n}\n\n.dbs-glitch .dbs-wordmark::after {\n  animation: glitch-shift 180ms steps(2, end) 1;\n}\n\n.dbs-out {\n  opacity: 0;\n  transform: scale(1.035);\n  filter: blur(8px);\n}\n\n.dbs-lock {\n  overflow: hidden !important;\n}\n\n.dbs-reduced .dbs-grid,\n.dbs-reduced .dbs-scan,\n.dbs-reduced .dbs-ring::before,\n.dbs-reduced .dbs-ringThree {\n  animation: none;\n}\n\n@keyframes grid-drift {\n  from {\n    background-position: 0 0, 0 0;\n  }\n\n  to {\n    background-position: 0 72px, 0 0;\n  }\n}\n\n@keyframes scan-sweep {\n  0% {\n    top: 8%;\n    opacity: 0;\n  }\n\n  12% {\n    opacity: 0.4;\n  }\n\n  88% {\n    opacity: 0.4;\n  }\n\n  100% {\n    top: 92%;\n    opacity: 0;\n  }\n}\n\n@keyframes ring-spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes ring-pulse {\n  0% {\n    opacity: 0.55;\n    transform: scale(0.96);\n  }\n\n  70% {\n    opacity: 0.08;\n    transform: scale(1.12);\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(1.12);\n  }\n}\n\n@keyframes sigil-in {\n  from {\n    opacity: 0;\n    transform: scale(0.9);\n  }\n\n  to {\n    opacity: 1;\n    transform: scale(1);\n  }\n}\n\n@keyframes word-in {\n  from {\n    opacity: 0;\n    letter-spacing: 0.6em;\n    filter: blur(6px);\n  }\n\n  to {\n    opacity: 1;\n    letter-spacing: 0.34em;\n    filter: blur(0);\n  }\n}\n\n@keyframes fade-in {\n  from {\n    opacity: 0;\n  }\n\n  to {\n    opacity: 1;\n  }\n}\n\n@keyframes flash-burst {\n  0% {\n    opacity: 0;\n    transform: scale(0.6);\n  }\n\n  18% {\n    opacity: 0.55;\n  }\n\n  100% {\n    opacity: 0;\n    transform: scale(1.55);\n  }\n}\n\n@keyframes glitch-shift {\n  0%,\n  100% {\n    transform: translate(0);\n    text-shadow: 0 0 26px rgb(77 107 254 / 65%);\n  }\n\n  33% {\n    transform: translate(-2px, 1px);\n    text-shadow:\n      2px 0 rgb(34 211 238 / 65%),\n      -2px 0 rgb(77 107 254 / 65%);\n  }\n\n  66% {\n    transform: translate(2px, -1px);\n    text-shadow:\n      -2px 0 rgb(34 211 238 / 55%),\n      2px 0 rgb(77 107 254 / 55%);\n  }\n}\n\n@media (max-width: 960px) {\n  .dbs-telemetry {\n    display: none;\n  }\n}\n\n@media (max-width: 720px) {\n  .dbs-meta {\n    right: 74px;\n    left: 74px;\n    font-size: 8px;\n    letter-spacing: 0.22em;\n  }\n\n  .dbs-phase {\n    top: 52px;\n    font-size: 8px;\n    letter-spacing: 0.28em;\n  }\n\n  .dbs-sound {\n    top: 48px;\n    right: 74px;\n    padding: 3px 6px;\n    font-size: 8px;\n  }\n\n  .dbs-spectrum {\n    bottom: 36px;\n    height: 14px;\n  }\n\n  .dbs-spectrum i {\n    height: 14px;\n  }\n\n  .dbs-corner {\n    width: 38px;\n    height: 38px;\n  }\n\n  .dbs-log {\n    display: none;\n  }\n\n  .dbs-progress {\n    right: 24px;\n    bottom: 42px;\n    width: 54vw;\n  }\n\n  .dbs-wordmark {\n    letter-spacing: 0.22em;\n    text-indent: 0.22em;\n  }\n\n  .dbs-skip {\n    bottom: 16px;\n    font-size: 8px;\n    letter-spacing: 0.2em;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .dbs-grid,\n  .dbs-scan,\n  .dbs-ring::before,\n  .dbs-ringThree {\n    animation: none;\n  }\n\n  .dbs-emblem img,\n  .dbs-wordmark,\n  .dbs-tagline {\n    animation-duration: 1ms;\n    animation-delay: 0ms;\n  }\n\n  .dbs-flashOn {\n    animation-duration: 300ms;\n  }\n}\n';

  // src/client/boot-sound.ts
  var MUTE_KEY = "dsh.boot.sound.muted";
  var MASTER_LEVEL = 0.42;
  var RESUME_TIMEOUT_MS = 350;
  function delay(milliseconds) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
  function readMuted() {
    try {
      return localStorage.getItem(MUTE_KEY) === "1";
    } catch (error) {
      console.debug("boot-sound: storage is unavailable", error);
      return false;
    }
  }
  function writeMuted(muted) {
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch (error) {
      console.debug("boot-sound: could not persist the mute choice", error);
    }
  }
  var BootSound = class {
    context;
    master;
    analyser;
    reverb;
    cues;
    frequency;
    started = false;
    muted;
    constructor() {
      this.muted = readMuted();
      this.context = new AudioContext({ latencyHint: "interactive" });
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      const compressor = this.context.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 22;
      compressor.ratio.value = 10;
      compressor.attack.value = 4e-3;
      compressor.release.value = 0.24;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.82;
      this.frequency = new Uint8Array(this.analyser.frequencyBinCount);
      this.reverb = this.context.createConvolver();
      this.reverb.buffer = this.impulse();
      const wet = this.context.createGain();
      wet.gain.value = 0.34;
      this.master.connect(compressor);
      this.master.connect(wet);
      wet.connect(this.reverb);
      this.reverb.connect(compressor);
      compressor.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.cues = this.buildCues();
    }
    /** Whether the person switched the score off. */
    get isMuted() {
      return this.muted;
    }
    /**
     * Ask the browser to run the score.
     * @param from - Seconds into the sequence where the caller currently is.
     * @returns Whether the score is playing, blocked by autoplay, or muted.
     */
    async start(from) {
      if (this.muted) return "muted";
      if (this.context.state !== "running") {
        try {
          await Promise.race([this.context.resume().then(() => true), delay(RESUME_TIMEOUT_MS)]);
        } catch (error) {
          console.debug("boot-sound: the audio context could not start", error);
        }
      }
      if (this.context.state !== "running") return "blocked";
      this.activate(from);
      return "playing";
    }
    /**
     * Resume from a user gesture, scheduling the remaining cues.
     * @param from - Seconds into the sequence where the caller currently is.
     * @returns Whether the score is now running.
     */
    async enable(from) {
      try {
        await this.context.resume();
      } catch (error) {
        console.debug("boot-sound: the audio context could not resume", error);
      }
      if (this.context.state !== "running") return false;
      this.muted = false;
      writeMuted(false);
      this.activate(from);
      return true;
    }
    /** Switch the master level without stopping the scheduled score. */
    setMuted(muted) {
      this.muted = muted;
      writeMuted(muted);
      const now = this.context.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, now, 0.08);
    }
    /** Read normalized spectrum buckets for the visualizer. */
    levels(count) {
      if (this.context.state !== "running" || this.muted) return new Array(count).fill(0);
      this.analyser.getByteFrequencyData(this.frequency);
      const buckets = [];
      const width = Math.max(1, Math.floor(this.frequency.length / count));
      for (let index = 0; index < count; index += 1) {
        let sum = 0;
        for (let offset = 0; offset < width; offset += 1) {
          sum += this.frequency[index * width + offset] ?? 0;
        }
        buckets.push(sum / width / 255);
      }
      return buckets;
    }
    /** Fade out and release the audio context. */
    dispose() {
      const now = this.context.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(0, now, 0.06);
      setTimeout(() => {
        void this.context.close();
      }, 700);
    }
    /** Fade the master in and schedule every cue at or after `from`. */
    activate(from) {
      const now = this.context.currentTime;
      if (!this.started) {
        this.started = true;
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setValueAtTime(1e-4, now);
        this.master.gain.linearRampToValueAtTime(MASTER_LEVEL, now + 0.55);
      } else if (!this.muted) {
        this.master.gain.cancelScheduledValues(now);
        this.master.gain.setTargetAtTime(MASTER_LEVEL, now, 0.08);
      }
      this.schedule(from);
    }
    /** Schedule the remaining score relative to the current audio clock. */
    schedule(from) {
      const origin = this.context.currentTime + 0.05;
      for (const cue of this.cues) {
        if (cue.at < from - 0.12) continue;
        cue.play(origin + Math.max(0, cue.at - from));
      }
    }
    /** Build the ordered cue list for the full sequence. */
    buildCues() {
      return [
        { at: 0, play: (at) => {
          this.click(at);
        } },
        { at: 0.02, play: (at) => {
          this.bed(at);
        } },
        { at: 0.05, play: (at) => {
          this.thump(at);
        } },
        { at: 0.42, play: (at) => {
          this.servo(at);
        } },
        { at: 0.9, play: (at) => {
          this.riser(at, 1.6);
        } },
        { at: 1.35, play: (at) => {
          this.chirp(at, 1520, -0.45);
        } },
        { at: 1.52, play: (at) => {
          this.chirp(at, 1980, 0.3);
        } },
        { at: 1.7, play: (at) => {
          this.chirp(at, 2460, -0.1);
        } },
        { at: 1.95, play: (at) => {
          this.pad(at);
        } },
        { at: 2.6, play: (at) => {
          this.ticks(at);
        } },
        { at: 3, play: (at) => {
          this.bell(at);
        } },
        { at: 3.45, play: (at) => {
          this.arp(at);
        } },
        { at: 4.3, play: (at) => {
          this.sonar(at);
        } },
        { at: 5.15, play: (at) => {
          this.riser(at, 0.9, 0.5);
        } },
        { at: 5.62, play: (at) => {
          this.impact(at);
        } },
        { at: 6, play: (at) => {
          this.chord(at);
        } }
      ];
    }
    /** Relay click that starts the sequence. */
    click(at) {
      const noise = this.context.createBufferSource();
      noise.buffer = this.noiseBuffer();
      const filter = this.context.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.value = 1600;
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.12, at + 4e-3);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      noise.start(at);
      noise.stop(at + 0.06);
    }
    /** Low reactor bed that holds the sequence together. */
    bed(at) {
      const filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(180, at);
      filter.frequency.linearRampToValueAtTime(320, at + 3);
      filter.frequency.linearRampToValueAtTime(220, at + 6);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.linearRampToValueAtTime(0.024, at + 1);
      gain.gain.setValueAtTime(0.024, at + 5.2);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 6.6);
      filter.connect(gain);
      gain.connect(this.master);
      for (const [frequency, detune] of [[55, -4], [55, 5], [82.5, 1]]) {
        const oscillator = this.context.createOscillator();
        oscillator.type = "sawtooth";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = detune;
        oscillator.connect(filter);
        oscillator.start(at);
        oscillator.stop(at + 6.65);
      }
    }
    /** Deep sub-bass ignition thump. */
    thump(at) {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(64, at);
      oscillator.frequency.exponentialRampToValueAtTime(31, at + 1.1);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.55, at + 0.018);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 1.25);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(at);
      oscillator.stop(at + 1.3);
    }
    /** Metallic servo spool-up with a slow band sweep. */
    servo(at) {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(68, at);
      oscillator.frequency.linearRampToValueAtTime(112, at + 1.4);
      const filter = this.context.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 6;
      filter.frequency.setValueAtTime(280, at);
      filter.frequency.exponentialRampToValueAtTime(1400, at + 1.3);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.05, at + 0.2);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 1.5);
      const tremolo = this.context.createOscillator();
      tremolo.frequency.value = 17;
      const depth = this.context.createGain();
      depth.gain.value = 0.018;
      tremolo.connect(depth);
      depth.connect(gain.gain);
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      oscillator.start(at);
      tremolo.start(at);
      oscillator.stop(at + 1.55);
      tremolo.stop(at + 1.55);
    }
    /** Filtered noise and a sine sweep that lift into the next phase. */
    riser(at, duration, peak = 0.1) {
      const noise = this.context.createBufferSource();
      noise.buffer = this.noiseBuffer();
      noise.loop = true;
      const filter = this.context.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 1.4;
      filter.frequency.setValueAtTime(220, at);
      filter.frequency.exponentialRampToValueAtTime(5200, at + duration);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.linearRampToValueAtTime(peak, at + duration * 0.72);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      noise.start(at);
      noise.stop(at + duration + 0.05);
      const sine = this.context.createOscillator();
      sine.type = "sine";
      sine.frequency.setValueAtTime(110, at);
      sine.frequency.exponentialRampToValueAtTime(440, at + duration);
      const sineGain = this.context.createGain();
      sineGain.gain.setValueAtTime(1e-4, at);
      sineGain.gain.linearRampToValueAtTime(0.035, at + duration * 0.8);
      sineGain.gain.exponentialRampToValueAtTime(1e-4, at + duration);
      sine.connect(sineGain);
      sineGain.connect(this.master);
      sine.start(at);
      sine.stop(at + duration + 0.05);
    }
    /** Short digital chirp with stereo placement. */
    chirp(at, frequency, pan) {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, at);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.08, at + 0.05);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.065, at + 6e-3);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 0.09);
      const panner = this.context.createStereoPanner();
      panner.pan.value = pan;
      oscillator.connect(gain);
      gain.connect(panner);
      panner.connect(this.master);
      oscillator.start(at);
      oscillator.stop(at + 0.1);
    }
    /** Warm minor pad under the convergence phase. */
    pad(at) {
      const filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, at);
      filter.frequency.linearRampToValueAtTime(1100, at + 1.4);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.linearRampToValueAtTime(0.045, at + 1.3);
      gain.gain.linearRampToValueAtTime(0.03, at + 3.4);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 4.6);
      filter.connect(gain);
      gain.connect(this.master);
      for (const frequency of [73.42, 110, 174.61]) {
        const oscillator = this.context.createOscillator();
        oscillator.type = "sawtooth";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = (Math.random() - 0.5) * 8;
        oscillator.connect(filter);
        oscillator.start(at);
        oscillator.stop(at + 4.65);
      }
    }
    /** Quiet data ticks while the wordmark decodes. */
    ticks(at) {
      for (let index = 0; index < 11; index += 1) {
        const tickAt = at + index * 0.13;
        const oscillator = this.context.createOscillator();
        oscillator.type = "square";
        oscillator.frequency.value = index % 3 === 0 ? 1760 : 1320;
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(1e-4, tickAt);
        gain.gain.exponentialRampToValueAtTime(0.018, tickAt + 4e-3);
        gain.gain.exponentialRampToValueAtTime(1e-4, tickAt + 0.035);
        oscillator.connect(gain);
        gain.connect(this.master);
        oscillator.start(tickAt);
        oscillator.stop(tickAt + 0.04);
      }
    }
    /** FM bell when the whale resolves. */
    bell(at) {
      const carrier = this.context.createOscillator();
      carrier.type = "sine";
      carrier.frequency.value = 660;
      const modulator = this.context.createOscillator();
      modulator.type = "sine";
      modulator.frequency.value = 990;
      const depth = this.context.createGain();
      depth.gain.setValueAtTime(380, at);
      depth.gain.exponentialRampToValueAtTime(12, at + 0.9);
      modulator.connect(depth);
      depth.connect(carrier.frequency);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.1, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 1.5);
      carrier.connect(gain);
      gain.connect(this.master);
      gain.connect(this.reverb);
      carrier.start(at);
      modulator.start(at);
      carrier.stop(at + 1.55);
      modulator.stop(at + 1.55);
    }
    /** Four-note rising arpeggio. */
    arp(at) {
      const notes = [293.66, 349.23, 440, 587.33];
      notes.forEach((frequency, index) => {
        const noteAt = at + index * 0.16;
        const oscillator = this.context.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(1e-4, noteAt);
        gain.gain.exponentialRampToValueAtTime(0.06, noteAt + 0.012);
        gain.gain.exponentialRampToValueAtTime(1e-4, noteAt + 0.55);
        oscillator.connect(gain);
        gain.connect(this.master);
        gain.connect(this.reverb);
        oscillator.start(noteAt);
        oscillator.stop(noteAt + 0.6);
      });
    }
    /** Two-tone sonar handshake with a long tail. */
    sonar(at) {
      for (const [index, frequency] of [880, 660].entries()) {
        const pingAt = at + index * 0.18;
        const oscillator = this.context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const gain = this.context.createGain();
        gain.gain.setValueAtTime(1e-4, pingAt);
        gain.gain.exponentialRampToValueAtTime(0.09, pingAt + 0.01);
        gain.gain.exponentialRampToValueAtTime(1e-4, pingAt + 0.95);
        oscillator.connect(gain);
        gain.connect(this.master);
        gain.connect(this.reverb);
        oscillator.start(pingAt);
        oscillator.stop(pingAt + 1);
      }
    }
    /** Power impact that lands with the final flash. */
    impact(at) {
      const oscillator = this.context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(72, at);
      oscillator.frequency.exponentialRampToValueAtTime(27, at + 1.2);
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.exponentialRampToValueAtTime(0.5, at + 0.015);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 1.4);
      oscillator.connect(gain);
      gain.connect(this.master);
      oscillator.start(at);
      oscillator.stop(at + 1.45);
      const burst = this.context.createBufferSource();
      burst.buffer = this.noiseBuffer();
      const filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2400, at);
      filter.frequency.exponentialRampToValueAtTime(180, at + 0.5);
      const burstGain = this.context.createGain();
      burstGain.gain.setValueAtTime(0.18, at);
      burstGain.gain.exponentialRampToValueAtTime(1e-4, at + 0.6);
      burst.connect(filter);
      filter.connect(burstGain);
      burstGain.connect(this.master);
      burst.start(at);
      burst.stop(at + 0.65);
    }
    /** Final sustained chord with a long reverb tail. */
    chord(at) {
      const filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2200;
      const gain = this.context.createGain();
      gain.gain.setValueAtTime(1e-4, at);
      gain.gain.linearRampToValueAtTime(0.055, at + 0.12);
      gain.gain.exponentialRampToValueAtTime(1e-4, at + 2.2);
      filter.connect(gain);
      gain.connect(this.master);
      gain.connect(this.reverb);
      for (const frequency of [146.83, 174.61, 220, 293.66]) {
        const oscillator = this.context.createOscillator();
        oscillator.type = "triangle";
        oscillator.frequency.value = frequency;
        oscillator.connect(filter);
        oscillator.start(at);
        oscillator.stop(at + 2.25);
      }
    }
    /** Two seconds of mono white noise, created once per context. */
    noiseBuffer() {
      if (this.cachedNoise !== void 0) return this.cachedNoise;
      const length = Math.floor(this.context.sampleRate * 2);
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
      this.cachedNoise = buffer;
      return buffer;
    }
    cachedNoise;
    /** Build a short stereo impulse response for the boot reverb. */
    impulse() {
      const seconds = 2.1;
      const length = Math.floor(this.context.sampleRate * seconds);
      const buffer = this.context.createBuffer(2, length, this.context.sampleRate);
      for (let channel = 0; channel < 2; channel += 1) {
        const data = buffer.getChannelData(channel);
        for (let index = 0; index < length; index += 1) {
          const decay = (1 - index / length) ** 2.6;
          data[index] = (Math.random() * 2 - 1) * decay;
        }
      }
      return buffer;
    }
  };

  // src/client/boot-splash.ts
  var STYLE_ID = "dsh-boot-splash-style";
  var SEEN_KEY = "dsh.boot.splash.plugin.seen.v1";
  var OFF_KEY = "dsh.boot.splash.off";
  var ENTER_MS = 900;
  var FORM_MS = 2600;
  var LINK_MS = 4300;
  var CHARGE_MS = 5400;
  var READY_MS = 6100;
  var MAX_HOLD_MS = 1600;
  var GLITCH_MS = 4060;
  var GLITCH_SPAN_MS = 180;
  var DECODE_START_MS = 2800;
  var DECODE_SPAN_MS = 1300;
  var SKIP_DELAY_MS = 700;
  var MAX_PARTICLES = 900;
  var ICON_SAMPLE_SIZE = 260;
  var WORDMARK = "DEEPSEEK HARNESS";
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\\|=+*#";
  var TELEMETRY_LABELS = ["NEURAL", "OPTIC", "TORQUE", "CACHE", "LINK"];
  function cssClass(name) {
    return `dbs-${name}`;
  }
  function mountStyles(doc) {
    if (doc.getElementById(STYLE_ID) !== null) return;
    const style = doc.createElement("style");
    style.id = STYLE_ID;
    style.dataset.pluginCss = "dsh-boot-splash";
    style.textContent = styles_scoped_default;
    doc.head.append(style);
  }
  function removeStyles(doc) {
    doc.getElementById(STYLE_ID)?.remove();
  }
  var BOOT_LINES = [
    { at: 380, text: "KERNEL 0x2F ......... OK" },
    { at: 760, text: "NEURAL BUS .......... LINKED" },
    { at: 1140, text: "QUANTUM CACHE ....... WARM" },
    { at: 1520, text: "PLUGIN GRAPH ........ MOUNTING" },
    { at: 1900, text: "SANDBOX ............. SEALED" },
    { at: 2280, text: "SESSION CORE ........ AWAKE" },
    { at: 2660, text: "WHALE DRIVE ......... SPINNING" },
    { at: 3040, text: "TENSOR LINK ......... 1.2 TB/s" },
    { at: 3800, text: "OPTICS .............. ALIGNED" },
    { at: 4560, text: "HANDSHAKE ........... 0x9F3A" }
  ];
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  function storageRead(kind, key) {
    try {
      return (kind === "local" ? localStorage : sessionStorage).getItem(key);
    } catch (error) {
      console.debug("boot-splash: storage is unavailable", error);
      return null;
    }
  }
  function markPlayed() {
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch (error) {
      console.debug("boot-splash: could not record the played marker", error);
    }
  }
  function shouldPlayBootSplash() {
    const mode = new URLSearchParams(window.location.search).get("boot");
    if (mode === "1") return true;
    if (mode === "0") return false;
    if (navigator.webdriver) return false;
    if (storageRead("local", OFF_KEY) === "1") return false;
    return storageRead("session", SEEN_KEY) !== "1";
  }
  var BootSplash = class {
    doc;
    root;
    canvas;
    context;
    percent;
    fill;
    tagline;
    phase;
    wordmark;
    hint;
    soundButton;
    flash;
    emblem;
    log;
    lines = [];
    telemetry = [];
    bars = [];
    reduced;
    touch;
    particles = [];
    observer;
    sound;
    audioBlocked = false;
    audioMuted = false;
    lastWordmark = "";
    lastPhase = "";
    lastTagline = "";
    lastTelemetryAt = -1;
    raf = 0;
    startTimer = 0;
    fadeTimer = 0;
    removeTimer = 0;
    soundTimer = 0;
    startedAt = 0;
    elapsed = 0;
    width = 0;
    height = 0;
    mounted = false;
    finishing = false;
    constructor(doc) {
      this.doc = doc;
      this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.touch = window.matchMedia("(pointer: coarse)").matches;
      this.root = this.element("div", cssClass("root"));
      this.root.dataset.dshSplash = "";
      this.root.setAttribute("aria-hidden", "true");
      this.canvas = doc.createElement("canvas");
      this.canvas.className = cssClass("canvas");
      this.context = this.canvas.getContext("2d");
      const grid = this.element("div", cssClass("grid"));
      const scan = this.element("div", cssClass("scan"));
      const hud = this.element("div", cssClass("hud"));
      this.flash = this.element("div", cssClass("flash"));
      const corners = ["cornerTl", "cornerTr", "cornerBl", "cornerBr"];
      for (const corner of corners) {
        hud.append(this.element("div", `${cssClass("corner")} ${cssClass(corner)}`));
      }
      const meta = this.element("div", cssClass("meta"));
      meta.append(
        this.element("span", void 0, "DSH // WEB KERNEL"),
        this.element("span", void 0, "ABYSS PROTOCOL // 047")
      );
      this.phase = this.element("div", cssClass("phase"), "PHASE 01 // IGNITION");
      this.soundButton = this.element("button", cssClass("sound"), "AUDIO ON");
      this.soundButton.type = "button";
      this.soundButton.dataset.dshSound = "";
      this.soundButton.setAttribute("aria-label", "Toggle the boot sequence sound");
      this.soundButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        void this.toggleAudio();
      });
      const center = this.element("div", cssClass("center"));
      const emblem = this.element("div", cssClass("emblem"));
      this.emblem = emblem;
      for (const ring of ["ring", "ringThree"]) {
        emblem.append(this.element("div", cssClass(ring)));
      }
      const sigil = this.element("img");
      sigil.src = new URL("favicon-dark.svg", doc.baseURI).href;
      sigil.alt = "";
      sigil.decoding = "async";
      sigil.draggable = false;
      emblem.append(sigil);
      const initialWordmark = this.scrambled(WORDMARK, 0);
      this.wordmark = this.element("h1", cssClass("wordmark"), initialWordmark);
      this.wordmark.dataset.text = initialWordmark;
      this.tagline = this.element("div", cssClass("tagline"), "ABYSSAL BOOT SEQUENCE // HANDSHAKE");
      center.append(emblem, this.wordmark, this.tagline);
      this.log = this.element("div", cssClass("log"));
      for (const line of BOOT_LINES) {
        const element = this.element("div", cssClass("line"), line.text);
        element.dataset.at = String(line.at);
        this.log.append(element);
        this.lines.push(element);
      }
      const telemetry = this.element("div", cssClass("telemetry"));
      for (const label of TELEMETRY_LABELS) {
        const entry = this.element("div", void 0, `0x0000 // ${label}`);
        telemetry.append(entry);
        this.telemetry.push(entry);
      }
      const spectrum = this.element("div", cssClass("spectrum"));
      for (let index = 0; index < 12; index += 1) {
        const bar2 = this.element("i");
        bar2.style.transform = "scaleY(0.15)";
        spectrum.append(bar2);
        this.bars.push(bar2);
      }
      const progress = this.element("div", cssClass("progress"));
      this.percent = this.element("span", void 0, "000");
      this.percent.className = cssClass("percent");
      const bar = this.element("div", cssClass("bar"));
      this.fill = this.element("div", cssClass("fill"));
      bar.append(this.fill);
      progress.append(this.percent, bar);
      this.hint = this.element("div", cssClass("skip"), "CLICK OR ESC TO SKIP");
      hud.append(meta, this.phase, this.soundButton, center, this.log, telemetry, spectrum, progress, this.hint);
      this.root.append(grid, this.canvas, scan, hud, this.flash);
      doc.body.append(this.root);
    }
    /** Create one element with an optional class and text. */
    element(tag, className, text) {
      const element = this.doc.createElement(tag);
      if (className !== void 0) element.className = className;
      if (text !== void 0) element.textContent = text;
      return element;
    }
    /** Start the overlay, the score, timers, and interaction listeners. */
    start() {
      this.resize();
      window.addEventListener("resize", this.onResize);
      const mount = this.doc.getElementById("root");
      if (mount !== null) {
        this.observer = new MutationObserver(() => {
          this.checkMounted();
        });
        this.observer.observe(mount, { childList: true });
      }
      this.checkMounted();
      this.doc.documentElement.classList.add(cssClass("lock"));
      this.doc.addEventListener("pointerdown", this.onPointer, true);
      this.doc.addEventListener("keydown", this.onKey, true);
      this.startedAt = performance.now();
      this.startSound();
      if (this.reduced) {
        this.root.classList.add(cssClass("reduced"));
        this.percent.textContent = "100";
        this.fill.style.width = "100%";
        this.startTimer = window.setTimeout(() => {
          this.finish(true);
        }, 1e3);
        return;
      }
      void this.loadTargets();
      this.raf = requestAnimationFrame(this.tick);
    }
    /** Create the score and let the browser decide whether it may start. */
    startSound() {
      try {
        this.sound = new BootSound();
      } catch (error) {
        console.debug("boot-splash: the boot score is unavailable", error);
        this.syncAudioUi();
        return;
      }
      this.audioMuted = this.sound.isMuted;
      this.syncAudioUi();
      void this.sound.start(0).then((state) => {
        if (this.finishing) return;
        this.audioBlocked = state === "blocked";
        if (state === "playing") this.audioMuted = false;
        this.syncAudioUi();
      }).catch((error) => {
        console.debug("boot-splash: the boot score could not start", error);
        this.audioBlocked = true;
        this.syncAudioUi();
      });
    }
    /** Reflect the score state in the hint and the small sound control. */
    syncAudioUi() {
      const skip = this.touch ? "TAP TO SKIP" : "CLICK OR ESC TO SKIP";
      if (this.sound === void 0) {
        this.soundButton.textContent = "AUDIO OFF";
        this.hint.textContent = skip;
        return;
      }
      this.soundButton.textContent = this.audioBlocked ? "ENABLE AUDIO" : this.audioMuted ? "AUDIO OFF" : "AUDIO ON";
      this.hint.textContent = this.audioBlocked && !this.touch ? "CLICK FOR AUDIO // ESC TO SKIP" : skip;
    }
    /** Enable the score from the current moment, or switch it on or off. */
    async toggleAudio() {
      if (this.sound === void 0) return;
      if (this.audioBlocked || this.audioMuted) {
        const playing = await this.sound.enable(this.elapsed / 1e3);
        this.audioBlocked = !playing;
        this.audioMuted = !playing;
      } else {
        this.sound.setMuted(true);
        this.audioMuted = true;
        this.audioBlocked = false;
      }
      this.syncAudioUi();
    }
    /** Enable the score from a pointer gesture without skipping. */
    async enableAudio() {
      if (this.sound === void 0) return;
      const playing = await this.sound.enable(this.elapsed / 1e3);
      this.audioBlocked = !playing;
      this.audioMuted = !playing;
      this.syncAudioUi();
    }
    /** The boot-page handoff: the renderer replaced the boot page in `#root`. */
    checkMounted() {
      const mount = this.doc.getElementById("root");
      if (mount === null || mount.childElementCount === 0) return;
      if (mount.querySelector("[data-dsh-boot]") !== null) return;
      this.mounted = true;
    }
    /** Draw one animation frame and decide whether the sequence may end. */
    tick = (now) => {
      if (this.finishing) return;
      this.elapsed = now - this.startedAt;
      this.checkMounted();
      this.updateHud();
      this.draw(this.elapsed);
      if (this.elapsed >= READY_MS && (this.mounted || this.elapsed >= READY_MS + MAX_HOLD_MS)) {
        this.finish();
        return;
      }
      this.raf = requestAnimationFrame(this.tick);
    };
    /** Project elapsed time onto the displayed percentage. */
    progressAt(t) {
      if (t <= 0) return 0;
      if (t < ENTER_MS) return t / ENTER_MS * 10;
      if (t < FORM_MS) return 10 + (t - ENTER_MS) / (FORM_MS - ENTER_MS) * 45;
      if (t < LINK_MS) return 55 + (t - FORM_MS) / (LINK_MS - FORM_MS) * 21;
      if (t < CHARGE_MS) return 76 + (t - LINK_MS) / (CHARGE_MS - LINK_MS) * 10;
      if (t < READY_MS) return 86 + (t - CHARGE_MS) / (READY_MS - CHARGE_MS) * 2;
      return 88;
    }
    /** The phase caption for the current moment. */
    phaseAt(t) {
      if (t < ENTER_MS) return "PHASE 01 // IGNITION";
      if (t < FORM_MS) return "PHASE 02 // DIAGNOSTICS";
      if (t < LINK_MS) return "PHASE 03 // CONVERGENCE";
      if (t < CHARGE_MS) return "PHASE 04 // HANDSHAKE";
      return "PHASE 05 // ONLINE";
    }
    /** Reveal the log, decode the wordmark, and animate the telemetry. */
    updateHud() {
      const t = this.elapsed;
      const progress = this.progressAt(t);
      this.percent.textContent = String(Math.round(progress)).padStart(3, "0");
      this.fill.style.width = `${progress.toFixed(1)}%`;
      for (const line of this.lines) {
        if (line.classList.contains(cssClass("lineOn"))) continue;
        if (t >= Number(line.dataset.at ?? 0)) line.classList.add(cssClass("lineOn"));
      }
      const phase = this.phaseAt(t);
      if (phase !== this.lastPhase) {
        this.phase.textContent = phase;
        this.lastPhase = phase;
      }
      const tagline = t < LINK_MS ? "ABYSSAL BOOT SEQUENCE // HANDSHAKE" : "NEURAL LINK // ESTABLISHED";
      if (tagline !== this.lastTagline) {
        this.tagline.textContent = tagline;
        this.lastTagline = tagline;
      }
      this.updateWordmark(t);
      this.updateTelemetry(t);
      this.updateSpectrum(t);
      if (t >= CHARGE_MS) this.root.classList.add(cssClass("charging"));
      const glitching = t >= GLITCH_MS && t <= GLITCH_MS + GLITCH_SPAN_MS;
      this.root.classList.toggle(cssClass("glitch"), glitching);
    }
    /** Decode the wordmark from random glyphs into the final lettering. */
    updateWordmark(t) {
      let text;
      if (t >= DECODE_START_MS + DECODE_SPAN_MS) {
        text = WORDMARK;
      } else if (t < DECODE_START_MS) {
        text = this.scrambled(WORDMARK, t);
      } else {
        const reveal = Math.floor(clamp((t - DECODE_START_MS) / DECODE_SPAN_MS, 0, 1) * WORDMARK.length);
        text = "";
        for (let index = 0; index < WORDMARK.length; index += 1) {
          const character = WORDMARK[index] ?? "";
          if (character === " ") {
            text += " ";
          } else if (index < reveal) {
            text += character;
          } else {
            text += GLYPHS[(Math.floor(t / 55) + index * 11) % GLYPHS.length] ?? "?";
          }
        }
      }
      if (text === this.lastWordmark) return;
      this.lastWordmark = text;
      this.wordmark.textContent = text;
      this.wordmark.dataset.text = text;
    }
    /** Replace every non-space character with a moving glyph. */
    scrambled(text, t) {
      let scrambled = "";
      for (let index = 0; index < text.length; index += 1) {
        const character = text[index] ?? "";
        scrambled += character === " " ? " " : GLYPHS[(Math.floor(t / 55) + index * 13) % GLYPHS.length] ?? "?";
      }
      return scrambled;
    }
    /** Refresh the right-edge hex telemetry about seven times a second. */
    updateTelemetry(t) {
      if (t - this.lastTelemetryAt < 140) return;
      this.lastTelemetryAt = t;
      this.telemetry.forEach((line, index) => {
        const value = Math.floor(Math.random() * 65535).toString(16).padStart(4, "0").toUpperCase();
        line.textContent = `0x${value} // ${TELEMETRY_LABELS[index] ?? "SYS"}`;
      });
    }
    /** Drive the small spectrum from the live analyser, or an idle breath. */
    updateSpectrum(t) {
      const levels = this.sound?.levels(this.bars.length) ?? [];
      this.bars.forEach((bar, index) => {
        const level = levels[index] ?? 0.12 + 0.06 * Math.sin(t * 2e-3 + index * 0.8);
        bar.style.transform = `scaleY(${clamp(0.12 + level * 1.15, 0.12, 1).toFixed(3)})`;
      });
    }
    /** Sample the product icon into particle targets. */
    async loadTargets() {
      for (const icon of ["favicon-dark.svg", "favicon.svg"]) {
        try {
          const targets = await this.sampleIcon(icon);
          if (targets.length === 0) continue;
          this.particles = this.createParticles(targets);
          return;
        } catch (error) {
          console.debug("boot-splash: icon sampling failed", icon, error);
        }
      }
    }
    /** Rasterize one icon and collect the covered sample points. */
    async sampleIcon(icon) {
      const surface = this.doc.createElement("canvas");
      surface.width = ICON_SAMPLE_SIZE;
      surface.height = ICON_SAMPLE_SIZE;
      const context = surface.getContext("2d", { willReadFrequently: true });
      if (context === null) return [];
      const image = new Image();
      image.decoding = "async";
      image.src = new URL(icon, this.doc.baseURI).href;
      await image.decode();
      context.clearRect(0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE);
      context.drawImage(image, 0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE);
      const pixels = context.getImageData(0, 0, ICON_SAMPLE_SIZE, ICON_SAMPLE_SIZE).data;
      const targets = [];
      const step = 3;
      for (let y = 0; y < ICON_SAMPLE_SIZE; y += step) {
        for (let x = 0; x < ICON_SAMPLE_SIZE; x += step) {
          const alpha = pixels[(y * ICON_SAMPLE_SIZE + x) * 4 + 3] ?? 0;
          if (alpha < 96) continue;
          targets.push({
            nx: (x - ICON_SAMPLE_SIZE / 2) / ICON_SAMPLE_SIZE,
            ny: (y - ICON_SAMPLE_SIZE / 2) / ICON_SAMPLE_SIZE
          });
        }
      }
      return targets;
    }
    /** Shuffle and cap the sampled targets, and assign each one an orbit. */
    createParticles(targets) {
      return targets.slice().sort(() => Math.random() - 0.5).slice(0, MAX_PARTICLES).map((target) => ({
        ...target,
        angle: Math.random() * Math.PI * 2,
        radiusFactor: 0.45 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        delay: Math.random() * 300,
        size: 0.8 + Math.random() * 1.3,
        tint: Math.random() < 0.62 ? "96, 165, 250" : "34, 211, 238"
      }));
    }
    /** Match the canvas backing store to the viewport. */
    onResize = () => {
      this.resize();
    };
    /** Match the canvas backing store to the viewport. */
    resize() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvas.width = Math.round(this.width * ratio);
      this.canvas.height = Math.round(this.height * ratio);
      this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    /** Draw the glow, the sonar rings, and the forming silhouette. */
    draw(t) {
      const context = this.context;
      if (context === null) return;
      const width = this.width;
      const height = this.height;
      const rect = this.emblem.getBoundingClientRect();
      const emblemWidth = rect.width === 0 ? Math.min(width, height) * 0.25 : rect.width;
      const cx = rect.width === 0 ? width / 2 : rect.left + rect.width / 2;
      const cy = rect.height === 0 ? height * 0.45 : rect.top + rect.height / 2;
      const span = emblemWidth * 0.7;
      context.clearRect(0, 0, width, height);
      this.drawGlow(context, cx, cy, span, t);
      this.drawRings(context, cx, cy, width, height, t);
      this.drawParticles(context, cx, cy, span, t);
    }
    /** Paint the central halo behind the emblem. */
    drawGlow(context, cx, cy, span, t) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 2e-3);
      const glow = context.createRadialGradient(cx, cy, 0, cx, cy, span);
      glow.addColorStop(0, `rgba(77, 107, 254, ${(0.1 + pulse * 0.05).toFixed(3)})`);
      glow.addColorStop(0.55, "rgba(34, 211, 238, 0.02)");
      glow.addColorStop(1, "rgba(0, 0, 0, 0)");
      context.fillStyle = glow;
      context.beginPath();
      context.arc(cx, cy, span, 0, Math.PI * 2);
      context.fill();
    }
    /** Expand three offset sonar rings. */
    drawRings(context, cx, cy, width, height, t) {
      const maximum = Math.min(width, height) * 0.62;
      context.lineWidth = 1;
      for (let index = 0; index < 3; index += 1) {
        const phase = (t + index * 1e3) % 3e3 / 3e3;
        const radius = 70 + phase * maximum;
        context.beginPath();
        context.arc(cx, cy, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(77, 107, 254, ${(0.16 * (1 - phase)).toFixed(3)})`;
        context.stroke();
      }
    }
    /** Stream the particles from their orbits onto the whale silhouette. */
    drawParticles(context, cx, cy, span, t) {
      const reach = Math.max(this.width, this.height);
      for (const particle of this.particles) {
        const formation = clamp((t - FORM_MS - particle.delay) / 1500, 0, 1);
        const eased = 1 - (1 - formation) ** 3;
        const orbit = particle.angle + t * 12e-5;
        const radius = reach * particle.radiusFactor;
        const startX = cx + Math.cos(orbit) * radius;
        const startY = cy + Math.sin(orbit) * radius * 0.62;
        const targetX = cx + particle.nx * span;
        const targetY = cy + particle.ny * span;
        const loosened = 1 - eased;
        const x = startX + (targetX - startX) * eased + Math.sin(t * 16e-4 + particle.phase) * 3 * loosened;
        const y = startY + (targetY - startY) * eased + Math.cos(t * 14e-4 + particle.phase) * 2 * loosened;
        const alpha = (0.1 + 0.9 * eased) * (0.72 + 0.28 * Math.sin(t * 3e-3 + particle.phase));
        context.fillStyle = `rgba(${particle.tint}, ${alpha.toFixed(3)})`;
        context.fillRect(x, y, particle.size, particle.size);
      }
    }
    /** Skip from a click, or enable audio when autoplay was blocked. */
    onPointer = (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-dsh-sound]") !== null) return;
      if (this.audioBlocked) {
        event.preventDefault();
        void this.enableAudio();
        return;
      }
      this.requestSkip();
    };
    /** Skip from Escape, Enter, or Space. */
    onKey = (event) => {
      if (event.key !== "Escape" && event.key !== "Enter" && event.key !== " ") return;
      this.requestSkip();
    };
    /** End the sequence early without letting a stray first-frame click do it. */
    requestSkip() {
      if (this.finishing || performance.now() - this.startedAt < SKIP_DELAY_MS) return;
      this.finish(true);
    }
    /** Flash, fade, and remove the overlay. */
    finish(fast = false) {
      if (this.finishing) return;
      this.finishing = true;
      cancelAnimationFrame(this.raf);
      window.clearTimeout(this.startTimer);
      this.observer?.disconnect();
      this.doc.removeEventListener("pointerdown", this.onPointer, true);
      this.doc.removeEventListener("keydown", this.onKey, true);
      window.removeEventListener("resize", this.onResize);
      if (fast) {
        this.sound?.dispose();
      } else {
        this.soundTimer = window.setTimeout(() => {
          this.sound?.dispose();
        }, 1200);
      }
      this.percent.textContent = "100";
      this.fill.style.width = "100%";
      this.tagline.textContent = "SYSTEM ONLINE";
      this.root.classList.add(cssClass("online"), cssClass("charging"));
      this.flash.classList.add(cssClass("flashOn"));
      this.fadeTimer = window.setTimeout(() => {
        this.root.classList.add(cssClass("out"));
      }, fast ? 120 : 260);
      this.removeTimer = window.setTimeout(() => {
        this.root.remove();
        this.doc.documentElement.classList.remove(cssClass("lock"));
        removeStyles(this.doc);
      }, fast ? 460 : 900);
    }
    /** Remove the overlay immediately when the plugin is disposed. */
    dispose() {
      this.finishing = true;
      cancelAnimationFrame(this.raf);
      window.clearTimeout(this.startTimer);
      window.clearTimeout(this.fadeTimer);
      window.clearTimeout(this.removeTimer);
      window.clearTimeout(this.soundTimer);
      this.observer?.disconnect();
      this.doc.removeEventListener("pointerdown", this.onPointer, true);
      this.doc.removeEventListener("keydown", this.onKey, true);
      window.removeEventListener("resize", this.onResize);
      this.sound?.dispose();
      this.doc.documentElement.classList.remove(cssClass("lock"));
      this.root.remove();
      removeStyles(this.doc);
    }
  };
  function startBootSplash() {
    const doc = document;
    if (doc.querySelector("[data-dsh-splash]") !== null) return void 0;
    const mode = new URLSearchParams(window.location.search).get("boot");
    const booting = doc.readyState === "loading" || doc.querySelector("[data-dsh-boot]") !== null;
    if (mode !== "1" && !booting) return void 0;
    if (!shouldPlayBootSplash()) return void 0;
    mountStyles(doc);
    markPlayed();
    const splash = new BootSplash(doc);
    splash.start();
    return () => {
      splash.dispose();
    };
  }

  // src/boot/auto.ts
  startBootSplash();
})();
