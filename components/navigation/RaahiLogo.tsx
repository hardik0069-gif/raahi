"use client";

import Link from "next/link";

export default function RaahiLogo() {
  return (
    <div className="raahi-brand-wrap">
      <Link
        href="/"
        className="raahi-logo"
        aria-label="RAAHI home"
      >
        <span className="raahi-logo-mark">R</span>
        <span className="raahi-logo-text">RAAHI</span>
      </Link>
    </div>
  );
}
