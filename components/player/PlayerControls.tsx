/* eslint-disable @next/next/no-img-element */
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PlayerSong } from "@/lib/songs";
import ListeningIndicator from "./ListeningIndicator";
import AudioVisualizer from "./AudioVisualizer";

type PlayerControlsProps = {
  songs: PlayerSong[];
  modeId: string;
};

function PreviousIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 5v14M18 6l-9 6 9 6V6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M18 5v14M6 6l9 6-9 6V6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 5v14M16 5v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VolumeIcon({ volume, muted }: { volume: number; muted: boolean }) {
  if (muted || volume === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
        <path
          d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (volume < 0.5) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
        <path
          d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
      <path
        d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!seconds || Number.isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function PlayerControls({
  songs,
  modeId,
}: PlayerControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthContextRef = useRef<AudioContext | null>(null);
  const synthGainRef = useRef<GainNode | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadedDuration, setLoadedDuration] = useState<number | null>(null);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);

  const currentSong = songs[currentIndex] ?? songs[0];
  const activeDuration = loadedDuration || currentSong?.duration_seconds || 210;

  // Stop synthetic audio if running
  const stopSynth = useCallback(() => {
    if (synthGainRef.current && synthContextRef.current) {
      try {
        synthGainRef.current.gain.setTargetAtTime(
          0,
          synthContextRef.current.currentTime,
          0.1
        );
        setTimeout(() => {
          synthContextRef.current?.close().catch(() => {});
          synthContextRef.current = null;
          synthGainRef.current = null;
        }, 150);
      } catch {}
    }
    setIsSynthPlaying(false);
  }, []);

  // Ambient sound synthesizer fallback if audio URL fails
  const startAmbientSynth = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      stopSynth();
      const ctx = new AudioCtx();
      synthContextRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(volume * 0.18, ctx.currentTime + 1.2);
      masterGain.connect(ctx.destination);
      synthGainRef.current = masterGain;

      // Create soothing pink noise / rain & road texture
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // Warm soothing harmonic pad drone (Indian Tanpura / ambient drone chord: C3 - G3 - C4)
      const frequencies = [130.81, 196.00, 261.63];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime);

        // Gentle subtle vibrato/lfo
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2 + idx * 0.1, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
      });

      setIsSynthPlaying(true);
      setIsPlaying(true);
    } catch (e) {
      console.warn("Ambient synth initialization:", e);
    }
  }, [stopSynth, volume]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;

    if (isPlaying) {
      if (audio && !audio.paused) {
        audio.pause();
      }
      stopSynth();
      setIsPlaying(false);
      return;
    }

    if (audio && currentSong?.audio_url) {
      try {
        await audio.play();
        setIsPlaying(true);
        return;
      } catch (err) {
        console.warn("Direct audio playback failed, falling back to ambient synth:", err);
      }
    }

    // Play ambient journey soundscape
    startAmbientSynth();
  }, [isPlaying, currentSong, startAmbientSynth, stopSynth]);

  const goNext = useCallback(() => {
    if (songs.length <= 1) return;
    stopSynth();
    setShouldAutoplay(isPlaying);
    setCurrentIndex((current) =>
      current >= songs.length - 1 ? 0 : current + 1
    );
  }, [songs.length, isPlaying, stopSynth]);

  const goPrevious = useCallback(() => {
    if (songs.length <= 1) return;
    stopSynth();
    setShouldAutoplay(isPlaying);
    setCurrentIndex((current) =>
      current <= 0 ? songs.length - 1 : current - 1
    );
  }, [songs.length, isPlaying, stopSynth]);

  // Audio loading & track change effect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    audio.pause();
    audio.currentTime = 0;

    if (currentSong.audio_url) {
      audio.load();
    }

    if (shouldAutoplay) {
      const playAudio = async () => {
        try {
          if (currentSong.audio_url) {
            await audio.play();
            setIsPlaying(true);
          } else {
            startAmbientSynth();
          }
        } catch {
          // Fallback to ambient journey synth on playback error
          startAmbientSynth();
        } finally {
          setShouldAutoplay(false);
        }
      };
      playAudio();
    }
  }, [currentIndex, currentSong, shouldAutoplay, startAmbientSynth]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const current = audio.currentTime;
      const dur = audio.duration || currentSong?.duration_seconds || 210;
      setCurrentTime(current);
      if (dur > 0) {
        setProgress((current / dur) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      if (audio.duration && !Number.isNaN(audio.duration)) {
        setLoadedDuration(audio.duration);
      }
    };

    const handleEnded = () => {
      if (songs.length <= 1) {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        return;
      }
      setShouldAutoplay(true);
      setCurrentIndex((current) =>
        current >= songs.length - 1 ? 0 : current + 1
      );
    };

    const handlePause = () => {
      if (!isSynthPlaying) {
        setIsPlaying(false);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleError = () => {
      if (isPlaying) {
        startAmbientSynth();
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("error", handleError);
    };
  }, [songs.length, currentSong, isPlaying, isSynthPlaying, startAmbientSynth]);

  // Sync volume with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (synthGainRef.current && synthContextRef.current) {
      try {
        synthGainRef.current.gain.setTargetAtTime(
          isMuted ? 0 : volume * 0.18,
          synthContextRef.current.currentTime,
          0.05
        );
      } catch {}
    }
  }, [volume, isMuted]);

  // Clean up synth on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, [stopSynth]);

  // Simulated progress timer when synth fallback is active
  useEffect(() => {
    if (!isSynthPlaying || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        const dur = activeDuration;
        setProgress((next / dur) * 100);
        if (next >= dur) {
          goNext();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSynthPlaying, isPlaying, activeDuration, goNext]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newProgress = Number(event.target.value);
    const targetDuration = activeDuration;

    if (audio && audio.duration) {
      audio.currentTime = (newProgress / 100) * targetDuration;
    }
    setCurrentTime((newProgress / 100) * targetDuration);
    setProgress(newProgress);
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = Number(event.target.value);
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        if (e.shiftKey) {
          goNext();
        } else if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            activeDuration,
            audioRef.current.currentTime + 5
          );
        }
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        if (e.shiftKey) {
          goPrevious();
        } else if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5);
        }
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrevious, activeDuration, togglePlay]);

  if (!currentSong) {
    return (
      <div className="player-controls-stack">
        <ListeningIndicator modeId={modeId} isPlaying={false} />
        <div className="player-bar">
          <div className="song-info">
            <strong>सफ़र की शुरुआत</strong>
            <span>संगीत लोड हो रहा है...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-controls-stack">
      {/* Top row: Listening indicator & Sound Wave Visualizer */}
      <div className="player-top-indicator-row">
        <ListeningIndicator modeId={modeId} isPlaying={isPlaying} />
        <AudioVisualizer isPlaying={isPlaying} barCount={16} />
      </div>

      <div className={`player-bar ${isPlaying ? "player-bar-active" : ""}`}>
        <audio
          ref={audioRef}
          src={currentSong.audio_url ?? undefined}
          preload="metadata"
        />

        {/* Artwork with subtle vinyl rotation motion when playing */}
        <div className={`song-artwork ${isPlaying ? "song-artwork-playing" : ""}`}>
          {currentSong.artwork_url ? (
            <img src={currentSong.artwork_url} alt="" />
          ) : (
            <div className="song-artwork-inner" />
          )}
          {isPlaying && <span className="song-artwork-glow-ring" />}
        </div>

        {/* Song info with crossfade animation key */}
        <div className="song-info" key={currentSong.id}>
          <strong className="raahi-text-reveal">
            {currentSong.title_hindi || currentSong.title}
          </strong>
          <span className="raahi-text-reveal">
            {currentSong.artist_hindi || currentSong.artist || "राही"}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="player-controls">
          <button
            type="button"
            className="player-control raahi-btn-tactile"
            onClick={goPrevious}
            aria-label="Previous song (Shift + ←)"
            title="Previous (Shift + ←)"
          >
            <PreviousIcon />
          </button>

          <button
            type="button"
            className={`player-control player-play raahi-btn-tactile ${
              isPlaying ? "player-play-active" : ""
            }`}
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            {isPlaying && <span className="player-play-pulse-ring" />}
          </button>

          <button
            type="button"
            className="player-control raahi-btn-tactile"
            onClick={goNext}
            aria-label="Next song (Shift + →)"
            title="Next (Shift + →)"
          >
            <NextIcon />
          </button>
        </div>

        {/* Timestamp */}
        <div className="player-time-display">
          <span>{formatTime(currentTime)}</span>
          <span className="player-time-separator">/</span>
          <span>{formatTime(activeDuration)}</span>
        </div>

        {/* Progress Bar */}
        <div className="player-progress">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="player-progress-range"
            style={
              {
                "--player-progress": `${progress}%`,
              } as React.CSSProperties
            }
            aria-label="Song progress"
          />
        </div>

        {/* Volume Control */}
        <div
          className="player-volume-wrapper"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button
            type="button"
            className="player-control player-volume-btn raahi-btn-tactile"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
            title={isMuted ? "Unmute (M)" : "Mute (M)"}
          >
            <VolumeIcon volume={volume} muted={isMuted} />
          </button>

          <div
            className={`player-volume-popover ${
              showVolumeSlider ? "player-volume-popover-open" : ""
            }`}
          >
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="player-volume-range"
              aria-label="Volume slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}