"use client";

import { useEffect, useRef, useState } from "react";

type PlayerFullscreenProps = {
  children: React.ReactNode;
};

export default function PlayerFullscreen({
  children,
}: PlayerFullscreenProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement === containerRef.current
      );
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  const enterFullscreen = async () => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    if (document.fullscreenElement === element) {
      return;
    }

    try {
      await element.requestFullscreen();
    } catch (error) {
      console.error(
        "Could not enter fullscreen:",
        error
      );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`player-fullscreen ${
        isFullscreen
          ? "player-fullscreen-active"
          : ""
      }`}
      onClick={enterFullscreen}
    >
      {children}
    </div>
  );
}