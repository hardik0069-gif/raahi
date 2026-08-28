import type { Mode } from "@/data/modes";
import ModeCard from "./ModeCard";

type ModeGridProps = {
  modes: Mode[];
};

export default function ModeGrid({ modes }: ModeGridProps) {
  return (
    <div className="modes-grid-new">
      {modes.map((mode, index) => (
        <ModeCard
          key={mode.id}
          mode={mode}
          index={index}
        />
      ))}
    </div>
  );
}