"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const HARDIK_LINKEDIN =
  "https://www.linkedin.com/in/hardik-kataria-59bb83379/";

const KARTIK_LINKEDIN =
  "https://www.linkedin.com/in/kartik-kataria-4b616720b/";

const GITHUB_LINK =
  "https://github.com/hardik0069-gif";

export default function RaahiSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [linkedinOpen, setLinkedinOpen] = useState(false);

  const closeSidebar = () => {
    setOpen(false);
    setLinkedinOpen(false);
  };

  const isPlayerPage = pathname.startsWith("/player/");

  const handleBack = () => {
    closeSidebar();
    window.history.back();
  };

  return (
    <>
      <button
        type="button"
        className="raahi-menu-button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      {open && (
        <button
          type="button"
          className="raahi-sidebar-overlay"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`raahi-sidebar ${
          open ? "raahi-sidebar-open" : ""
        }`}
        aria-label="Navigation menu"
      >
        <div className="raahi-sidebar-top">
          <button
            type="button"
            className="raahi-sidebar-close"
            aria-label="Close menu"
            onClick={closeSidebar}
          >
            ×
          </button>
        </div>

        <nav className="raahi-sidebar-nav">

          {isPlayerPage && (
            <>
              <button
                type="button"
                className="raahi-sidebar-link raahi-sidebar-button"
                onClick={handleBack}
              >
                ← Back
              </button>

              <Link
                href="/"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                Home
              </Link>

              <Link
                href="/modes"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                Choose another mode →
              </Link>
            </>
          )}

          {!isPlayerPage && (
            <Link
              href="/"
              className="raahi-sidebar-link"
              onClick={closeSidebar}
            >
              Home
            </Link>
          )}

          <div className="raahi-sidebar-item">
            <button
              type="button"
              className="raahi-sidebar-link raahi-linkedin-toggle"
              onClick={() =>
                setLinkedinOpen((current) => !current)
              }
            >
              <span>LinkedIn</span>

              <span
                className={`raahi-sidebar-small-arrow ${
                  linkedinOpen ? "raahi-arrow-open" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {linkedinOpen && (
              <div className="raahi-linkedin-options">
                <a
                  href={HARDIK_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeSidebar}
                >
                  Hardik ↗
                </a>

                <a
                  href={KARTIK_LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeSidebar}
                >
                  Kartik ↗
                </a>
              </div>
            )}
          </div>

          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="raahi-sidebar-link"
            onClick={closeSidebar}
          >
            GitHub ↗
          </a>

          <Link
            href="/about"
            className="raahi-sidebar-link"
            onClick={closeSidebar}
          >
            About →
          </Link>

        </nav>
      </aside>
    </>
  );
}