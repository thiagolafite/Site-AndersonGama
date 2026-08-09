import { useRef } from "react";

const DEFAULT_PHRASES = [
  "REABILITAÇÃO",
  "SINAIS VITAIS",
  "AFERIÇÃO DE P.A.",
  "HIPERTROFIA",
  "EMAGRECIMENTO",
  "NUTRIÇÃO",
  "RESULTADO",
  "EVOLUÇÃO",
  "DEDICAÇÃO",
  "TRANSFORMAÇÃO",
];

interface MarqueeStripProps {
  phrases?: string[];
  /** pixels per second — default 60 */
  speed?: number;
  /** reverse direction */
  reverse?: boolean;
  className?: string;
}

export function MarqueeStrip({
  phrases = DEFAULT_PHRASES,
  speed = 60,
  reverse = false,
  className = "",
}: MarqueeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // We duplicate the list so the loop is seamless
  const items = [...phrases, ...phrases];
  // Each item + separator is roughly 160px wide; estimate total width
  const singleSetPx = phrases.length * 160;
  const duration = singleSetPx / speed;

  return (
    <div
      className={`relative overflow-hidden bg-black border-y border-white/5 select-none ${className}`}
      style={{ height: "42px" }}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex items-center h-full whitespace-nowrap"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite ${reverse ? "reverse" : ""}`,
          willChange: "transform",
        }}
      >
        {items.map((phrase, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="text-xs font-bold tracking-[0.25em] uppercase text-white/85 px-5"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {phrase}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "hsl(43, 67%, 55%)" }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-${singleSetPx}px); }
        }
      `}</style>
    </div>
  );
}
