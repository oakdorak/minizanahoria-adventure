/* ==========================================================================
   MINIZANAHORIA: SHARED AUDIO ENGINE (Web Audio API)
   Ansiolítico auditivo para neurodivergencia - Escala Lidia + Cmaj9
   ========================================================================== */

const AudioEngine = {
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

  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    // C Major 9th chord (Bill Evans scale): C4, E4, G4, B4, D5
    const notes = [261.63, 329.63, 392.00, 493.88, 587.33];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'triangle'; // Smooth, low-sensory wave
      
      const delay = index * 0.06; // Strum arpeggiator delay
      const attackTime = 0.15; // 150ms soft attack
      
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.04, now + delay + attackTime);
      gainNode.gain.setValueAtTime(0.04, now + delay + 1.0);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.8);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + 1.8);
    });
  },

  playError() {
    this.init();
    const now = this.ctx.currentTime;
    // Low, soothing minor warning sweep (no sudden scare sound)
    const notes = [196.00, 185.00]; // G3 to Gb3 (descending semitone slide)
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      
      const delay = index * 0.1;
      
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.06, now + delay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.4);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.4);
    });
  },

  playClick() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5 quick soft tick
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.03, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    
    osc.connect(gainNode);
    gainNode.connect(this.filter);
    
    osc.start(now);
    osc.stop(now + 0.08);
  },
  
  playActionUnlock() {
    this.init();
    const now = this.ctx.currentTime;
    // Sparkly Lydian arpeggio (C4 -> F#4 -> G4)
    const notes = [261.63, 369.99, 392.00];
    
    notes.forEach((freq, index) => {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = 'sine';
      
      const delay = index * 0.08;
      
      osc.frequency.setValueAtTime(freq, now + delay);
      
      gainNode.gain.setValueAtTime(0, now + delay);
      gainNode.gain.linearRampToValueAtTime(0.05, now + delay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.8);
      
      osc.connect(gainNode);
      gainNode.connect(this.filter);
      
      osc.start(now + delay);
      osc.stop(now + delay + 0.8);
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioEngine;
}
