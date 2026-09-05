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
  const title = mode.hindiName || mode.name;
  const titleLines = getTitleLines(title);

  return (
    <Link
      href={`/player/${mode.id}`}
      className={`mode-card-new mode-card-${position}`}
      aria-label={`Open ${title} mode`}
    >
      <img
        src={mode.image}
        alt=""
        className="mode-card-new-image"
      />

      <div className="mode-card-new-overlay" />

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
      </div>
    </Link>
  );
}