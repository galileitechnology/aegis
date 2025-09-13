"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

type ThemeStyle = {
  background: string;
  foreground: string;
  cardBg: string;
  border: string;
  buttonBg: string;
  buttonHover: string;
  buttonText: string;
  textMuted: string;
  textSuccess: string;
  mapBorder: string;
  logoFilter: string;
};

const defaultDarkStyles: ThemeStyle = {
  background: '#121212',
  foreground: '#ffffff',
  cardBg: '#1e1e1e',
  border: '#333333',
  buttonBg: '#2a2a2a',
  buttonHover: '#5200ff',
  buttonText: '#e0e0e0',
  textMuted: '#909090',
  textSuccess: '#2bff00',
  mapBorder: '#333333',
  logoFilter: 'none'
};

const defaultLightStyles: ThemeStyle = {
  background: '#f5f5f5',
  foreground: '#333333',
  cardBg: '#ffffff',
  border: '#e0e0e0',
  buttonBg: '#f0f0f0',
  buttonHover: '#5200ff',
  buttonText: '#333333',
  textMuted: '#666666',
  textSuccess: '#008000',
  mapBorder: '#cccccc',
  logoFilter: 'invert(1)'
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  styles: ThemeStyle;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
  styles: defaultDarkStyles
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [styles, setStyles] = useState<ThemeStyle>(defaultDarkStyles);

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    setStyles(initialTheme === 'dark' ? defaultDarkStyles : defaultLightStyles);
  }, []);
  
  // Apply theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    setStyles(theme === 'dark' ? defaultDarkStyles : defaultLightStyles);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, styles }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  return useContext(ThemeContext);
};