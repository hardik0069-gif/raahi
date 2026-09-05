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

  const isPlayerPage = pathname.startsWith("/player/");

  const closeSidebar = () => {
    setOpen(false);
    setLinkedinOpen(false);
  };

  const handleBack = () => {
    closeSidebar();
    window.history.back();
  };

  return (
    <>
      {/* MENU BUTTON */}
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

      {/* OVERLAY */}
      {open && (
        <button
          type="button"
          className="raahi-sidebar-overlay"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`raahi-sidebar ${
          open ? "raahi-sidebar-open" : ""
        }`}
        aria-label="Navigation menu"
      >
        {/* TOP */}
        <div className="raahi-sidebar-header">
          <div className="raahi-sidebar-logo">
            RAAHI
          </div>

          <button
            type="button"
            className="raahi-sidebar-close"
            aria-label="Close menu"
            onClick={closeSidebar}
          >
            ×
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="raahi-sidebar-nav">

          {/* PLAYER PAGE OPTIONS */}
          {isPlayerPage && (
            <>
              <button
                type="button"
                className="raahi-sidebar-link raahi-sidebar-button"
                onClick={handleBack}
              >
                <span>← Back</span>

                <span className="raahi-sidebar-number">
                  01
                </span>
              </button>

              <Link
                href="/"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                <span>Home</span>

                <span className="raahi-sidebar-number">
                  02
                </span>
              </Link>

              <Link
                href="/modes"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                <span>Modes</span>

                <span className="raahi-sidebar-number">
                  03
                </span>
              </Link>
            </>
          )}

          {/* NORMAL PAGES */}
          {!isPlayerPage && (
            <>
              <Link
                href="/"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                <span>Home</span>

                <span className="raahi-sidebar-number">
                  01
                </span>
              </Link>

              <Link
                href="/modes"
                className="raahi-sidebar-link"
                onClick={closeSidebar}
              >
                <span>Modes</span>

                <span className="raahi-sidebar-number">
                  02
                </span>
              </Link>
            </>
          )}

          {/* LINKEDIN */}
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
                  linkedinOpen
                    ? "raahi-arrow-open"
                    : ""
                }`}
              >
                +
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

          {/* GITHUB */}
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="raahi-sidebar-link"
            onClick={closeSidebar}
          >
            <span>GitHub</span>

            <span className="raahi-sidebar-external">
              ↗
            </span>
          </a>

          {/* ABOUT */}
          <Link
            href="/about"
            className="raahi-sidebar-link"
            onClick={closeSidebar}
          >
            <span>About</span>

            <span className="raahi-sidebar-number">
              {isPlayerPage ? "04" : "03"}
            </span>
          </Link>

        </nav>

        {/* FOOTER */}
        <div className="raahi-sidebar-footer">
          Music for every journey
        </div>
      </aside>
    </>
  );
}