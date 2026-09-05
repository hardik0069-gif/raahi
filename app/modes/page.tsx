import RaahiSidebar from "@/components/navigation/RaahiSidebar";
import ModeGrid from "@/components/modes/ModeGrid";
import { modes } from "@/data/modes";

export default function ModesPage() {
  return (
    <main className="modes-page-new">
      <RaahiSidebar />

      <div className="modes-experience">
        <section className="modes-intro">
          <h1 className="modes-main-title">
            Modes
          </h1>
        </section>

        <section className="modes-carousel-section">
          <ModeGrid modes={modes} />
        </section>
      </div>
    </main>
  );
}