import RaahiSidebar from "@/components/navigation/RaahiSidebar";
import ModeGrid from "@/components/modes/ModeGrid";
import { modes } from "@/data/modes";

export default function ModesPage() {
  return (
    <main className="modes-page-new">
      <RaahiSidebar />
      <ModeGrid modes={modes} />
    </main>
  );
}