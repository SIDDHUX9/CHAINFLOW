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
 * Play a light, crisp digital click when hovering/clicking buttons.
 */
export function playClick() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = "sine";
  osc.frequency.setValueAtTime(1000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.04);
  
  gain.gain.setValueAtTime(0.02, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/**
 * Play a low-pass futuristic digital blip during screen transitions.
 */
export function playBlip() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12);
  
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/**
 * Play an ascending double chime on successful wallet connection.
 */
export function playWalletConnect() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  
  const playNote = (freq: number, delay: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now + delay); // C5 start
    osc.frequency.exponentialRampToValueAtTime(freq, now + delay + 0.05);
    
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.05, now + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    osc.start(now + delay);
    osc.stop(now + delay + duration);
  };
  
  playNote(659.25, 0, 0.18); // E5
  playNote(987.77, 0.08, 0.28); // B5
}

/**
 * Play a descending warning chime when wallet is disconnected.
 */
export function playWalletDisconnect() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  
  const playNote = (freq: number, delay: number, duration: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    gain.gain.setValueAtTime(0.04, now + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    osc.frequency.setValueAtTime(freq, now + delay);
    
    osc.start(now + delay);
    osc.stop(now + delay + duration);
  };
  
  playNote(440.00, 0, 0.15); // A4
  playNote(293.66, 0.08, 0.25); // D4
}

/**
 * Play a rich, beautiful major chord cascade on successful transaction confirmation.
 */
export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx || ctx.state === "suspended") return;
  
  const now = ctx.currentTime;
  
  const playNote = (freq: number, delay: number, duration: number, vol: number = 0.06) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + delay);
    
    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(vol, now + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);
    
    osc.start(now + delay);
    osc.stop(now + delay + duration);
  };
  
  playNote(523.25, 0, 0.35);    // C5
  playNote(659.25, 0.06, 0.35);  // E5
  playNote(783.99, 0.12, 0.35);  // G5
  playNote(1046.50, 0.18, 0.5);  // C6
}
