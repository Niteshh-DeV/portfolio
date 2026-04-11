import { useState, useEffect, useCallback } from 'react';

/**
 * Shared hook for theme management.
 * Reads the user's preference from localStorage on mount,
 * applies the correct class to <html>, and exposes a toggle.
 */
export function useTheme() {
  const [darkMode, setDarkMode] = useState(true);

  // Sync DOM + localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  }, []);

  return { darkMode, toggleDarkMode } as const;
}
