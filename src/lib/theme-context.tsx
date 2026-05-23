'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('crm_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (parsed.theme) {
        setThemeState(parsed.theme);
        applyTheme(parsed.theme);
        return;
      }
    }
    // Default to light
    applyTheme('light');
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;
    
    let resolved: 'light' | 'dark';
    
    if (newTheme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      resolved = newTheme;
    }

    setResolvedTheme(resolved);

    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    
    // Save to localStorage
    const savedSettings = localStorage.getItem('crm_settings');
    const settings = savedSettings ? JSON.parse(savedSettings) : {};
    settings.theme = newTheme;
    localStorage.setItem('crm_settings', JSON.stringify(settings));
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const savedSettings = localStorage.getItem('crm_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.theme === 'system') {
          applyTheme('system');
        }
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
