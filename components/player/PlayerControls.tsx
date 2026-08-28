"use client";

import { useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import type { PlayerSong } from "@/lib/songs";
import ListeningIndicator from "./ListeningIndicator";

type PlayerControlsProps = {
  songs: PlayerSong[];
  modeId: string;
};

type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

type YouTubePlayerConstructor = new (
  element: HTMLElement,
  options: {
    videoId?: string;
    playerVars?: {
      autoplay?: number;
      controls?: number;
      rel?: number;
      modestbranding?: number;
      playsinline?: number;
      enablejsapi?: number;
    };
    events?: {
      onReady?: () => void;
      onStateChange?: (event: { data: number }) => void;
      onError?: (event: { data: number }) => void;
    };
  }
) => YouTubePlayer;

type YouTubeNamespace = {
  Player: YouTubePlayerConstructor;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
};

declare global {
  interface Window {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let youtubeApiPromise: Promise<YouTubeNamespace> | null = null;

function loadYouTubeAPI(): Promise<YouTubeNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("YouTube API can only load in the browser.")
    );
  }

  if (window.YT?.Player) {
    return Promise.resolve(window.YT);
  }

  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;

    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();

      if (window.YT?.Player) {
        resolve(window.YT);
      } else {
        reject(
          new Error("YouTube API loaded but YT.Player is unavailable.")
        );
      }
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]'
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    script.onerror = () => {
      reject(new Error("Failed to load YouTube IFrame API."));
    };

    document.head.appendChild(script);
  });

  return youtubeApiPromise;
}

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
      <path
        d="M8 5.5v13l10-6.5-10-6.5Z"
        fill="currentColor"
      />
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

