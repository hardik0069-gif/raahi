import Link from "next/link";
import type { Mode } from "@/data/modes";

type ModeCardProps = {
  mode: Mode;
  index: number;
};

export default function ModeCard({
  mode,
  index,
}: ModeCardProps) {
  const title = mode.hindiName || mode.name;

  return (
    <Link
      href={`/player/${mode.id}`}
      className="mode-card-new"
    >
      <img
        src={mode.image}
        alt={title}
        className="mode-card-new-image"
      />

      <div className="mode-card-new-overlay" />

      <span className="mode-card-new-number">
        {String(index + 1).padStart(2, "0")}
      </span>

      <h2 className="mode-card-new-title">
        {title}
      </h2>

      <span className="mode-card-new-arrow">
        →
      </span>
    </Link>
  );
}