// components/Logo.jsx
// Single source of truth for the SIDDHI logo/header lockup.
// Use this on EVERY page so the logo is identical across the whole site.
//
// Canonical lockup (from the homepage): sunburst emblem + "SIDDHI" wordmark + "सिद्धि".
// Left-aligned, links to "/". Restyle here once and it updates everywhere.

import Link from "next/link";

/**
 * Props:
 *  - showEmblem (bool, default true): show the sunburst mark to the left of the wordmark.
 *  - className (string): optional wrapper classes (e.g. spacing overrides).
 *
 * Colors use the project's Tailwind tokens (siddhi-saffron / siddhi-black).
 * If those tokens don't exist in tailwind.config.js, replace with plain classes,
 * e.g. text-orange-500 and text-neutral-900.
 */
export default function Logo({ showEmblem = true, className = "" }) {
  return (
    <Link
      href="/"
      aria-label="SIDDHI — home"
      className={`inline-flex items-center gap-2 select-none ${className}`}
    >
      {showEmblem && (
        <SiddhiEmblem className="h-8 w-8 shrink-0 text-siddhi-saffron" />
      )}
      <span className="flex items-baseline gap-1.5">
        <span className="font-serif text-2xl font-bold tracking-wide text-siddhi-saffron">
          SIDDHI
        </span>
        <span className="text-lg text-siddhi-saffron/80" lang="sa">
          सिद्धि
        </span>
      </span>
    </Link>
  );
}

/**
 * Sunburst / "mastery of speech" emblem.
 * This is a faithful recreation. If you already have the exact emblem asset
 * (e.g. /public/logo.svg or an inline SVG in index.jsx), drop it in here instead
 * so the mark is pixel-identical to your brand file.
 */
function SiddhiEmblem({ className = "" }) {
  const rays = Array.from({ length: 24 });
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {rays.map((_, i) => {
          const angle = (i / rays.length) * Math.PI * 2;
          const inner = 14;
          const outer = i % 2 === 0 ? 44 : 36;
          const x1 = 50 + Math.cos(angle) * inner;
          const y1 = 50 + Math.sin(angle) * inner;
          const x2 = 50 + Math.cos(angle) * outer;
          const y2 = 50 + Math.sin(angle) * outer;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {rays.map((_, i) => {
          const angle = (i / rays.length) * Math.PI * 2;
          const outer = i % 2 === 0 ? 44 : 36;
          const cx = 50 + Math.cos(angle) * outer;
          const cy = 50 + Math.sin(angle) * outer;
          return <circle key={`d${i}`} cx={cx} cy={cy} r="1.4" fill="currentColor" stroke="none" />;
        })}
      </g>
    </svg>
  );
}
