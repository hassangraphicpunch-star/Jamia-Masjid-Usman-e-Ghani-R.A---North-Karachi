/**
 * Permanent Dark Theme Configuration for Jamia Masjid Usman-e-Ghani R.A.
 * 
 * Enforces one permanent, elegant, consistent Dark Theme:
 * - Main background: Deep midnight navy (#0B1220)
 * - Secondary background: Dark navy (#111827)
 * - Card background: Charcoal navy (#172033)
 * - Elevated card background: (#1E293B)
 * - Primary accent: Emerald green (#10B981)
 * - Secondary accent: Islamic green (#059669)
 * - Gold highlights: Soft gold (#D4AF6E)
 * - Main headings: Off-white (#F8FAFC)
 * - Body text: Light gray (#CBD5E1)
 * - Secondary text: Muted slate (#94A3B8)
 * - Borders: Subtle dark slate (#334155)
 * - Footer background: Deep navy (#070D18)
 */

export const PERMANENT_DARK_THEME = {
  id: 'dark',
  nameEn: 'Permanent Premium Dark',
  nameUr: 'مستقل پریمیم ڈارک تھیم',
  themeColorMeta: '#0B1220',
  palette: {
    mainBg: '#0B1220',
    secondaryBg: '#111827',
    cardBg: '#172033',
    elevatedCardBg: '#1E293B',
    primaryAccent: '#10B981',
    secondaryAccent: '#059669',
    goldAccent: '#D4AF6E',
    headings: '#F8FAFC',
    bodyText: '#CBD5E1',
    secondaryText: '#94A3B8',
    borders: '#334155',
    footerBg: '#070D18',
  },
} as const;

/**
 * Initializes and locks the permanent dark theme on the document and cleans legacy localStorage keys.
 */
export function initPermanentDarkTheme(): void {
  if (typeof document === 'undefined') return;

  // Clear any legacy theme toggles or modes from local storage
  try {
    localStorage.removeItem('jamia_sky_theme_mode_v1');
    localStorage.removeItem('theme');
  } catch {
    // ignore
  }

  // Force dark attributes on document root and body
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.setAttribute('data-theme-mode', 'dark');
  document.documentElement.setAttribute('data-theme-family', 'dark');
  document.documentElement.classList.add('theme-dark', 'dark');
  document.documentElement.classList.remove('theme-light', 'light');

  document.body.setAttribute('data-theme', 'dark');
  document.body.setAttribute('data-theme-family', 'dark');
  document.body.classList.add('theme-dark', 'dark');
  document.body.classList.remove('theme-light', 'light');

  // Enforce mobile browser bar color
  let metaTheme = document.querySelector('meta[name="theme-color"]');
  if (!metaTheme) {
    metaTheme = document.createElement('meta');
    metaTheme.setAttribute('name', 'theme-color');
    document.head.appendChild(metaTheme);
  }
  metaTheme.setAttribute('content', PERMANENT_DARK_THEME.themeColorMeta);
}

// Backward compatibility alias so existing initializers work cleanly
export const applySkyThemeToDOM = initPermanentDarkTheme;
