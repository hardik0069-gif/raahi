"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
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

type Direction = "previous" | "next";

export default function ModeGrid({
  modes,
}: ModeGridProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);

  const wheelLocked = useRef(false);
  const holdTimer = useRef<number | null>(null);

  const goPrevious = useCallback(() => {
    setActiveIndex((current) =>
      current === 0 ? modes.length - 1 : current - 1
    );
  }, [modes.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) =>
      current === modes.length - 1 ? 0 : current + 1
    );
  }, [modes.length]);

  const startHolding = useCallback(
    (direction: Direction) => {
      if (holdTimer.current !== null) return;

      if (direction === "previous") {
        goPrevious();
      } else {
        goNext();
      }

      holdTimer.current = window.setInterval(() => {
        if (direction === "previous") {
          goPrevious();
        } else {
          goNext();
        }
      }, 400);
    },
    [goPrevious, goNext]
  );

  const stopHolding = useCallback(() => {
    if (holdTimer.current === null) return;
    window.clearInterval(holdTimer.current);
    holdTimer.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimer.current !== null) {
        window.clearInterval(holdTimer.current);
        holdTimer.current = null;
      }
    };
  }, []);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaY) < 12) return;
    if (wheelLocked.current) return;

    wheelLocked.current = true;

    if (event.deltaY > 0) {
      goNext();
    } else {
      goPrevious();
    }

    window.setTimeout(() => {
      wheelLocked.current = false;
    }, 450);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
  };

  if (!modes.length) return null;

  const activeMode = modes[activeIndex];
  const previousIndex = activeIndex === 0 ? modes.length - 1 : activeIndex - 1;
  const nextIndex = activeIndex === modes.length - 1 ? 0 : activeIndex + 1;

  return (
    <div className="modes-experience">
      {/* Dynamic atmospheric background that crossfades with active mode */}
      <div
        className="modes-ambient-bg raahi-ambient-zoom"
        style={{
          backgroundImage: `url("${activeMode.image}")`,
        }}
        aria-hidden="true"
      />
      <div className="modes-ambient-overlay" aria-hidden="true" />
      <div className="modes-ambient-spotlight" aria-hidden="true" />

      {/* Left Info Panel */}
      <section className="modes-intro">
        <div className="modes-intro-stack">
          <div className="modes-counter-badge raahi-fade-in-up">
            <span className="modes-counter-live-dot" />
            <span className="modes-counter-text">
              {String(activeIndex + 1).padStart(2, "0")} / {String(modes.length).padStart(2, "0")}
            </span>
          </div>

          <h1 className="modes-main-title raahi-fade-in-up">
            Modes
          </h1>

          <div className="modes-active-meta" key={activeMode.id}>
            <p className="modes-active-hindi raahi-text-reveal">
              {activeMode.hindiName}
            </p>
            <p className="modes-active-desc raahi-text-reveal">
              {activeMode.description}
            </p>

            <Link
              href={`/player/${activeMode.id}`}
              className="modes-enter-btn raahi-btn-tactile raahi-fade-in-up"
            >
              <span>Explore this journey</span>
              <span className="modes-enter-arrow" aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Keyboard hint */}
          <div className="modes-nav-hint" aria-hidden="true">
            <span>Scroll or use ↑ ↓ keys</span>
          </div>
        </div>
      </section>

      {/* Right Orbit Carousel Section */}
      <section className="modes-carousel-section">
        <div
          className="curved-modes-carousel"
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Modes carousel"
        >
          <div className="curved-modes-orbit" aria-hidden="true" />

          {/* Previous mode arrow */}
          <button
            type="button"
            className="curved-mode-arrow curved-mode-arrow-previous raahi-btn-tactile"
            onClick={goPrevious}
            onMouseDown={() => startHolding("previous")}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={() => startHolding("previous")}
            onTouchEnd={stopHolding}
            onTouchCancel={stopHolding}
            aria-label="Previous mode"
          >
            ↑
          </button>

          {/* Mode cards track */}
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
                  className={`curved-mode-item curved-mode-${position}`}
                >
                  <ModeCard mode={mode} position={position} />
                </div>
              );
            })}
          </div>

          {/* Next mode arrow */}
          <button
            type="button"
            className="curved-mode-arrow curved-mode-arrow-next raahi-btn-tactile"
            onClick={goNext}
            onMouseDown={() => startHolding("next")}
            onMouseUp={stopHolding}
            onMouseLeave={stopHolding}
            onTouchStart={() => startHolding("next")}
            onTouchEnd={stopHolding}
            onTouchCancel={stopHolding}
            aria-label="Next mode"
          >
            ↓
          </button>

          {/* Bottom dotted mode selector */}
          <div className="modes-carousel-controls">
            {/* Tooltip on dot hover */}
            {hoveredDot !== null && modes[hoveredDot] && (
              <div
                className="modes-dot-tooltip"
                style={{
                  left: `${(hoveredDot / (modes.length - 1)) * 100}%`,
                }}
              >
                {modes[hoveredDot].hindiName}
              </div>
            )}

            <div className="modes-dots" aria-hidden="true">
              {modes.map((mode, index) => {
                const distance = index - activeIndex;
                const normalized =
                  modes.length > 1
                    ? distance / Math.max(1, modes.length - 1)
                    : 0;
                const y = 10 * (1 - normalized * normalized);

                return (
                  <span
                    key={`dot-${mode.id}`}
                    className={`modes-dot ${
                      index === activeIndex ? "modes-dot-active" : ""
                    }`}
                    style={{
                      transform: `translateY(${-y}px)`,
                    }}
                    onMouseEnter={() => setHoveredDot(index)}
                    onMouseLeave={() => setHoveredDot(null)}
                    onClick={() => setActiveIndex(index)}
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
                setActiveIndex(Number(event.target.value))
              }
              aria-label="Choose mode"
            />
          </div>
        </div>
      </section>
    </div>
  );
}