/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

const modeImages = [
  {
    name: "हरियाणा रोडवेज़",
    image: "/images/modes/bus-wala.webp",
    desc: "लंबी सड़कें, खिड़की वाली सीट",
  },
  {
    name: "चाय की टपरी",
    image: "/images/modes/chai-tapri.webp",
    desc: "चाय, बातचीत और सड़क किनारे के गीत",
  },
  {
    name: "नाइट शिफ्ट",
    image: "/images/modes/raat-ki-shift.webp",
    desc: "देर रात, खाली सड़कें और हेडफ़ोन",
  },
  {
    name: "बारिश",
    image: "/images/modes/monsoon.webp",
    desc: "बाहर बारिश, अंदर संगीत",
  },
  {
    name: "छोटू नाई",
    image: "/images/modes/saloon.webp",
    desc: "पुराने आईने, कैसेट की धुनें",
  },
  {
    name: "ट्रक वाला",
    image: "/images/modes/truck-wala.webp",
    desc: "हाइवे, ढाबे और देसी सफ़र",
  },
];

export default function AboutPage() {
  return (
    <main className="about-page-new">
      <RaahiSidebar />

      <div className="about-page-container">
        {/* HERO */}
        <section className="about-hero-new raahi-fade-in-up">
          <p className="about-eyebrow">
            01 — ABOUT
          </p>

          <h1>
            राही • <em>RAAHI</em>
          </h1>

          <p className="about-intro">
            RAAHI is a collection of musical worlds inspired by
            everyday people, places and journeys across India.
          </p>
        </section>

        {/* STORY */}
        <section className="about-story-new raahi-fade-in-up">
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
              className="about-modes-link raahi-btn-tactile"
            >
              Explore all 12 modes →
            </Link>
          </div>
        </section>

        {/* PREVIEW GRID */}
        <section className="about-modes-preview raahi-fade-in-up">
          <div className="about-preview-header">
            <span>02</span>

            <h2>
              Different worlds.
              <br />
              Different moods.
            </h2>
          </div>

          <div className="about-preview-grid">
            {modeImages.map((mode, index) => (
              <Link
                href="/modes"
                className="about-preview-card raahi-btn-tactile"
                key={mode.name}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <img
                  src={mode.image}
                  alt={mode.name}
                />

                <div className="about-preview-overlay" />

                <div className="about-preview-card-info">
                  <span className="about-preview-card-title">
                    {mode.name}
                  </span>
                  <span className="about-preview-card-desc">
                    {mode.desc}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}