export default function PlayerControls({
  songs,
  modeId,
}: PlayerControlsProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const youtubeContainerRef =
    useRef<HTMLDivElement | null>(null);

  const youtubePlayerRef =
    useRef<YouTubePlayer | null>(null);

  const youtubeReadyRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [youtubeReady, setYoutubeReady] = useState(false);

  const sessionIdRef = useRef<string | null>(null);
  const sessionStartedAtRef = useRef<number | null>(null);

  const supabaseRef = useRef(createClient());

  const resumeAfterChangeRef = useRef(false);

  const progressIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  const currentSong = songs[currentIndex];

  const stopProgressTimer = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const finishListeningSession = async () => {
    const sessionId = sessionIdRef.current;
    const startedAt = sessionStartedAtRef.current;

    if (!sessionId || !startedAt) {
      return;
    }

    const durationSeconds = Math.max(
      0,
      Math.floor((Date.now() - startedAt) / 1000)
    );

    sessionIdRef.current = null;
    sessionStartedAtRef.current = null;

    try {
      await supabaseRef.current.rpc(
        "finish_listening_session",
        {
          p_session_id: sessionId,
          p_duration_seconds: durationSeconds,
        }
      );
    } catch (error) {
      console.error(
        "Listening session finish failed:",
        error
      );
    }
  };

  const startListeningSession = async () => {
    if (!currentSong || sessionIdRef.current) {
      return;
    }

    const sourceUrl = currentSong.youtube_video_id
      ? `https://www.youtube.com/watch?v=${currentSong.youtube_video_id}`
      : currentSong.audio_url;

    if (!sourceUrl) {
      return;
    }

    const sessionId = crypto.randomUUID();

    try {
      const { error } = await supabaseRef.current.rpc(
        "start_listening_session",
        {
          p_session_id: sessionId,
          p_mode_id: modeId,
          p_audio_url: sourceUrl,
        }
      );

      if (error) {
        console.error(
          "Could not start listening session:",
          error
        );
        return;
      }

      sessionIdRef.current = sessionId;
      sessionStartedAtRef.current = Date.now();
    } catch (error) {
      console.error(
        "Listening session start failed:",
        error
      );
    }
  };

  const startProgressTimer = () => {
    stopProgressTimer();

    progressIntervalRef.current = setInterval(() => {
      if (
        currentSong?.youtube_video_id &&
        youtubePlayerRef.current &&
        youtubeReadyRef.current
      ) {
        const duration =
          youtubePlayerRef.current.getDuration();

        const current =
          youtubePlayerRef.current.getCurrentTime();

        if (
          Number.isFinite(duration) &&
          duration > 0
        ) {
          setProgress(
            Math.min(
              100,
              Math.max(0, (current / duration) * 100)
            )
          );
        }

        return;
      }

      const audio = audioRef.current;

      if (
        !audio ||
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      ) {
        return;
      }

      setProgress(
        Math.min(
          100,
          Math.max(
            0,
            (audio.currentTime / audio.duration) * 100
          )
        )
      );
    }, 250);
  };

  useEffect(() => {
    let cancelled = false;

    const setupYouTube = async () => {
      if (
        !currentSong?.youtube_video_id ||
        !youtubeContainerRef.current
      ) {
        youtubeReadyRef.current = false;
        setYoutubeReady(false);
        return;
      }

      try {
        const YT = await loadYouTubeAPI();

        if (cancelled || !youtubeContainerRef.current) {
          return;
        }

        youtubePlayerRef.current?.destroy();
        youtubePlayerRef.current = null;

        youtubeReadyRef.current = false;
        setYoutubeReady(false);

        const container = youtubeContainerRef.current;
        container.innerHTML = "";

        const player = new YT.Player(container, {
          videoId: currentSong.youtube_video_id,

          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
          },

          events: {
            onReady: () => {
              if (cancelled) return;

              youtubeReadyRef.current = true;
              setYoutubeReady(true);
              setProgress(0);
              setIsPlaying(false);

              if (resumeAfterChangeRef.current) {
                resumeAfterChangeRef.current = false;
                player.playVideo();
              }
            },

            onStateChange: (event) => {
              if (cancelled) return;

              if (
                event.data === YT.PlayerState.PLAYING
              ) {
                setIsPlaying(true);
                startProgressTimer();
                void startListeningSession();
              }

              if (
                event.data === YT.PlayerState.PAUSED
              ) {
                setIsPlaying(false);
                stopProgressTimer();
                void finishListeningSession();
              }

              if (
                event.data === YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
                stopProgressTimer();
                setProgress(100);

                void finishListeningSession();

                if (songs.length > 0) {
                  resumeAfterChangeRef.current = true;

                  setCurrentIndex((current) =>
                    current >= songs.length - 1
                      ? 0
                      : current + 1
                  );
                }
              }
            },

            onError: (event) => {
              console.error(
                "YouTube player error:",
                event.data
              );

              setIsPlaying(false);
              stopProgressTimer();
            },
          },
        });

        youtubePlayerRef.current = player;
      } catch (error) {
        console.error(
          "YouTube player setup failed:",
          error
        );
      }
    };

    void setupYouTube();

    return () => {
      cancelled = true;
      stopProgressTimer();

      youtubePlayerRef.current?.destroy();
      youtubePlayerRef.current = null;

      youtubeReadyRef.current = false;
    };
  }, [currentSong?.youtube_video_id, currentIndex, songs.length]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (
      currentSong?.youtube_video_id ||
      !currentSong?.audio_url
    ) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.src = currentSong.audio_url;
    audio.load();

    if (resumeAfterChangeRef.current) {
      resumeAfterChangeRef.current = false;

      const playAudio = async () => {
        try {
          await audio.play();
        } catch (error) {
          console.error("Audio resume failed:", error);
        }
      };

      void playAudio();
    }
  }, [
    currentSong?.audio_url,
    currentSong?.youtube_video_id,
    currentIndex,
  ]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handlePlay = () => {
      if (currentSong?.youtube_video_id) return;

      setIsPlaying(true);
      startProgressTimer();
      void startListeningSession();
    };

    const handlePause = () => {
      if (currentSong?.youtube_video_id) return;

      setIsPlaying(false);
      stopProgressTimer();
      void finishListeningSession();
    };

    const handleTimeUpdate = () => {
      if (
        !Number.isFinite(audio.duration) ||
        audio.duration <= 0
      ) {
        return;
      }

      setProgress(
        Math.min(
          100,
          Math.max(
            0,
            (audio.currentTime / audio.duration) * 100
          )
        )
      );
    };

    const handleEnded = () => {
      if (currentSong?.youtube_video_id) return;

      void finishListeningSession();

      stopProgressTimer();
      setIsPlaying(false);
      setProgress(100);

      if (songs.length > 0) {
        resumeAfterChangeRef.current = true;

        setCurrentIndex((current) =>
          current >= songs.length - 1
            ? 0
            : current + 1
        );
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    currentSong?.youtube_video_id,
    currentSong?.audio_url,
    songs.length,
  ]);

  const togglePlay = async () => {
    if (currentSong?.youtube_video_id) {
      const player = youtubePlayerRef.current;

      if (!player || !youtubeReady) {
        return;
      }

      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }

      return;
    }

    const audio = audioRef.current;

    if (!audio || !currentSong?.audio_url) {
      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        console.error(
          "Audio playback failed:",
          error
        );
      }
    } else {
      audio.pause();
    }
  };

  const changeSong = async (direction: 1 | -1) => {
    if (songs.length === 0) return;

    const wasPlaying = isPlaying;

    await finishListeningSession();
    stopProgressTimer();

    try {
      youtubePlayerRef.current?.stopVideo();
    } catch {
      // Player cleanup only.
    }

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setIsPlaying(false);
    setProgress(0);

    resumeAfterChangeRef.current = wasPlaying;

    setCurrentIndex((current) => {
      if (direction === 1) {
        return current >= songs.length - 1
          ? 0
          : current + 1;
      }

      return current <= 0
        ? songs.length - 1
        : current - 1;
    });
  };

  const goNext = () => {
    void changeSong(1);
  };

  const goPrevious = () => {
    void changeSong(-1);
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionId = sessionIdRef.current;
      const startedAt = sessionStartedAtRef.current;

      if (!sessionId || !startedAt) return;

      const durationSeconds = Math.max(
        0,
        Math.floor((Date.now() - startedAt) / 1000)
      );

      void supabaseRef.current.rpc(
        "finish_listening_session",
        {
          p_session_id: sessionId,
          p_duration_seconds: durationSeconds,
        }
      );

      sessionIdRef.current = null;
      sessionStartedAtRef.current = null;
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );

      stopProgressTimer();
    };
  }, []);

  if (!currentSong) {
    return (
      <div className="player-controls-stack">
        <ListeningIndicator
          modeId={modeId}
          isPlaying={false}
        />

        <div className="player-bar">
          <div className="song-info">
            <strong>No song available</strong>
            <span>RAAHI</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="player-controls-stack">
      <ListeningIndicator
        modeId={modeId}
        isPlaying={isPlaying}
      />

      <div
        ref={youtubeContainerRef}
        className="raahi-youtube-player"
        aria-hidden="true"
      />

      <audio
        ref={audioRef}
        preload="auto"
        playsInline
      />

      <div className="player-bar">
        <div className="song-artwork">
          {currentSong.artwork_url ? (
            <img
              src={currentSong.artwork_url}
              alt=""
            />
          ) : (
            <div className="song-artwork-inner" />
          )}
        </div>

        <div className="song-info">
          <strong>
            {currentSong.title_hindi ||
              currentSong.title}
          </strong>

          <span>
            {currentSong.artist_hindi ||
              currentSong.artist ||
              "RAAHI"}
          </span>
        </div>

        <div className="player-controls">
          <button
            type="button"
            className="player-control"
            onClick={goPrevious}
            aria-label="Previous song"
          >
            <PreviousIcon />
          </button>

          <button
            type="button"
            className="player-control player-play"
            onClick={togglePlay}
            aria-label={
              isPlaying ? "Pause" : "Play"
            }
          >
            {isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>

          <button
            type="button"
            className="player-control"
            onClick={goNext}
            aria-label="Next song"
          >
            <NextIcon />
          </button>
        </div>

        <div className="player-progress">
          <span
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}