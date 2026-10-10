import Link from "next/link";
import { notFound } from "next/navigation";

import { getMode, modes } from "@/data/modes";
import { getModeSongs } from "@/lib/songs";

import PlayerControls from "@/components/player/PlayerControls";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";
import PlayerFullscreen from "@/components/player/PlayerFullscreen";

type PlayerPageProps = {
  params: Promise<{
    modeId: string;
  }>;
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

export default async function PlayerPage({
  params,
}: PlayerPageProps) {
  const { modeId } = await params;

  const mode = getMode(modeId);

  if (!mode) {
    notFound();
  }

  const songs = await getModeSongs(modeId);

  const title = mode.hindiName || mode.name;
  const titleLines = getTitleLines(title);

  // Find next mode for smooth journey hopping
  const currentModeIndex = modes.findIndex((m) => m.id === modeId);
  const nextMode = modes[(currentModeIndex + 1) % modes.length];

  return (
    <PlayerFullscreen>
      <main className="player-page-new">
        {/* Ambient atmospheric backdrop with slow subtle zoom */}
        <div
          className="player-page-new-background raahi-ambient-zoom"
          style={{
            backgroundImage: `url("${mode.image}")`,
          }}
        />

        {/* Ambient warm light halo */}
        <div className="player-page-ambient-glow" aria-hidden="true" />

        <div className="player-page-new-overlay" />

        <RaahiSidebar />

        {/* Next Journey Quick Pill (Top Right) */}
        {nextMode && (
          <aside className="player-top-right-nav">
            <Link
              href={`/player/${nextMode.id}`}
              className="player-next-journey-pill"
              title={`Next journey: ${nextMode.hindiName}`}
            >
              <span className="player-next-label">Next Journey</span>
              <span className="player-next-name">{nextMode.hindiName} →</span>
            </Link>
          </aside>
        )}

        {/* Mode Title & Evocative Description */}
        <section className="player-page-new-content">
          <div className="player-mode-badge raahi-fade-in-up">
            <span className="player-mode-dot" />
            <span>0{currentModeIndex + 1} / {modes.length}</span>
          </div>

          <h1 className="player-page-new-title">
            {titleLines.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className="player-page-new-title-line raahi-text-reveal"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>

          {mode.description && (
            <p className="player-page-new-desc raahi-fade-in-up">
              {mode.description}
            </p>
          )}
        </section>

        {/* Player Controls & Visualizer */}
        <div className="player-page-new-controls">
          <PlayerControls
            key={modeId}
            songs={songs}
            modeId={modeId}
          />
        </div>

        {/* Keyboard shortcut cues (subtle bottom corner) */}
        <div className="player-keyboard-hint" aria-hidden="true">
          <span>Space: Play/Pause</span>
          <span>•</span>
          <span>← →: Seek</span>
          <span>•</span>
          <span>M: Mute</span>
        </div>
      </main>
    </PlayerFullscreen>
  );
}