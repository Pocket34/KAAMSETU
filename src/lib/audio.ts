/**
 * Web Audio API procedural sound synthesis for KAAMSETU Cinematic Experience.
 * Zero external audio file dependencies — 100% self-contained, lightweight, and responsive.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Warm ambient sub-drone as the singularity point appears.
   */
  public playSubDrone() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A1
      osc.frequency.exponentialRampToValueAtTime(82.4, ctx.currentTime + 2.5); // Rise to E2

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 3.0);
    } catch {
      // Audio context policy fallback
    }
  }

  /**
   * Shimmering harmonic resonance chime as the bridge emblem expands.
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [440, 659.25, 880, 1318.5]; // A4, E5, A5, E6
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, ctx.currentTime);

        const startTime = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.06 / (i + 1), startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.8);
      });
    } catch {
      // Ignore audio restriction errors
    }
  }

  /**
   * Kinetic energy burst on "ENTER KAAMSETU" click.
   */
  public playEnterWhoosh() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.3);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.7);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.75);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.8);
    } catch {
      // Ignore audio restriction errors
    }
  }

  /**
   * Subtle click for buttons and interaction.
   */
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
