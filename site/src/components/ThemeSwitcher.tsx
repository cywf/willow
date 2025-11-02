import { useEffect, useState } from 'react';

const THEMES = [
  'nightfall',
  'dracula',
  'cyberpunk',
  'dark-neon',
  'hackerman',
  'gamecore',
  'neon-accent',
];

const DEFAULT_THEME = import.meta.env.DEFAULT_THEME || 'nightfall';

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(DEFAULT_THEME);

  useEffect(() => {
    setMounted(true);
    
    // Get theme from localStorage or detect preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && THEMES.includes(savedTheme)) {
      setCurrentTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Check for dark mode preference (all our themes are dark)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? DEFAULT_THEME : 'nightfall';
      setCurrentTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  if (!mounted) {
    return (
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-sm gap-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span className="hidden sm:inline">Theme</span>
        </label>
      </div>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="btn btn-ghost btn-sm gap-1" aria-label="Select theme">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span className="hidden sm:inline capitalize">{currentTheme}</span>
        <svg className="w-4 h-4 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </label>
      <ul tabIndex={0} className="dropdown-content z-[1] p-2 shadow-2xl bg-base-200 rounded-box w-52 mt-4 max-h-96 overflow-y-auto">
        {THEMES.map((theme) => (
          <li key={theme}>
            <button
              className={`btn btn-sm btn-block justify-start gap-2 ${
                currentTheme === theme ? 'btn-primary' : 'btn-ghost'
              }`}
              onClick={() => handleThemeChange(theme)}
              aria-pressed={currentTheme === theme}
            >
              {currentTheme === theme && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="capitalize">{theme.replace('-', ' ')}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
