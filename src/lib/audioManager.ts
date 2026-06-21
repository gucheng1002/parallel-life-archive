type AudioKey =
  | "quizBgm"
  | "roomTone"
  | "cameraShutter"
  | "flashSoft"
  | "waterRipple"
  | "distantOcean"
  | "voicePrepare"
  | "voiceConfirming"
  | "voiceFailed"
  | "voiceReconfirm";

const AUDIO_SOURCES: Record<AudioKey, string> = {
  quizBgm: "/audio/bgm/quiz_bgm.mp3",
  roomTone: "/audio/sfx/room_tone.mp3",
  cameraShutter: "/audio/sfx/camera_shutter.mp3",
  flashSoft: "/audio/sfx/flash_soft.mp3",
  waterRipple: "/audio/sfx/water_ripple.mp3",
  distantOcean: "/audio/sfx/distant_ocean.mp3",
  voicePrepare: "/audio/voice/voice_prepare.mp3",
  voiceConfirming: "/audio/voice/voice_confirming.mp3",
  voiceFailed: "/audio/voice/voice_failed.mp3",
  voiceReconfirm: "/audio/voice/voice_reconfirm.mp3",
};

const DUCKED_LOOP_KEYS: AudioKey[] = [
  "roomTone",
  "waterRipple",
  "distantOcean",
];

class AudioManager {
  private enabled = false;
  private tracks = new Map<AudioKey, HTMLAudioElement>();
  private timers = new Set<number>();
  private fadeFrames = new Map<AudioKey, number>();
  private desiredVolumes = new Map<AudioKey, number>();
  private introTriggered = new Set<string>();
  private voiceDuckCount = 0;

  loadAudio(key: AudioKey) {
    if (typeof window === "undefined") return null;

    const existing = this.tracks.get(key);
    if (existing) return existing;

    const audio = new Audio(AUDIO_SOURCES[key]);
    audio.preload = "auto";
    audio.addEventListener(
      "error",
      () => {
        console.warn(`[audio] failed to load: ${AUDIO_SOURCES[key]}`);
      },
      { once: true }
    );

    this.tracks.set(key, audio);
    return audio;
  }

  playSfx(key: AudioKey, volume: number) {
    if (!this.enabled) return;

    const source = this.loadAudio(key);
    if (!source) return;

    const audio = source.cloneNode(true) as HTMLAudioElement;
    audio.volume = volume;
    audio.preload = "auto";
    audio.addEventListener(
      "error",
      () => {
        console.warn(`[audio] failed to play sfx: ${AUDIO_SOURCES[key]}`);
      },
      { once: true }
    );
    void audio.play().catch((error) => {
      console.warn(`[audio] play blocked: ${AUDIO_SOURCES[key]}`, error);
    });
  }

  playVoice(key: AudioKey, volume: number) {
    if (!this.enabled) return;

    const source = this.loadAudio(key);
    if (!source) return;

    const audio = source.cloneNode(true) as HTMLAudioElement;
    let releasedDuck = false;
    const releaseDuck = () => {
      if (releasedDuck) return;
      releasedDuck = true;
      this.endVoiceDuck();
    };

    audio.volume = volume;
    audio.preload = "auto";
    audio.addEventListener("ended", releaseDuck, { once: true });
    audio.addEventListener(
      "error",
      () => {
        console.warn(`[audio] failed to play voice: ${AUDIO_SOURCES[key]}`);
        releaseDuck();
      },
      { once: true }
    );

    this.beginVoiceDuck();
    void audio.play().catch((error) => {
      console.warn(`[audio] voice play blocked: ${AUDIO_SOURCES[key]}`, error);
      releaseDuck();
    });
  }

  playLoop(key: AudioKey, volume: number) {
    if (!this.enabled) return;

    const audio = this.loadAudio(key);
    if (!audio) return;

    this.cancelFade(key);
    audio.loop = true;
    this.setTrackVolume(key, volume);
    void audio.play().catch((error) => {
      console.warn(`[audio] loop play blocked: ${AUDIO_SOURCES[key]}`, error);
    });
  }

  fadeTo(
    key: AudioKey,
    targetVolume: number,
    durationMs = 1000,
    pauseWhenSilent = false
  ) {
    const audio = this.loadAudio(key);
    if (!audio) return;

    this.cancelFade(key);

    if (!this.enabled) {
      audio.pause();
      return;
    }

    if (targetVolume > 0 && audio.paused) {
      audio.volume = 0;
      void audio.play().catch((error) => {
        console.warn(`[audio] fade play blocked: ${AUDIO_SOURCES[key]}`, error);
      });
    }

    const startVolume = this.desiredVolumes.get(key) ?? audio.volume;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress =
        durationMs <= 0 ? 1 : Math.min((now - startTime) / durationMs, 1);
      this.setTrackVolume(
        key,
        startVolume + (targetVolume - startVolume) * progress
      );

      if (progress < 1) {
        this.fadeFrames.set(key, window.requestAnimationFrame(step));
        return;
      }

      this.fadeFrames.delete(key);
      this.setTrackVolume(key, targetVolume);

      if (pauseWhenSilent && targetVolume === 0) {
        audio.pause();
      }
    };

