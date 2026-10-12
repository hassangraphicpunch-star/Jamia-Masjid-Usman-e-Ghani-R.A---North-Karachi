import React, { useId } from 'react';
import { MoonPhaseType } from '../services/astronomyService';

export interface RealisticMoonProps {
  illumination: number; // 0 to 100, e.g. 5.4 or 100
  isWaxing?: boolean; // true = waxing (lit on right), false = waning (lit on left)
  phaseId?: MoonPhaseType;
  size?: number; // size in pixels (default 120)
  className?: string;
  showGlow?: boolean;
  showOutline?: boolean;
}

/**
 * Mathematically accurate and visually realistic Moon illustration
 * inspired by Timeanddate.com's Moon phase graphics.
 * 
 * - Northern Hemisphere / Karachi orientation (Waxing = lit on right, Waning = lit on left)
 * - Elliptical terminator curve mathematically calculated from illumination fraction k
 * - Realistic lunar maria, craters, and ray structures on both lit and dark sides
 * - Crisp dark outline and subtle outer atmosphere glow
 */
export const RealisticMoon: React.FC<RealisticMoonProps> = ({
  illumination = 50,
  isWaxing = true,
  phaseId,
  size = 120,
  className = '',
  showGlow = true,
  showOutline = true,
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const maskId = `moon-mask-${uniqueId}`;

  // Constrain illumination between 0 and 100
  const k = Math.max(0, Math.min(100, illumination)) / 100;
  const isFull = k >= 0.995 || phaseId === 'full_moon';
  const isNew = k <= 0.005 || phaseId === 'new_moon';

  // Geometry: Radius R = 46 inside 100x100 viewBox with center at (50, 50)
  const R = 46;
  const cx = 50;
  const cy = 50;
  const topY = cy - R; // 4
  const botY = cy + R; // 96

  // Calculate SVG path for the lit portion using spherical projection terminator ellipse
  // Semi-minor axis rx goes from R at k=0, to 0 at k=0.5, to R at k=1.0
  const rx = Math.max(0.1, R * Math.abs(2 * k - 1));

  let litPath = '';
  if (isFull) {
    // Full Circle
    litPath = `M ${cx} ${topY} A ${R} ${R} 0 1 1 ${cx} ${botY} A ${R} ${R} 0 1 1 ${cx} ${topY} Z`;
  } else if (!isNew) {
    if (isWaxing) {
      // Waxing (Northern Hemisphere): Lit limb is on the RIGHT
      // Outer arc down the right side from (50, 4) to (50, 96)
      const outerRight = `M ${cx} ${topY} A ${R} ${R} 0 0 1 ${cx} ${botY}`;
      if (k < 0.5) {
        // Crescent: terminator bows rightwards (x > 50)
        litPath = `${outerRight} A ${rx.toFixed(2)} ${R} 0 0 0 ${cx} ${topY} Z`;
      } else {
        // Gibbous: terminator bows leftwards (x < 50)
        litPath = `${outerRight} A ${rx.toFixed(2)} ${R} 0 0 1 ${cx} ${topY} Z`;
      }
    } else {
      // Waning (Northern Hemisphere): Lit limb is on the LEFT
      // Outer arc down the left side from (50, 4) to (50, 96)
      const outerLeft = `M ${cx} ${topY} A ${R} ${R} 0 0 0 ${cx} ${botY}`;
      if (k < 0.5) {
        // Crescent: terminator bows leftwards (x < 50)
        litPath = `${outerLeft} A ${rx.toFixed(2)} ${R} 0 0 1 ${cx} ${topY} Z`;
      } else {
        // Gibbous: terminator bows rightwards (x > 50)
        litPath = `${outerLeft} A ${rx.toFixed(2)} ${R} 0 0 0 ${cx} ${topY} Z`;
      }
    }
  }

  // Glow color scheme based on illumination
  const glowAlpha = Math.max(0.1, Number((k * 0.4).toFixed(2)));
  const glowColor = isFull
    ? `rgba(251, 191, 36, 0.45)`
    : isWaxing
    ? `rgba(52, 211, 153, ${glowAlpha})`
    : `rgba(245, 158, 11, ${glowAlpha})`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: showGlow ? `drop-shadow(0 0 ${Math.max(4, size * 0.1)}px ${glowColor})` : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible"
        aria-label={`Moon illustration: ${illumination.toFixed(1)}% illuminated (${isWaxing ? 'Waxing' : 'Waning'})`}
      >
        <defs>
          {/* Subtle Outer Atmosphere Glow */}
          <radialGradient id={`glow-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="75%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="92%" stopColor={isFull ? '#f59e0b' : '#38bdf8'} stopOpacity={isFull ? 0.25 : 0.15} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </radialGradient>

          {/* Deep Dark Unilluminated Surface (Realistic Earthshine) */}
          <radialGradient id={`dark-disc-${uniqueId}`} cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#252a34" />
            <stop offset="55%" stopColor="#161a22" />
            <stop offset="85%" stopColor="#0d1117" />
            <stop offset="100%" stopColor="#080a0e" />
          </radialGradient>

          {/* Bright Luminous Lunar Disc */}
          <radialGradient id={`lit-surface-${uniqueId}`} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#f8fafc" />
            <stop offset="70%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Crater / Maria texture colors for lit side */}
          <radialGradient id={`lit-mare-${uniqueId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
          </radialGradient>

          {/* Mask for illuminated side */}
          {litPath && (
            <mask id={maskId}>
              <rect x="0" y="0" width="100" height="100" fill="black" />
              <path d={litPath} fill="white" />
            </mask>
          )}
        </defs>

        {/* Ambient atmospheric halo */}
        {showGlow && (
          <circle cx="50" cy="50" r="49" fill={`url(#glow-${uniqueId})`} />
        )}

        {/* 1. Base Dark Moon Sphere (Earthshine Disc) */}
        <circle
          cx="50"
          cy="50"
          r={R}
          fill={`url(#dark-disc-${uniqueId})`}
        />

        {/* Realistic Dark-side Lunar Maria and Craters (subtly visible as earthshine) */}
        <g opacity="0.4">
          {/* Oceanus Procellarum & Mare Imbrium */}
          <path
            d="M 32 30 Q 38 22 46 25 Q 52 32 44 42 Q 34 46 28 38 Z"
            fill="#1e293b"
          />
          {/* Mare Serenitatis & Mare Tranquillitatis */}
          <ellipse cx="62" cy="38" rx="8" ry="6" fill="#1e293b" />
          <ellipse cx="66" cy="50" rx="9" ry="7" fill="#1e293b" />
          {/* Mare Crisium */}
          <ellipse cx="78" cy="40" rx="5" ry="4" fill="#1e293b" />
          {/* Mare Nubium & Mare Humorum */}
          <ellipse cx="40" cy="62" rx="9" ry="7" fill="#1e293b" />
          <circle cx="28" cy="58" r="4.5" fill="#1e293b" />
          {/* Tycho Crater & Rays */}
          <circle cx="48" cy="78" r="2.5" fill="#334155" />
          <line x1="48" y1="78" x2="35" y2="65" stroke="#334155" strokeWidth="0.5" opacity="0.6" />
          <line x1="48" y1="78" x2="60" y2="65" stroke="#334155" strokeWidth="0.5" opacity="0.6" />
          <line x1="48" y1="78" x2="48" y2="92" stroke="#334155" strokeWidth="0.5" opacity="0.6" />
          {/* Copernicus Crater */}
          <circle cx="36" cy="48" r="2" fill="#334155" />
        </g>

        {/* 2. Lit Moon Region (Masked by mathematically precise terminator) */}
        {!isNew && (
          <g mask={litPath ? `url(#${maskId})` : undefined}>
            {/* Bright Surface Base */}
            <circle
              cx="50"
              cy="50"
              r={R}
              fill={`url(#lit-surface-${uniqueId})`}
            />

            {/* High-detail Realistic Lunar Maria on Lit Side */}
            <g opacity="0.65">
              {/* Mare Imbrium */}
              <ellipse cx="42" cy="32" rx="10" ry="8" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Oceanus Procellarum */}
              <path
                d="M 26 36 Q 34 26 40 34 Q 38 48 28 52 Q 22 46 26 36 Z"
                fill={`url(#lit-mare-${uniqueId})`}
              />
              {/* Mare Serenitatis */}
              <ellipse cx="58" cy="35" rx="7" ry="6" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Tranquillitatis (Apollo 11 Landing site) */}
              <ellipse cx="64" cy="46" rx="8" ry="7" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Crisium (Sea of Crises) */}
              <ellipse cx="76" cy="38" rx="5" ry="4" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Fecunditatis */}
              <ellipse cx="72" cy="56" rx="7" ry="6" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Nectaris */}
              <ellipse cx="64" cy="62" rx="5" ry="4" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Nubium (Sea of Clouds) */}
              <ellipse cx="40" cy="64" rx="9" ry="7" fill={`url(#lit-mare-${uniqueId})`} />
              {/* Mare Humorum */}
              <ellipse cx="28" cy="60" rx="5" ry="4" fill={`url(#lit-mare-${uniqueId})`} />

              {/* Major Crater Highlights with Ray Systems */}
              {/* Tycho (bright white impact crater in southern highlands) */}
              <circle cx="48" cy="78" r="2.8" fill="#ffffff" />
              <line x1="48" y1="78" x2="30" y2="58" stroke="#ffffff" strokeWidth="0.7" opacity="0.65" />
              <line x1="48" y1="78" x2="68" y2="58" stroke="#ffffff" strokeWidth="0.7" opacity="0.65" />
              <line x1="48" y1="78" x2="48" y2="94" stroke="#ffffff" strokeWidth="0.6" opacity="0.65" />
              <line x1="48" y1="78" x2="26" y2="80" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
              <line x1="48" y1="78" x2="72" y2="76" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />

              {/* Copernicus crater */}
              <circle cx="36" cy="48" r="2.4" fill="#ffffff" />
              <ellipse cx="36" cy="48" rx="4" ry="4" fill="none" stroke="#e2e8f0" strokeWidth="0.5" opacity="0.7" />

              {/* Kepler crater */}
              <circle cx="26" cy="46" r="1.6" fill="#ffffff" />

              {/* Aristarchus (Brightest spot on the Moon) */}
              <circle cx="28" cy="32" r="1.8" fill="#ffffff" />

              {/* Plato crater (dark basalt floor in northern Alps) */}
              <ellipse cx="44" cy="22" rx="2.2" ry="1.4" fill="#64748b" stroke="#ffffff" strokeWidth="0.4" />
            </g>
          </g>
        )}

        {/* 3. Dark Outline & Lunar Limb Ring */}
        {showOutline && (
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="#1e293b"
            strokeWidth="1.2"
          />
        )}
      </svg>
    </div>
  );
};
