/**
 * High-tech tactile sound synthesizer using Web Audio API.
 * Provides game-like audio clicks, harmonic tones, and milestone chimes without external mp3s.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read user preference from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('adzkar_sound_muted');
      if (saved !== null) {
        this.isMuted = saved === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('adzkar_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public vibrate(pattern: number | number[] = 30) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore if blocked by browser
      }
    }
  }

  /**
   * Tactile click for tasbih tap or menu select
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(820, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.045);
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * Crisp UI switch / button tone
   */
  public playBeep(freq: number = 660, duration: number = 0.06) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // ignore
    }
  }

  /**
   * Ascending futuristic cyber harmonic chime upon reaching target count (e.g. 33 / 100)
   */
  public playMilestone() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + index * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.14, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
      this.vibrate([40, 60, 80]);
    } catch {
      // ignore
    }
  }

  /**
   * Subtle glitch / navigation slide sound
   */
  public playGlitch() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.02);
      osc.frequency.setValueAtTime(220, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  /**
   * Melodic harmonic chime for prayer adzan reminder (Reverberant tone based on Maqam Rast / Bayati intervals)
   */
  public playAdzanTone() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Harmonic sequence: F4, A4, C5, F5 (Allahu Akbar uplifting chord sequence)
      const sequence = [
        { freq: 349.23, time: 0.0, dur: 0.9 },   // F4
        { freq: 440.00, time: 0.4, dur: 1.1 },   // A4
        { freq: 523.25, time: 0.9, dur: 1.4 },   // C5
        { freq: 698.46, time: 1.5, dur: 2.2 },   // F5
        { freq: 523.25, time: 2.6, dur: 1.2 },   // C5
        { freq: 440.00, time: 3.2, dur: 1.8 },   // A4
        { freq: 349.23, time: 4.2, dur: 3.0 },   // F4 sustained root
      ];

      sequence.forEach((note) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + note.time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.18, startTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + note.dur + 0.1);
      });

      this.vibrate([100, 80, 100, 80, 200]);
    } catch {
      // AudioContext unavailable
    }
  }
}

export const sound = new SoundController();
