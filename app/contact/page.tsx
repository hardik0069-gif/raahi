import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

export default function ContactPage() {
  return (
    <main className="info-page">
      <RaahiSidebar />

      <header className="info-header raahi-fade-in">
        <Link href="/" className="info-home-link raahi-btn-tactile">Home ↗</Link>
      </header>

      <section className="info-hero raahi-fade-in-up">
        <p className="section-label">02 — CONTACT</p>
        <h1>
          Start a
          <br />
          <em>conversation.</em>
        </h1>
        <p className="contact-subtext" style={{ marginTop: "12px", color: "rgba(238, 233, 223, 0.55)", fontSize: "14px" }}>
          Have thoughts, sounds, or a road story to share with us?
        </p>
      </section>

      <section className="contact-grid raahi-fade-in-up">
        <div>
          <p className="contact-label">For RAAHI</p>
          <a
            className="contact-email raahi-btn-tactile"
            href="mailto:hello@raahi.app"
          >
            hello@raahi.app
          </a>
        </div>

        <div>
          <p className="contact-label">LinkedIn</p>
          <div className="contact-links">
            <a
              className="raahi-btn-tactile"
              href="https://www.linkedin.com/in/hardik-kataria-59bb83379/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hardik ↗
            </a>
            <a
              className="raahi-btn-tactile"
              href="https://www.linkedin.com/in/kartik-kataria-4b616720b/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Kartik ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
