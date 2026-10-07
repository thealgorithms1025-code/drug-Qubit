// DoseAlert - Multilingual Voice & Speech Synthesis Service
// Powers regional-language text-to-speech with audio wave visualizer

class VoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.queue = [];
    this.currentIndex = 0;
    this.onStateChangeCallbacks = [];
    this.audioContext = null;

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  notify(state) {
    this.onStateChangeCallbacks.forEach(cb => cb(state));
  }

  // Play a single spoken phrase or greeting
  speakText(text, lang = "hi", onEnd = () => {}) {
    if (!this.synth) {
      console.warn("SpeechSynthesis not available in this browser environment.");
      this.playSyntheticTone(600, 200);
      onEnd();
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Configure language-specific speech parameters
    const langMap = {
      hi: "hi-IN",
      bn: "bn-IN",
      ta: "ta-IN",
      en: "en-IN"
    };

    utterance.lang = langMap[lang] || "hi-IN";
    utterance.rate = 0.92; // slightly measured for elderly comprehension
    utterance.pitch = 1.0;

    // Pick best native voice if available
    const voices = this.loadVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang) || v.lang.replace('_', '-').startsWith(lang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      this.notify({ isPlaying: true, isPaused: false, text, lang });
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      this.notify({ isPlaying: false, isPaused: false });
      onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech error, proceeding with tone fallback:", e);
      this.isPlaying = false;
      this.isPaused = false;
      this.notify({ isPlaying: false, isPaused: false, error: true });
      onEnd();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis speak invocation failed:", err);
      this.playSyntheticTone(440, 300);
      onEnd();
    }
  }

  // Play a sequential queue of alerts
  playAlertQueue(alertsList, lang = "hi") {
    if (!alertsList || alertsList.length === 0) return;
    this.queue = alertsList;
    this.currentIndex = 0;
    this.playNextInQueue(lang);
  }

  playNextInQueue(lang) {
    if (this.currentIndex >= this.queue.length) {
      this.isPlaying = false;
      this.notify({ isPlaying: false, finished: true });
      return;
    }

    const currentItem = this.queue[this.currentIndex];
    this.notify({
      isPlaying: true,
      currentItem,
      index: this.currentIndex,
      total: this.queue.length
    });

    this.speakText(currentItem.speechText, lang, () => {
      this.currentIndex++;
      if (this.currentIndex < this.queue.length) {
        // Natural 1-second pause between polypharmacy alert warnings
        setTimeout(() => this.playNextInQueue(lang), 900);
      } else {
        this.isPlaying = false;
        this.notify({ isPlaying: false, finished: true });
      }
    });
  }

  pause() {
    if (this.synth && this.isPlaying) {
      this.synth.pause();
      this.isPaused = true;
      this.notify({ isPlaying: false, isPaused: true });
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
      this.notify({ isPlaying: true, isPaused: false });
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.isPaused = false;
    this.queue = [];
    this.currentIndex = 0;
    this.notify({ isPlaying: false, isPaused: false, stopped: true });
  }

  // Backup Web Audio tone chime if speech hardware is restricted
  playSyntheticTone(freq = 440, durationMs = 150) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioContext) this.audioContext = new AudioCtx();

      const ctx = this.audioContext;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (durationMs / 1000));
    } catch (e) {
      // AudioContext muted/unsupported
    }
  }
}

export const voiceService = new VoiceService();
