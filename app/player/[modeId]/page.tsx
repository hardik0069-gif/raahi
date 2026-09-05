import { notFound } from "next/navigation";

import { getMode } from "@/data/modes";
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

  return (
    <PlayerFullscreen>
      <main className="player-page-new">
        <div
          className="player-page-new-background"
          style={{
            backgroundImage: `url("${mode.image}")`,
          }}
        />

        <div className="player-page-new-overlay" />

        <RaahiSidebar />

        <section className="player-page-new-content">
          <h1 className="player-page-new-title">
            {titleLines.map((line, index) => (
              <span
                key={`${line}-${index}`}
                className="player-page-new-title-line"
              >
                {line}
              </span>
            ))}
          </h1>
        </section>

        <div className="player-page-new-controls">
          <PlayerControls
            songs={songs}
            modeId={modeId}
          />
        </div>
      </main>
    </PlayerFullscreen>
  );
}