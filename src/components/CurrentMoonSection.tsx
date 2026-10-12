import React from 'react';
import { MoonPhaseSection } from './MoonPhaseSection';

interface CurrentMoonSectionProps {
  language?: 'ur' | 'en';
  onRefresh?: () => void;
  isCompact?: boolean;
}

/**
 * Re-exporting MoonPhaseSection for backward compatibility across the application.
 * All old mock timers, hardcoded cycle steps, and duplicate logic have been replaced
 * with the unified, astronomical MoonPhaseSection inspired by Timeanddate.com.
 */
export const CurrentMoonSection: React.FC<CurrentMoonSectionProps> = ({
  language = 'ur',
  isCompact = false,
}) => {
  return (
    <MoonPhaseSection
      language={language}
      isCompact={isCompact}
    />
  );
};

export default CurrentMoonSection;
