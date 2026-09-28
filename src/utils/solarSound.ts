// Web Audio API Multi-Pack Sound Synthesizer for SolOS
// 100% client-side, zero external audio asset dependency.
import { SoundPackId, SoundPackDefinition } from '../types/launcher';

export const SOUND_PACKS: SoundPackDefinition[] = [
  {
    id: 'solar-harmonix',
    name: 'Solar Harmonix',
    tagline: 'Warm Golden Acoustic',
    badge: 'Default OS',
    category: 'Acoustic',
    description: 'Golden acoustic harmonics, radiant bell chimes, and smooth liquid glass keystrokes',
    accentColor: '#F59E0B',
    icon: '☀️',
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon 2088',
    tagline: 'Sci-Fi FM Synthesizer',
    badge: 'Electric Neon',
    category: 'Electronic',
    description: 'Bioluminescent FM synthesizer frequencies, sub-bass pulse alerts, and crisp tactile cyber switches',
    accentColor: '#00F0FF',
    icon: '⚡',
  },
  {
    id: 'zen-bamboo',
    name: 'Zen Bamboo & Rain',
    tagline: 'Meditative Organic Nature',
    badge: 'Relaxing 🧘',
    category: 'Nature',
    description: 'Tibetan singing bowls, gentle resonant bamboo woodblocks, and soft water droplet pebbles',
    accentColor: '#10B981',
    icon: '🎋',
  },
  {
    id: '8bit-arcade',
    name: '8-Bit Chiptune Arcade',
    tagline: 'Retro Pixel Gaming',
    badge: 'Retro 80s',
    category: 'Retro',
    description: 'Nostalgic square-wave arpeggio ringtones, coin power-up alerts, and clicky gameboy blips',
    accentColor: '#F43F5E',
    icon: '👾',
  },
  {
    id: 'mechanical-typewriter',
    name: 'Luxe Mechanical Typewriter',
    tagline: 'Vintage Tactile Machinery',
    badge: 'Tactile Click',
    category: 'Vintage',
    description: 'Classic vintage rotary telephone bell ring, carriage return ding, and authentic mechanical typewriter clacks',
    accentColor: '#D97706',
    icon: '⌨️',
  },
  {
    id: 'ethereal-crystal',
    name: 'Ethereal Crystal Harp',
    tagline: 'Prismatic Glass Celestial',
    badge: 'Pure Harmonic',
    category: 'Crystal',
    description: 'Pure singing quartz crystal bowls, prism shimmer notifications, and delicate glass droplets',
    accentColor: '#818CF8',
    icon: '💎',
  },
];

class SolarAudioEngine {
  private ctx: AudioContext | null = null;
  private isMusicPlaying = false;
  private musicInterval: any = null;
  private chordIndex = 0;
  
