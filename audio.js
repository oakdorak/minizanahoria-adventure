// --- Shared Audio Engine (Web Audio API) ---
const SharedAudio = {
  ctx: null,
  filter: null,

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();

      // Clinical Low-Pass Filter at 1000Hz (Sensory hypersensitivity protection)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1, this.ctx.currentTime);
      this.filter.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  playOscillator({ freq, type = 'sine', delay = 0, attackTime, sustainTime = 0, releaseTime, peakGain }) {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + delay);

    gainNode.gain.setValueAtTime(0, now + delay);
    gainNode.gain.linearRampToValueAtTime(peakGain, now + delay + attackTime);

    if (sustainTime > 0) {
      gainNode.gain.setValueAtTime(peakGain, now + delay + sustainTime);
    }

    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + releaseTime);

    osc.connect(gainNode);
    gainNode.connect(this.filter);

    osc.start(now + delay);
    osc.stop(now + delay + releaseTime);
  }
};
