"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";
import CursorGrid from "@/components/home/CursorGrid";
import { modes } from "@/data/modes";

export default function HomePage() {
  const router = useRouter();
  const [activeTickerIndex, setActiveTickerIndex] = useState(0);

  // Soft rotating ticker through journey modes
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTickerIndex((prev) => (prev + 1) % modes.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const handleModesClick = async () => {
    try {
      if (
        document.fullscreenEnabled &&
        !document.fullscreenElement
      ) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen request failed, navigation will still continue
    }

    router.push("/modes");
  };

  const handleRandomJourney = () => {
    const randomIndex = Math.floor(Math.random() * modes.length);
    const randomMode = modes[randomIndex];
    router.push(`/player/${randomMode.id}`);
  };

  const tickerMode = modes[activeTickerIndex];

  return (
    <main className="raahi-home-new">
      {/* Cinematic ambient background with subtle breathing zoom */}
      <div className="raahi-home-background raahi-ambient-zoom" />

      {/* Atmospheric warm light bloom */}
      <div className="raahi-home-ambient-bloom" aria-hidden="true" />

      {/* Interactive particle canvas */}
      <CursorGrid className="raahi-home-cursor-grid" />

      <div className="raahi-home-overlay" />

      <RaahiSidebar />

      {/* Hero Typography: Soul of RAAHI */}
      <section className="raahi-home-hero">
        <div className="raahi-hero-badge raahi-fade-in-up">
          <span className="raahi-hero-pulse-dot" />
          <span>राही • RAAHI</span>
        </div>

        <h1 className="raahi-hero-title raahi-fade-in-up">
          Music for
          <br />
          <em>Everyday Journeys</em>
        </h1>

        <p className="raahi-hero-hindi raahi-fade-in-up">
          हर सफ़र की अपनी धुन।
        </p>

        <p className="raahi-hero-desc raahi-fade-in-up">
          A collection of 12 musical worlds inspired by India&apos;s roads, tea stalls, and late-night shifts.
        </p>
      </section>

      {/* Bottom Interface: Journey Capsule & Enter Buttons */}
      <section className="raahi-home-content">
        {/* Live Rotating Mode Capsule */}
        {tickerMode && (
          <Link
            href={`/player/${tickerMode.id}`}
            className="raahi-journey-ticker raahi-fade-in-up"
            title={`Start journey: ${tickerMode.hindiName}`}
          >
            <span className="raahi-ticker-indicator" />
            <span className="raahi-ticker-label">Now Journeying:</span>
            <span className="raahi-ticker-name" key={tickerMode.id}>
              {tickerMode.hindiName}
            </span>
            <span className="raahi-ticker-arrow">→</span>
          </Link>
        )}

        {/* Action Buttons */}
        <div className="raahi-home-actions">
          <button
            type="button"
            onClick={handleRandomJourney}
            className="raahi-surprise-btn raahi-btn-tactile raahi-fade-in-up"
            aria-label="Surprise journey"
            title="Jump into a random journey"
          >
            <span>Surprise Journey</span>
            <span className="raahi-surprise-spark" aria-hidden="true">✦</span>
          </button>

          <button
            type="button"
            onClick={handleModesClick}
            className="raahi-enter-modes raahi-btn-tactile raahi-fade-in-up"
            aria-label="Enter Modes"
          >
            <span className="raahi-enter-text">
              Modes
            </span>

            <span
              className="raahi-enter-arrow"
              aria-hidden="true"
            >
              &gt;
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}