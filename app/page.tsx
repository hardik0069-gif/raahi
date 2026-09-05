"use client";

import { useRouter } from "next/navigation";
import RaahiSidebar from "@/components/navigation/RaahiSidebar";

export default function HomePage() {
  const router = useRouter();

  const handleModesClick = async () => {
    try {
      if (
        document.fullscreenEnabled &&
        !document.fullscreenElement
      ) {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      // Fullscreen request failed, navigation will still continue
    }

    router.push("/modes");
  };

  return (
    <main className="raahi-home-new">
      <div className="raahi-home-background" />

      <div className="raahi-home-overlay" />

      <RaahiSidebar />

      <section className="raahi-home-content">
        <button
          type="button"
          onClick={handleModesClick}
          className="raahi-enter-modes"
          aria-label="Modes"
        >
          <span className="raahi-enter-text">
            Modes
          </span>

          <span
            className="raahi-enter-arrow"
            aria-hidden="true"
          >
            &gt;
          </span>
        </button>
      </section>
    </main>
  );
}