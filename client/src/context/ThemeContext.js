import React, { createContext, useContext, useEffect, useState } from 'react';
import config from '../config';
import { createTheme, ThemeProvider as MuiThemeProvider, responsiveFontSizes } from '@mui/material/styles';

// Default theme from config
const defaultTheme = {
  ...config.ui.theme,
  mode: 'light',
  isDark: false,
};

// Create context
const ThemeContext = createContext({
  theme: defaultTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

// Create a responsive MUI theme
const muiTheme = responsiveFontSizes(createTheme({
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
  },
}));

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Try to get theme preference from localStorage or use system preference
    const savedTheme = localStorage.getItem(config.storageKeys.themePreference);
    if (savedTheme) {
      return {
        ...defaultTheme,
        ...JSON.parse(savedTheme),
        isDark: JSON.parse(savedTheme).mode === 'dark',
      };
    }
    
    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      ...defaultTheme,
      mode: prefersDark ? 'dark' : 'light',
      isDark: prefersDark,
    };
  });

  // Save theme preference to localStorage
  useEffect(() => {
    const { mode, isDark, ...themeColors } = theme;
    localStorage.setItem(
      config.storageKeys.themePreference,
      JSON.stringify({ mode, ...themeColors })
    );
    
    // Update document class for dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => ({
      ...prevTheme,
      mode: prevTheme.mode === 'light' ? 'dark' : 'light',
      isDark: !prevTheme.isDark,
    }));
  };

  // Set a specific theme mode
  const setThemeMode = (mode) => {
    if (['light', 'dark'].includes(mode)) {
      setTheme(prevTheme => ({
        ...prevTheme,
        mode,
        isDark: mode === 'dark',
      }));
    }
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setTheme(prevTheme => ({
        ...prevTheme,
        mode: e.matches ? 'dark' : 'light',
        isDark: e.matches,
      }));
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  );
};

// Custom hook to use theme
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default useTheme;