  // Ringtone playback state
  private ringtoneInterval: any = null;
  private isRingtoneActive = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft tactile UI tap feedback
  playTap(enabled: boolean = true, pack: SoundPackId = 'solar-harmonix') {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      if (pack === 'cyber-neon') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.04);
        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (pack === 'zen-bamboo') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(580, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.06);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.06);
      } else if (pack === '8bit-arcade') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(640, t);
        osc.frequency.setValueAtTime(960, t + 0.02);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      } else if (pack === 'mechanical-typewriter') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.03);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
      } else if (pack === 'ethereal-crystal') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(1050, t + 0.08);
        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.08);
      } else {
        // Default solar-harmonix
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(840, t);
        osc.frequency.exponentialRampToValueAtTime(320, t + 0.05);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.05);
      }
    } catch {}
  }

  // Keyboard typing sound synthesized according to active sound pack
  playTypingSound(enabled: boolean = true, pack: SoundPackId = 'solar-harmonix', keyChar?: string) {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      // Slight pitch variance per key for human tactile realism
      const variance = (Math.random() - 0.5) * 40;

      switch (pack) {
        case 'mechanical-typewriter': {
          // Sharp authentic typewriter key strike + mechanical housing ring
          const strikeOsc = this.ctx.createOscillator();
          const strikeGain = this.ctx.createGain();
          strikeOsc.type = 'triangle';
          strikeOsc.frequency.setValueAtTime(380 + variance, t);
          strikeOsc.frequency.exponentialRampToValueAtTime(70, t + 0.035);
          strikeGain.gain.setValueAtTime(0.18, t);
          strikeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

          strikeOsc.connect(strikeGain);
          strikeGain.connect(this.ctx.destination);
          strikeOsc.start(t);
          strikeOsc.stop(t + 0.035);

          // Subtle metallic latch ping
          if (keyChar === 'Enter' || keyChar === ' ') {
            const bell = this.ctx.createOscillator();
            const bellGain = this.ctx.createGain();
            bell.type = 'sine';
            bell.frequency.setValueAtTime(1860, t + 0.02);
            bellGain.gain.setValueAtTime(0.1, t + 0.02);
            bellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
            bell.connect(bellGain);
            bellGain.connect(this.ctx.destination);
            bell.start(t + 0.02);
            bell.stop(t + 0.25);
          }
          break;
        }

        case 'cyber-neon': {
          // High-tech tactile cyber switch click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1400 + variance * 2, t);
          osc.frequency.exponentialRampToValueAtTime(220, t + 0.03);
          gain.gain.setValueAtTime(0.07, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }

        case 'zen-bamboo': {
          // Organic wooden waterdrop tap
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(720 + variance, t);
          osc.frequency.exponentialRampToValueAtTime(340, t + 0.05);
          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }

        case '8bit-arcade': {
          // Classic retro 8-bit blip
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          const baseFreq = keyChar === 'Enter' ? 880 : 520;
          osc.frequency.setValueAtTime(baseFreq + variance, t);
          osc.frequency.setValueAtTime(baseFreq * 1.5, t + 0.015);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.035);
          break;
        }

        case 'ethereal-crystal': {
          // Delicate crystal glass droplet tap
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1600 + variance * 2, t);
          osc.frequency.exponentialRampToValueAtTime(980, t + 0.06);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }

        case 'solar-harmonix':
        default: {
          // Warm glass droplet click
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(920 + variance, t);
          osc.frequency.exponentialRampToValueAtTime(410, t + 0.04);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.04);
          break;
        }
      }
    } catch {}
  }

  // Notification chime synthesized according to active sound pack
  playNotification(enabled: boolean = true, pack: SoundPackId = 'solar-harmonix') {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      switch (pack) {
        case 'cyber-neon': {
          // Dual futuristic laser pulse with low resonance
          const notes = [440, 880, 1760];
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t + idx * 0.05);
            gain.gain.setValueAtTime(0.08, t + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.18);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.05);
            osc.stop(t + idx * 0.05 + 0.2);
          });
          break;
        }

        case 'zen-bamboo': {
          // Harmonic bamboo marimba two-note chime
          const notes = [587.33, 880]; // D5, A5
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.09);
            gain.gain.setValueAtTime(0.12, t + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.09 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.09);
            osc.stop(t + idx * 0.09 + 0.45);
          });
          break;
        }

        case '8bit-arcade': {
          // Retro power-up coin jump
          const notes = [987.77, 1318.51]; // B5, E6
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, t + idx * 0.06);
            gain.gain.setValueAtTime(0.08, t + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.06);
            osc.stop(t + idx * 0.06 + 0.18);
          });
          break;
        }

        case 'mechanical-typewriter': {
          // Vintage desk bell ding
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2093, t); // C7
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.6);
          break;
        }

        case 'ethereal-crystal': {
          // Crystalline prism shimmer (C6, E6, G6, B6)
          const notes = [1046.5, 1318.5, 1567.98, 1975.53];
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t + idx * 0.04);
            gain.gain.setValueAtTime(0.05, t + idx * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.04 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.04);
            osc.stop(t + idx * 0.04 + 0.45);
          });
          break;
        }

        case 'solar-harmonix':
        default: {
          // Sunny major third chime
          const notes = [659.25, 880, 1046.5]; // E5, A5, C6
          notes.forEach((freq, idx) => {
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t + idx * 0.07);
            gain.gain.setValueAtTime(0.09, t + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.07 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(t + idx * 0.07);
            osc.stop(t + idx * 0.07 + 0.4);
          });
          break;
        }
      }
    } catch {}
  }

  // Ringtone synthesizer loop for theme previews & phone simulation
  playRingtone(enabled: boolean = true, pack: SoundPackId = 'solar-harmonix', onEnd?: () => void) {
    if (!enabled) return;
    this.stopRingtone();
    try {
      this.initContext();
      if (!this.ctx) return;
      this.isRingtoneActive = true;

      const playPattern = () => {
        if (!this.ctx || !this.isRingtoneActive) return;
        const t = this.ctx.currentTime;

        switch (pack) {
          case 'cyber-neon': {
            // Cyberpunk 2088 Neon Synth Arpeggio
            const melody = [587.33, 783.99, 880.0, 1174.66, 880.0, 1046.5];
            melody.forEach((freq, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sawtooth';
              osc.frequency.setValueAtTime(freq, t + i * 0.12);
              gain.gain.setValueAtTime(0.07, t + i * 0.12);
              gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.14);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + i * 0.12);
              osc.stop(t + i * 0.12 + 0.15);
            });
            break;
          }

          case 'zen-bamboo': {
            // Tibetan Singing Bowl Harmonic Bell
            const melody = [440.0, 523.25, 659.25, 783.99];
            melody.forEach((freq, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, t + i * 0.22);
              gain.gain.setValueAtTime(0.09, t + i * 0.22);
              gain.gain.exponentialRampToValueAtTime(0.0005, t + i * 0.22 + 0.9);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + i * 0.22);
              osc.stop(t + i * 0.22 + 1.0);
            });
            break;
          }

          case '8bit-arcade': {
            // 8-bit Retro Game Stage Clear Theme
            const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
            melody.forEach((freq, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'square';
              osc.frequency.setValueAtTime(freq, t + i * 0.1);
              gain.gain.setValueAtTime(0.06, t + i * 0.1);
              gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.12);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + i * 0.1);
              osc.stop(t + i * 0.1 + 0.13);
            });
            break;
          }

          case 'mechanical-typewriter': {
            // Vintage rotary telephone bell ring (Double Ring)
            for (let ring = 0; ring < 2; ring++) {
              const ringStart = t + ring * 0.25;
              const osc1 = this.ctx.createOscillator();
              const osc2 = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc1.type = 'sine';
              osc2.type = 'sine';
              osc1.frequency.setValueAtTime(1050, ringStart);
              osc2.frequency.setValueAtTime(1250, ringStart);
              gain.gain.setValueAtTime(0.09, ringStart);
              gain.gain.exponentialRampToValueAtTime(0.001, ringStart + 0.18);
              osc1.connect(gain);
              osc2.connect(gain);
              gain.connect(this.ctx.destination);
              osc1.start(ringStart);
              osc2.start(ringStart);
              osc1.stop(ringStart + 0.2);
              osc2.stop(ringStart + 0.2);
            }
            break;
          }

          case 'ethereal-crystal': {
            // Shimmering Celestial Crystal Harp
            const melody = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0];
            melody.forEach((freq, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, t + i * 0.14);
              gain.gain.setValueAtTime(0.06, t + i * 0.14);
              gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.14 + 0.6);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + i * 0.14);
              osc.stop(t + i * 0.14 + 0.65);
            });
            break;
          }

          case 'solar-harmonix':
          default: {
            // Solar Golden Bell Fanfare (Warm Dmaj)
            const melody = [587.33, 739.99, 880.0, 1174.66, 1479.98];
            melody.forEach((freq, i) => {
              if (!this.ctx) return;
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'triangle';
              osc.frequency.setValueAtTime(freq, t + i * 0.12);
              gain.gain.setValueAtTime(0.08, t + i * 0.12);
              gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.45);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start(t + i * 0.12);
              osc.stop(t + i * 0.12 + 0.5);
            });
            break;
          }
        }
      };

      playPattern();
      // Repeat ringtone pattern every 2.4 seconds
      this.ringtoneInterval = setInterval(playPattern, 2400);
    } catch {}
  }

  stopRingtone() {
    this.isRingtoneActive = false;
    if (this.ringtoneInterval) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  isRingtonePlaying() {
    return this.isRingtoneActive;
  }

  // Crisp sunny app launch chime
  playLaunch(enabled: boolean = true) {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      
      const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Sunny Major Chord)
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.035);

        gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.035);
        gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + idx * 0.035 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.035 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.035);
        osc.stop(this.ctx.currentTime + idx * 0.035 + 0.4);
      });
    } catch {}
  }

  // Camera shutter click
  playShutter(enabled: boolean = true) {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(450, this.ctx.currentTime);
      gain1.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start();
      osc1.stop(this.ctx.currentTime + 0.03);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(800, this.ctx.currentTime + 0.06);
      gain2.gain.setValueAtTime(0.15, this.ctx.currentTime + 0.06);
      gain2.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(this.ctx.currentTime + 0.06);
      osc2.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  // Tactile Calculator Key Click
  playKey(enabled: boolean = true, isOp = false) {
    if (!enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isOp ? 620 : 440, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {}
  }

  // Serene Sunny Acoustic Ambient Music Synthesizer
  startSunnyMusic(volume: number = 0.5) {
    if (this.isMusicPlaying) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      this.isMusicPlaying = true;

      const chordProgression = [
        [293.66, 369.99, 440.0, 554.37], // Dmaj7
        [392.00, 493.88, 587.33, 739.99], // Gmaj7
        [369.99, 440.00, 554.37, 659.25], // F#m7
        [440.00, 554.37, 659.25, 880.00], // A7
      ];

      const playChord = () => {
        if (!this.ctx || !this.isMusicPlaying) return;
        const currentChord = chordProgression[this.chordIndex % chordProgression.length];
        this.chordIndex++;

        currentChord.forEach((freq, noteIdx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

          osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + noteIdx * 0.08);

          const noteTime = this.ctx.currentTime + noteIdx * 0.08;
          const targetVol = (volume * 0.035);
          gain.gain.setValueAtTime(0, noteTime);
          gain.gain.linearRampToValueAtTime(targetVol, noteTime + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 3.0);
        });
      };

      playChord();
      this.musicInterval = setInterval(playChord, 3200);
    } catch {}
  }

  stopSunnyMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  isMusicActive() {
    return this.isMusicPlaying;
  }
}

export const solarSound = new SolarAudioEngine();
