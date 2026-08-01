// components/Logo.jsx
// Single source of truth for the SIDDHI logo.
// Matches the homepage brand exactly: SIDDHI (font-display, saffron) + सिद्धि (font-sanskrit, gold).
// Wrapped in a link to "/". Use <Logo /> in every page header so the logo is identical everywhere.

import Link from "next/link";

export default function Logo({ className = "" }) {
  return (
    <Link
      href="/"
      aria-label="SIDDHI — home"
      className={`inline-flex items-baseline gap-1 sm:gap-2 min-w-0 ${className}`}
    >
      <span className="font-display text-2xl sm:text-3xl font-bold text-siddhi-saffron tracking-tight">
        SIDDHI
      </span>
      <span className="font-sanskrit text-xs sm:text-sm text-siddhi-gold">सिद्धि</span>
    </Link>
  );
}
