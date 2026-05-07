import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

/**
 * ThemeProvider manages dark/light mode.
 * - Persists preference in localStorage
 * - Applies [data-theme] attribute to <html> so ALL CSS tokens update instantly
 * - To change colours: edit only the CSS custom properties in index.css
 */
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
