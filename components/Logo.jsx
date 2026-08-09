// components/Logo.jsx
// Single source of truth for the SIDDHI logo.
// Matches the homepage brand: SIDDHI (font-display, saffron) + सिद्धि (font-sanskrit, gold).
// Pass href to control where it links (defaults to home "/").

import Link from "next/link";

export default function Logo({ href = "/", className = "" }) {
  return (
    <Link
      href={href}
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
