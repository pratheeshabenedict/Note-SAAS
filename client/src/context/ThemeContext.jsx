import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored;
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const root = document.documentElement;

    const apply = (isDark) => {
      if (isDark) {
        root.classList.add('dark');
        setResolvedTheme('dark');
      } else {
        root.classList.remove('dark');
        setResolvedTheme('light');
      }
    };

    if (theme === 'dark') {
      apply(true);
    } else if (theme === 'light') {
      apply(false);
    } else {
      // system
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches);
      const handler = (e) => apply(e.matches);
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const setAndStore = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    setAndStore(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme: setAndStore, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};