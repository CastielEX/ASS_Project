import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
const ThemeToggle = () => {
  // Load theme preference from localStorage
  const initialTheme = localStorage.getItem("theme") === "dark";
  const [isDarkMode, setIsDarkMode] = useState(initialTheme);

  const { theme, toggleTheme } = useTheme();
  // Update the body class based on the current theme

  useEffect(() => {
   document.body.className = theme;
   setIsDarkMode((prev) => !prev); // Toggle the theme state
 }, [theme]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark"); // Store the theme in localStorage
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light"); // Store the theme in localStorage
    }
  }, [isDarkMode]); // Effect reruns when `isDarkMode` changes



  return (
    <div className="checkbox-wrapper-54">
      <label className="switch">
        <input
          type="checkbox"
          onClick={toggleTheme} // Toggle theme when checkbox is clicked
          checked={isDarkMode} // Bind checkbox state to `isDarkMode`
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default ThemeToggle;
