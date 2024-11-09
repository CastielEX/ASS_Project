import React, { createContext, useContext, useState, useEffect } from 'react';

// Default context value, defining theme and a placeholder function
const defaultThemeContext = {
  theme: 'light', // Default theme
  toggleTheme: () => {}, // Default function that does nothing
};

// Create the context with a default value
const ThemeContext = createContext(defaultThemeContext);

export const ThemeProvider = ({ children }: any) => {
  // Retrieve the theme from local storage, default to 'light' if not set
  const getStoredTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme ? storedTheme : 'light';
  };

  // Use state to manage the current theme, initialized from local storage
  const [theme, setTheme] = useState(getStoredTheme());

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      // Store the updated theme in local storage
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    // Update the body class to reflect the current theme
    document.body.className = theme;
  }, [theme]);

  // Pass the current theme and toggle function to the context provider
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the ThemeContext
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
