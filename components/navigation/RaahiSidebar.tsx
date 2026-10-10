"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        closeSidebar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {/* MENU BUTTON - morphs smoothly */}
      <button
        type="button"
        className={`raahi-menu-button raahi-btn-tactile ${
          open ? "raahi-menu-button-open" : ""
        }`}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="raahi-menu-bar raahi-menu-bar-1" />
        <span className="raahi-menu-bar raahi-menu-bar-2" />
        <span className="raahi-menu-bar raahi-menu-bar-3" />
      </button>

      {/* OVERLAY */}
      {open && (
        <button
          type="button"
          className="raahi-sidebar-overlay raahi-fade-in"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR DRAWER */}
      <aside
        className={`raahi-sidebar ${
          open ? "raahi-sidebar-open" : ""
        }`}
        aria-label="Navigation menu"
      >
        {/* TOP HEADER */}
        <div className="raahi-sidebar-header">
          <Link
            href="/"
            className="raahi-sidebar-logo"
            onClick={closeSidebar}
          >
            <span>RAAHI</span>
            <span className="raahi-sidebar-logo-sub">राही</span>
          </Link>

          <button
            type="button"
            className="raahi-sidebar-close raahi-btn-tactile"
            aria-label="Close menu"
            onClick={closeSidebar}
          >
            ✕
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="raahi-sidebar-nav">
          {/* PLAYER PAGE BACK ACTION */}
          {isPlayerPage && (
            <button
              type="button"
              className="raahi-sidebar-link raahi-sidebar-button raahi-stagger-1"
              onClick={handleBack}
            >
              <span>← Back</span>
              <span className="raahi-sidebar-number">01</span>
            </button>
          )}

          {/* HOME LINK */}
          <Link
            href="/"
            className={`raahi-sidebar-link ${
              pathname === "/" ? "raahi-sidebar-link-active" : ""
            } ${isPlayerPage ? "raahi-stagger-2" : "raahi-stagger-1"}`}
            onClick={closeSidebar}
          >
            <span className="raahi-link-text">
              {pathname === "/" && <span className="raahi-active-indicator" />}
              Home
            </span>
            <span className="raahi-sidebar-number">
              {isPlayerPage ? "02" : "01"}
            </span>
          </Link>

          {/* MODES LINK */}
          <Link
            href="/modes"
            className={`raahi-sidebar-link ${
              pathname.startsWith("/modes") ? "raahi-sidebar-link-active" : ""
            } ${isPlayerPage ? "raahi-stagger-3" : "raahi-stagger-2"}`}
            onClick={closeSidebar}
          >
            <span className="raahi-link-text">
              {pathname.startsWith("/modes") && <span className="raahi-active-indicator" />}
              Modes
            </span>
            <span className="raahi-sidebar-number">
              {isPlayerPage ? "03" : "02"}
            </span>
          </Link>

          {/* ABOUT LINK */}
          <Link
            href="/about"
            className={`raahi-sidebar-link ${
              pathname === "/about" ? "raahi-sidebar-link-active" : ""
            } ${isPlayerPage ? "raahi-stagger-4" : "raahi-stagger-3"}`}
            onClick={closeSidebar}
          >
            <span className="raahi-link-text">
              {pathname === "/about" && <span className="raahi-active-indicator" />}
              About
            </span>
            <span className="raahi-sidebar-number">
              {isPlayerPage ? "04" : "03"}
            </span>
          </Link>

          {/* CONTACT LINK */}
          <Link
            href="/contact"
            className={`raahi-sidebar-link ${
              pathname === "/contact" ? "raahi-sidebar-link-active" : ""
            } ${isPlayerPage ? "raahi-stagger-5" : "raahi-stagger-4"}`}
            onClick={closeSidebar}
          >
            <span className="raahi-link-text">
              {pathname === "/contact" && <span className="raahi-active-indicator" />}
              Contact
            </span>
            <span className="raahi-sidebar-number">
              {isPlayerPage ? "05" : "04"}
            </span>
          </Link>

          {/* LINKEDIN EXPANDABLE */}
          <div className="raahi-sidebar-item raahi-stagger-5">
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
                +
              </span>
            </button>

            {linkedinOpen && (
              <div className="raahi-linkedin-options raahi-fade-in-up">
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

          {/* GITHUB LINK */}
          <a
            href={GITHUB_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="raahi-sidebar-link raahi-stagger-6"
            onClick={closeSidebar}
          >
            <span>GitHub</span>
            <span className="raahi-sidebar-external">↗</span>
          </a>
        </nav>

        {/* FOOTER */}
        <div className="raahi-sidebar-footer">
          <p>Music for every journey</p>
          <span className="raahi-footer-sub">हर सफ़र की अपनी धुन</span>
        </div>
      </aside>
    </>
  );
}