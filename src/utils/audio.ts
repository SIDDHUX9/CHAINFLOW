// Web Audio API Sound Synthesizer for ChainFlow
// Synthesizes retro-cybernetic tones natively in the browser without loading heavy external sound files.

let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // Resume context if browser suspended it due to user interaction policy
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  
  return audioCtx;
}

/**
 * Play a light, resonant dry woodblock strike (hyōshigi).
 */
export function playClick() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  osc1.connect(gainNode);
  osc2.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(880, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(650, ctx.currentTime + 0.04);
  
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1320, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(950, ctx.currentTime + 0.04);
  
  gainNode.gain.setValueAtTime(0.025, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  
  osc1.start();
  osc2.start();
  osc1.stop(ctx.currentTime + 0.04);
  osc2.stop(ctx.currentTime + 0.04);
}

/**
 * Play a gentle bamboo water-dropper (shishi-odoshi) hollow drop sound.
 */
export function playBlip() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = "sine";
  // Pitch rises quickly like a bubble or droplet escaping a hollow reed
  osc.frequency.setValueAtTime(320, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.07);
  
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.07);
}

/**
 * Play an ascending pentatonic Koto pluck sequence on wallet connection.
 */
export function playWalletConnect() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  
  const playKotoNote = (freq: number, delay: number, duration: number) => {
    const oscBase = ctx.createOscillator();
    const oscPluck = ctx.createOscillator();
    const gainBase = ctx.createGain();
    const gainPluck = ctx.createGain();
    
    oscBase.connect(gainBase);
    oscPluck.connect(gainPluck);
    gainBase.connect(ctx.destination);
    gainPluck.connect(ctx.destination);
    
    oscBase.type = "triangle";
    oscBase.frequency.setValueAtTime(freq, now + delay);
    
    gainBase.gain.setValueAtTime(0, now + delay);
    gainBase.gain.linearRampToValueAtTime(0.05, now + delay + 0.015);
    gainBase.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    // Quick high metallic pluck transient
    oscPluck.type = "sine";
    oscPluck.frequency.setValueAtTime(freq * 3, now + delay);
    gainPluck.gain.setValueAtTime(0, now + delay);
    gainPluck.gain.linearRampToValueAtTime(0.025, now + delay + 0.005);
    gainPluck.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);
    
    oscBase.start(now + delay);
    oscPluck.start(now + delay);
    oscBase.stop(now + delay + duration);
    oscPluck.stop(now + delay + duration);
  };
  
  // Traditional scale notes
  playKotoNote(523.25, 0, 0.45);    // C5
  playKotoNote(659.25, 0.08, 0.45);  // E5
  playKotoNote(880.00, 0.16, 0.6);   // A5
}

/**
 * Play a deep, resonant temple bell (Kanshō) chime on wallet disconnect.
 */
export function playWalletDisconnect() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  // Blend fundamental deep frequencies with non-harmonic overtones for authentic bell timbre
  const overtones = [146.83, 293.66, 440.00, 587.33]; // D3, D4, A4, D5
  
  overtones.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = idx === 0 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now);
    
    const maxVol = idx === 0 ? 0.08 : 0.035;
    const decay = idx === 0 ? 1.6 : idx === 1 ? 1.0 : 0.6;
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(maxVol, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + decay);
    
    osc.start(now);
    osc.stop(now + decay);
  });
}

/**
 * Play a rich, beautiful Japanese Koto chord arpeggio cascade on success.
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  
  const playKotoNote = (freq: number, delay: number, duration: number) => {
    const oscBase = ctx.createOscillator();
    const oscPluck = ctx.createOscillator();
    const gainBase = ctx.createGain();
    const gainPluck = ctx.createGain();
    
    oscBase.connect(gainBase);
    oscPluck.connect(gainPluck);
    gainBase.connect(ctx.destination);
    gainPluck.connect(ctx.destination);
    
    oscBase.type = "triangle";
    oscBase.frequency.setValueAtTime(freq, now + delay);
    
    gainBase.gain.setValueAtTime(0, now + delay);
    gainBase.gain.linearRampToValueAtTime(0.045, now + delay + 0.015);
    gainBase.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    oscPluck.type = "sine";
    oscPluck.frequency.setValueAtTime(freq * 3.1, now + delay);
    gainPluck.gain.setValueAtTime(0, now + delay);
    gainPluck.gain.linearRampToValueAtTime(0.02, now + delay + 0.005);
    gainPluck.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);
    
    oscBase.start(now + delay);
    oscPluck.start(now + delay);
    oscBase.stop(now + delay + duration);
    oscPluck.stop(now + delay + duration);
  };
  
  // Ascending Sakura Pentatonic cascade
  playKotoNote(440.00, 0, 0.6);     // A4
  playKotoNote(523.25, 0.05, 0.6);   // C5
  playKotoNote(659.25, 0.10, 0.6);   // E5
  playKotoNote(698.46, 0.15, 0.8);   // F5
  playKotoNote(880.00, 0.20, 1.2);   // A5
}
