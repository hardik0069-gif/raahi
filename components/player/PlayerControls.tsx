"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import type { PlayerSong } from "@/lib/songs";

import ListeningIndicator from "./ListeningIndicator";

type PlayerControlsProps = {
  songs: PlayerSong[];
  modeId: string;
};

function PreviousIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M8 5.5v13l10-6.5-10-6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
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
  const audioRef =
    useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [shouldAutoplay, setShouldAutoplay] =
    useState(false);

  const currentSong = songs[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setProgress(0);
    setShouldAutoplay(false);
  }, [modeId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;

    setProgress(0);

    if (currentSong.audio_url) {
      audio.load();
    }

    if (
      shouldAutoplay &&
      currentSong.audio_url
    ) {
      const playAudio = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.error(
            "Audio autoplay failed:",
            error
          );

          setIsPlaying(false);
        } finally {
          setShouldAutoplay(false);
        }
      };

      playAudio();
    } else {
      setIsPlaying(false);
    }
  }, [
    currentIndex,
    currentSong,
    shouldAutoplay,
  ]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleTimeUpdate = () => {
      if (
        !audio.duration ||
        Number.isNaN(audio.duration)
      ) {
        return;
      }

      setProgress(
        (audio.currentTime / audio.duration) *
          100
      );
    };

    const handleEnded = () => {
      if (songs.length <= 1) {
        setIsPlaying(false);
        setProgress(0);
        return;
      }

      setShouldAutoplay(true);

      setCurrentIndex((current) =>
        current >= songs.length - 1
          ? 0
          : current + 1
      );
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handleError = () => {
      console.error(
        "Audio could not be loaded:",
        currentSong?.audio_url
      );

      setIsPlaying(false);
    };

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate
    );

    audio.addEventListener(
      "ended",
      handleEnded
    );

    audio.addEventListener(
      "pause",
      handlePause
    );

    audio.addEventListener(
      "play",
      handlePlay
    );

    audio.addEventListener(
      "error",
      handleError
    );

    return () => {
      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate
      );

      audio.removeEventListener(
        "ended",
        handleEnded
      );

      audio.removeEventListener(
        "pause",
        handlePause
      );

      audio.removeEventListener(
        "play",
        handlePlay
      );

      audio.removeEventListener(
        "error",
        handleError
      );
    };
  }, [
    songs.length,
    currentSong,
  ]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !currentSong) {
      return;
    }

    if (!currentSong.audio_url) {
      console.error(
        "This song does not have an audio URL."
      );

      return;
    }

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error(
          "Audio playback failed:",
          error
        );

        setIsPlaying(false);
      }

      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const goNext = () => {
    if (songs.length <= 1) {
      return;
    }

    setShouldAutoplay(isPlaying);

    setCurrentIndex((current) =>
      current >= songs.length - 1
        ? 0
        : current + 1
    );
  };

  const goPrevious = () => {
    if (songs.length <= 1) {
      return;
    }

    setShouldAutoplay(isPlaying);

    setCurrentIndex((current) =>
      current <= 0
        ? songs.length - 1
        : current - 1
    );
  };

  const handleSeek = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const audio = audioRef.current;

    if (!audio || !audio.duration) {
      return;
    }

    const newProgress = Number(
      event.target.value
    );

    audio.currentTime =
      (newProgress / 100) *
      audio.duration;

    setProgress(newProgress);
  };

  if (!currentSong) {
    return (
      <div className="player-controls-stack">
        <ListeningIndicator
          modeId={modeId}
          isPlaying={false}
        />

        <div className="player-bar">
          <div className="song-info">
            <strong>
              No songs available
            </strong>

            <span>
              Songs will appear here
            </span>
          </div>
        </div>
      </div>
    );
  }

  const hasAudio = Boolean(
    currentSong.audio_url
  );

  return (
    <div className="player-controls-stack">
      <ListeningIndicator
        modeId={modeId}
        isPlaying={isPlaying}
      />

      <div className="player-bar">
        <audio
          ref={audioRef}
          src={
            currentSong.audio_url ??
            undefined
          }
          preload="metadata"
        />

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
              "Unknown Artist"}
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
              isPlaying
                ? "Pause"
                : "Play"
            }
            disabled={!hasAudio}
            title={
              hasAudio
                ? isPlaying
                  ? "Pause"
                  : "Play"
                : "Audio not available"
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
                "--player-progress":
                  `${progress}%`,
              } as React.CSSProperties
            }
            aria-label="Song progress"
          />
        </div>
      </div>
    </div>
  );
}