"use client";

import {
  useCallback,
  useRef,
  useState,
} from "react";

import type { Mode } from "@/data/modes";
import ModeCard from "./ModeCard";

type ModeGridProps = {
  modes: Mode[];
};

type ModePosition =
  | "active"
  | "previous"
  | "next"
  | "hidden";

export default function ModeGrid({
  modes,
}: ModeGridProps) {
  const [activeIndex, setActiveIndex] =
    useState(0);

  const wheelLocked = useRef(false);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0
        ? modes.length - 1
        : current - 1
    );
  }, [modes.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) =>
      current === modes.length - 1
        ? 0
        : current + 1
    );
  }, [modes.length]);

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>
  ) => {
    if (Math.abs(event.deltaY) < 10) {
      return;
    }

    if (wheelLocked.current) {
      return;
    }

    wheelLocked.current = true;

    if (event.deltaY > 0) {
      goNext();
    } else {
      goPrevious();
    }

    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 600);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "ArrowRight"
    ) {
      event.preventDefault();
      goNext();
    }

    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowLeft"
    ) {
      event.preventDefault();
      goPrevious();
    }
  };

  if (!modes.length) {
    return null;
  }

  const previousIndex =
    activeIndex === 0
      ? modes.length - 1
      : activeIndex - 1;

  const nextIndex =
    activeIndex === modes.length - 1
      ? 0
      : activeIndex + 1;

  return (
    <div
      className="curved-modes-carousel"
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Modes carousel"
    >
      <div
        className="curved-modes-orbit"
        aria-hidden="true"
      />

      <button
        type="button"
        className="
          curved-mode-arrow
          curved-mode-arrow-previous
        "
        onClick={goPrevious}
        aria-label="Previous mode"
      >
        ↑
      </button>

      <div className="curved-modes-track">
        {modes.map((mode, index) => {
          let position: ModePosition = "hidden";

          if (index === activeIndex) {
            position = "active";
          } else if (index === previousIndex) {
            position = "previous";
          } else if (index === nextIndex) {
            position = "next";
          }

          return (
            <div
              key={mode.id}
              className={`
                curved-mode-item
                curved-mode-${position}
              `}
            >
              <ModeCard
                mode={mode}
                position={position}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="
          curved-mode-arrow
          curved-mode-arrow-next
        "
        onClick={goNext}
        aria-label="Next mode"
      >
        ↓
      </button>

      <div className="modes-carousel-controls">
        <div
          className="modes-dots"
          aria-hidden="true"
        >
          {modes.map((mode, index) => {
            const distance =
              index - activeIndex;

            const normalized =
              modes.length > 1
                ? distance /
                  Math.max(1, modes.length - 1)
                : 0;

            const y =
              10 * (1 - normalized * normalized);

            return (
              <span
                key={`dot-${mode.id}`}
                className={`modes-dot ${
                  index === activeIndex
                    ? "modes-dot-active"
                    : ""
                }`}
                style={{
                  transform: `translateY(${-y}px)`,
                }}
              />
            );
          })}
        </div>

        <input
          type="range"
          min="0"
          max={modes.length - 1}
          value={activeIndex}
          step="1"
          className="modes-range-slider"
          onChange={(event) =>
            setActiveIndex(
              Number(event.target.value)
            )
          }
          aria-label="Choose mode"
        />
      </div>
    </div>
  );
}
