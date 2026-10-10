/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import type { Mode } from "@/data/modes";

type ModePosition =
  | "active"
  | "previous"
  | "next"
  | "hidden";

type ModeCardProps = {
  mode: Mode;
  position?: ModePosition;
};

function getTitleLines(title: string) {
  const words = title.trim().split(/\s+/);

  if (words.length <= 1) {
    return [title];
  }

  if (words.length === 2) {
    return words;
  }

  const middle = Math.ceil(words.length / 2);

  return [
    words.slice(0, middle).join(" "),
    words.slice(middle).join(" "),
  ];
}

export default function ModeCard({
  mode,
  position = "hidden",
}: ModeCardProps) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const title = mode.hindiName || mode.name;
  const titleLines = getTitleLines(title);
  const isActive = position === "active";

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isActive || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const transformStyle = isActive && isHovered
    ? `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale3d(1.03, 1.03, 1.03)`
    : undefined;

  return (
    <Link
      ref={cardRef}
      href={`/player/${mode.id}`}
      className={`mode-card-new mode-card-${position} ${
        isActive ? "mode-card-is-active" : ""
      }`}
      style={{
        transform: transformStyle,
        transition: isHovered ? "transform 100ms ease-out" : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`Open ${title} mode`}
    >
      <img
        src={mode.image}
        alt=""
        className="mode-card-new-image"
      />

      <div className="mode-card-new-overlay" />

      {/* Shimmer sweep effect on active card */}
      {isActive && <div className="mode-card-shimmer" aria-hidden="true" />}

      <div className="mode-card-new-content">
        <h2 className="mode-card-new-title">
          {titleLines.map((line, index) => (
            <span
              key={`${line}-${index}`}
              className="mode-card-new-title-line"
            >
              {line}
            </span>
          ))}
        </h2>

        {/* Action badge on active card */}
        {isActive && (
          <div className="mode-card-action-badge">
            <span className="mode-card-play-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="mode-card-action-text">Explore</span>
          </div>
        )}
      </div>

      {isActive && <div className="mode-card-active-glow" aria-hidden="true" />}
    </Link>
  );
}