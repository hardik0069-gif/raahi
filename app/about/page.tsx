import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

export default function AboutPage() {
  return (
    <main className="info-page about-page">
      <RaahiSidebar />

      <header className="info-header">
        <Link href="/" className="info-home-link">
          ← Home
        </Link>
      </header>

      <section className="info-hero">
        <p className="section-label">ABOUT RAAHI</p>

        <h1>
          Music for the
          <br />
          <em>journey.</em>
        </h1>
      </section>

      <section className="info-content">
        <div className="info-content-main">
          <p className="info-lead">
            RAAHI is a collection of musical worlds inspired by the people,
            places and everyday journeys around us.
          </p>

          <div className="info-copy">
            <p>
              A journey is never just about reaching somewhere. There is the
              road outside the window, the people around you, the work waiting
              at the other end, and the music playing somewhere in between.
            </p>

            <p>
              RAAHI turns those familiar moments into different worlds. A bus
              ride home. Chai at a roadside tapri. A late-night shift. A quiet
              workshop. Every place has its own rhythm.
            </p>

            <p>
              Choose the world that feels closest to where you are, press play,
              and let the journey continue.
            </p>
          </div>
        </div>

        <div className="about-details">
          <div className="about-detail">
            <span>01</span>
            <p>Different people</p>
          </div>

          <div className="about-detail">
            <span>02</span>
            <p>Different roads</p>
          </div>

          <div className="about-detail">
            <span>03</span>
            <p>Different sounds</p>
          </div>
        </div>
      </section>

      <footer className="info-footer">
        <span>RAAHI</span>

        <Link href="/modes" className="info-footer-link">
          Explore modes →
        </Link>
      </footer>
    </main>
  );
}