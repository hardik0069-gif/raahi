import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

export default function ContactPage() {
  return (
    <main className="info-page">
      <RaahiSidebar />

      <header className="info-header">
        <Link href="/" className="info-home-link">Home ↗</Link>
      </header>

      <section className="info-hero">
        <p className="section-label">02 — CONTACT</p>
        <h1>
          Start a
          <br />
          <em>conversation.</em>
        </h1>
      </section>

      <section className="contact-grid">
        <div>
          <p className="contact-label">For RAAHI</p>
          <a
            className="contact-email"
            href="mailto:hello@raahi.app"
          >
            hello@raahi.app
          </a>
        </div>

        <div>
          <p className="contact-label">LinkedIn</p>
          <div className="contact-links">
            <a
              href="https://www.linkedin.com/in/hardik-kataria-59bb83379/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hardik ↗
            </a>
            <a
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
