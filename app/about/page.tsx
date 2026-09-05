import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

const modeImages = [
  {
    name: "हरियाणा रोडवेज़",
    image: "/images/modes/bus-wala.webp",
  },
  {
    name: "चाय की टपरी",
    image: "/images/modes/chai-tapri.webp",
  },
  {
    name: "नाइट शिफ्ट",
    image: "/images/modes/raat-ki-shift.webp",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page-new">
      <RaahiSidebar />

      <div className="about-page-container">
        <section className="about-hero-new">
          <p className="about-eyebrow">
            ABOUT
          </p>

          <h1>
            राही
          </h1>

          <p className="about-intro">
            RAAHI is a collection of musical worlds inspired by
            everyday people, places and journeys.
          </p>
        </section>

        <section className="about-story-new">
          <div className="about-story-heading">
            <span>01</span>

            <h2>
              Every journey
              <br />
              has its own sound.
            </h2>
          </div>

          <div className="about-story-copy">
            <p>
              A journey is never only about reaching somewhere.
              There is the road outside the window, the people
              around you, the work waiting at the other end,
              and the music playing somewhere in between.
            </p>

            <p>
              RAAHI turns these familiar moments into different
              musical worlds. A bus ride, chai at a roadside tapri,
              a late-night shift or a quiet workshop — every place
              has its own rhythm.
            </p>

            <Link
              href="/modes"
              className="about-modes-link"
            >
              Explore modes →
            </Link>
          </div>
        </section>

        <section className="about-modes-preview">
          <div className="about-preview-header">
            <span>02</span>

            <h2>
              Different worlds.
              <br />
              Different moods.
            </h2>
          </div>

          <div className="about-preview-grid">
            {modeImages.map((mode) => (
              <Link
                href="/modes"
                className="about-preview-card"
                key={mode.name}
              >
                <img
                  src={mode.image}
                  alt={mode.name}
                />

                <div className="about-preview-overlay" />

                <span>
                  {mode.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}