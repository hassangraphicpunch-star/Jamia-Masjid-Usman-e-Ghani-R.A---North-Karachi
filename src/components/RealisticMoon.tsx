import React from 'react';
import { MoonPhaseType } from '../services/astronomyService';

interface RealisticMoonProps {
  phaseId: MoonPhaseType;
  illumination?: number; // 0 to 100
  size?: number; // px width & height
  className?: string;
  showGlow?: boolean;
}

export const RealisticMoon: React.FC<RealisticMoonProps> = ({
  phaseId,
  illumination = 50,
  size = 64,
  className = '',
  showGlow = true,
}) => {
  const isWaxing =
    phaseId === 'waxing_crescent' ||
    phaseId === 'first_quarter' ||
    phaseId === 'waxing_gibbous';

  const isFull = phaseId === 'full_moon';
  const isNew = phaseId === 'new_moon';

  // Glow color scheme
  const glowColor = isFull
    ? 'rgba(251, 191, 36, 0.35)'
    : isWaxing
    ? 'rgba(52, 211, 153, 0.25)'
    : 'rgba(245, 158, 11, 0.22)';

  // Calculate terminator curve for SVG mask
  // Radius R = 44 inside 100x100 viewBox (center 50, 50)
  // For crescent/quarter/gibbous:
  // We draw a full lit disc, and cut out the shadow using an SVG clip path or mask!
  const getMaskD = () => {
    if (isNew) return 'M 50 6 A 44 44 0 1 0 50 94 A 44 44 0 1 0 50 6 Z'; // shadow covers all
    if (isFull) return ''; // no shadow

    // dx control for terminator curve:
    // If first_quarter / last_quarter: dx = 0 (straight line down the middle)
    // If crescent: terminator bows towards lit limb
    // If gibbous: terminator bows away into dark side
    let dx = 0;
    if (phaseId === 'waxing_crescent') dx = 22; // bows right
    else if (phaseId === 'first_quarter') dx = 0; // straight
    else if (phaseId === 'waxing_gibbous') dx = -24; // bows left
    else if (phaseId === 'waning_gibbous') dx = 24; // bows right
    else if (phaseId === 'last_quarter') dx = 0; // straight
    else if (phaseId === 'waning_crescent') dx = -22; // bows left

    if (isWaxing) {
      // Waxing: Lit side is RIGHT (from top 50,6 to bottom 50,94 along right circle arc,
      // and terminator curve returning from 50,94 to 50,6 with dx)
      return `M 50 6 A 44 44 0 0 1 50 94 Q ${50 + dx} 50 50 6 Z`;
    } else {
      // Waning: Lit side is LEFT (from top 50,6 to bottom 50,94 along left circle arc,
      // and terminator curve returning with dx)
      return `M 50 6 A 44 44 0 0 0 50 94 Q ${50 + dx} 50 50 6 Z`;
    }
  };

  const maskD = getMaskD();
  const maskId = `moon-mask-${phaseId}-${Math.round(illumination)}-${Math.round(size)}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{
        width: size,
        height: size,
        filter: showGlow ? `drop-shadow(0 0 ${Math.max(4, size * 0.12)}px ${glowColor})` : undefined,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="w-full h-full overflow-visible"
        aria-label={`${phaseId} moon illustration`}
      >
        <defs>
          {/* Subtle Outer Atmosphere Glow */}
          <radialGradient id={`atm-glow-${maskId}`} cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="95%" stopColor={isFull ? '#fbbf24' : '#67e8f9'} stopOpacity="0.15" />
            <stop offset="100%" stopColor={isFull ? '#f59e0b' : '#38bdf8'} stopOpacity="0" />
          </radialGradient>

          {/* Dark Earthshine Side Texture */}
          <radialGradient id={`dark-side-${maskId}`} cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#22252a" />
            <stop offset="60%" stopColor="#14171c" />
            <stop offset="100%" stopColor="#0a0c0f" />
          </radialGradient>

          {/* Illuminated Bright Lunar Side */}
          <radialGradient id={`lit-surface-${maskId}`} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="75%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Mare / Basaltic Plains Darker Patches */}
          <radialGradient id={`mare-grad-${maskId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.3" />
          </radialGradient>

          {/* Mask for the lit portion */}
          {maskD && (
            <mask id={maskId}>
              <rect x="0" y="0" width="100" height="100" fill="black" />
              <path d={maskD} fill="white" />
            </mask>
          )}
        </defs>

        {/* Outer Glow Halo */}
        <circle cx="50" cy="50" r="48" fill={`url(#atm-glow-${maskId})`} />

        {/* 1. Base Dark Moon Sphere (Earthshine Disc) */}
        <circle cx="50" cy="50" r="44" fill={`url(#dark-side-${maskId})`} stroke="#334155" strokeWidth="0.75" />

        {/* Craters / Mare on dark side (faintly visible earthshine) */}
        <g opacity="0.35">
          <ellipse cx="40" cy="38" rx="8" ry="6" fill="#1e293b" />
          <ellipse cx="58" cy="45" rx="10" ry="7" fill="#1e293b" />
          <ellipse cx="44" cy="62" rx="11" ry="8" fill="#1e293b" />
          <circle cx="68" cy="68" r="3" fill="#334155" />
        </g>

        {/* 2. Lit Moon Region (Masked if not full, hidden if new) */}
        {!isNew && (
          <g mask={maskD ? `url(#${maskId})` : undefined}>
            {/* Bright Surface Base */}
            <circle cx="50" cy="50" r="44" fill={`url(#lit-surface-${maskId})`} />

            {/* Realistic Lunar Maria (Dark Volcanic Plains) */}
            {/* Oceanus Procellarum & Mare Imbrium */}
            <path
              d="M 32 30 Q 40 22 48 26 Q 54 32 46 42 Q 36 45 30 38 Z"
              fill={`url(#mare-grad-${maskId})`}
            />
            {/* Mare Serenitatis & Tranquillitatis */}
            <path
              d="M 52 32 Q 62 30 68 36 Q 66 46 56 46 Q 48 40 52 32 Z"
              fill={`url(#mare-grad-${maskId})`}
            />
            {/* Mare Nubium & Humorum */}
            <path
              d="M 38 52 Q 46 48 54 54 Q 52 64 42 66 Q 34 60 38 52 Z"
              fill={`url(#mare-grad-${maskId})`}
            />
            {/* Mare Crisium (distinct isolated oval) */}
            <ellipse cx="72" cy="40" rx="4.5" ry="3.5" fill={`url(#mare-grad-${maskId})`} />

            {/* Tycho Crater & Light Rays (South Pole) */}
            <circle cx="48" cy="74" r="2.5" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.5" />
            <path
              d="M 48 74 L 38 60 M 48 74 L 56 58 M 48 74 L 40 82 M 48 74 L 58 78 M 48 74 L 32 76"
              stroke="#e2e8f0"
              strokeWidth="0.5"
              strokeOpacity="0.6"
            />

            {/* Copernicus & Kepler Craters */}
            <circle cx="36" cy="46" r="2" fill="#f8fafc" stroke="#94a3b8" strokeWidth="0.4" />
            <circle cx="28" cy="48" r="1.5" fill="#f8fafc" />
          </g>
        )}

        {/* 3. Subtle Sphere 3D Rim Highlight */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke={isFull ? '#fef08a' : isWaxing ? '#a7f3d0' : '#fed7aa'}
          strokeWidth="0.6"
          strokeOpacity={isNew ? '0.2' : '0.45'}
        />
      </svg>
    </div>
  );
};