    this.fadeFrames.set(key, window.requestAnimationFrame(step));
  }

  stop(key?: AudioKey) {
    if (key) {
      this.cancelFade(key);
      const audio = this.tracks.get(key);
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
      this.desiredVolumes.set(key, 0);
      return;
    }

    this.clearTimers();
    this.fadeFrames.forEach((frame) => window.cancelAnimationFrame(frame));
    this.fadeFrames.clear();
    this.tracks.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.desiredVolumes.clear();
    this.voiceDuckCount = 0;
  }

  prepareIntroAudio(enabled = true) {
    this.enabled = enabled;
    this.stop();
    this.introTriggered.clear();

    if (!this.enabled) return;

    this.loadAudio("roomTone");
    this.loadAudio("cameraShutter");
    this.loadAudio("flashSoft");
    this.loadAudio("waterRipple");
    this.loadAudio("distantOcean");
  }

  startIntroAudio(enabled = true, introStartTime = performance.now()) {
    this.prepareIntroAudio(enabled);

    if (!this.enabled) return;

    const elapsed = Math.max(0, performance.now() - introStartTime);
    const scheduleAt = (delayMs: number, callback: () => void) => {
      const remainingMs = delayMs - elapsed;

      if (remainingMs <= 0) {
        callback();
        return;
      }

      this.schedule(remainingMs, callback);
    };

    this.triggerIntroOnce("room-tone", () => {
      this.playLoop("roomTone", 0.1);
    });

    scheduleAt(1800, () => {
      this.triggerIntroOnce("camera-flash", () => {
        this.playSfx("cameraShutter", 0.6);
        this.playSfx("flashSoft", 0.32);
      });
    });

    scheduleAt(3500, () => {
      this.triggerIntroOnce("water-ripple", () => {
        this.playLoop("waterRipple", 0);
        this.fadeTo("waterRipple", 0.2, 2200);
      });
    });

    scheduleAt(5000, () => {
      this.triggerIntroOnce("distant-ocean", () => {
        this.playLoop("distantOcean", 0);
        this.fadeTo("distantOcean", 0.14, 2600);
      });
    });

    scheduleAt(25000, () => {
      this.returnSelectionAudio();
    });
  }

  enterQuizAudio() {
    this.clearTimers();
    if (!this.enabled) return;

    this.fadeTo("roomTone", 0, 1200, true);
    this.fadeTo("waterRipple", 0, 1600, true);
    this.fadeTo("distantOcean", 0, 1600, true);
    this.playLoop("quizBgm", 0);
    this.fadeTo("quizBgm", 0.32, 1800);
  }

  returnSelectionAudio() {
    this.clearTimers();
    if (!this.enabled) return;

    this.fadeTo("quizBgm", 0, 1200, true);
    this.playLoop("roomTone", 0);
    this.fadeTo("roomTone", 0.1, 1200);
    this.playLoop("waterRipple", 0);
    this.fadeTo("waterRipple", 0.22, 1400);
    this.playLoop("distantOcean", 0);
    this.fadeTo("distantOcean", 0.18, 1600);
  }

  private loadAll() {
    (Object.keys(AUDIO_SOURCES) as AudioKey[]).forEach((key) => {
      this.loadAudio(key);
    });
  }

  private schedule(delayMs: number, callback: () => void) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delayMs);

    this.timers.add(timer);
  }

  private clearTimers() {
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
  }

  private cancelFade(key: AudioKey) {
    const frame = this.fadeFrames.get(key);
    if (frame) {
      window.cancelAnimationFrame(frame);
      this.fadeFrames.delete(key);
    }
  }

  private triggerIntroOnce(key: string, callback: () => void) {
    if (this.introTriggered.has(key)) return;

    this.introTriggered.add(key);
    callback();
  }

  private setTrackVolume(key: AudioKey, volume: number) {
    const audio = this.tracks.get(key);
    if (!audio) return;

    this.desiredVolumes.set(key, volume);
    audio.volume = this.getActualVolume(key, volume);
  }

  private getActualVolume(key: AudioKey, desiredVolume: number) {
    const duckFactor =
      this.voiceDuckCount > 0 && DUCKED_LOOP_KEYS.includes(key) ? 0.7 : 1;

    return Math.max(0, Math.min(desiredVolume * duckFactor, 1));
  }

  private beginVoiceDuck() {
    this.voiceDuckCount += 1;
    this.applyDuckState();
  }

  private endVoiceDuck() {
    this.voiceDuckCount = Math.max(this.voiceDuckCount - 1, 0);
    this.applyDuckState();
  }

  private applyDuckState() {
    DUCKED_LOOP_KEYS.forEach((key) => {
      const audio = this.tracks.get(key);
      if (!audio) return;

      const desiredVolume = this.desiredVolumes.get(key) ?? audio.volume;
      audio.volume = this.getActualVolume(key, desiredVolume);
    });
  }
}

export const audioManager = new AudioManager();
