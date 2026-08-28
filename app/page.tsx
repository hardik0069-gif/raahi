import Link from "next/link";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

export default function HomePage() {
  return (
    <main className="raahi-home-new">
      <div className="raahi-home-background" />

      <RaahiSidebar />

      <section className="raahi-home-content">
        <Link
          href="/modes"
          className="raahi-enter-modes"
          aria-label="Choose your mode"
        >
          <span className="raahi-enter-text">Choose your mode</span>

          <span className="raahi-enter-arrow">
            →
          </span>
        </Link>
      </section>
    </main>
  );
}