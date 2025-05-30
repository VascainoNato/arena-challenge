import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// C
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
   // Creates the local theme state, starting with "light" by default. 
  const [theme, setTheme] = useState<Theme>("light");
    // Runs once when mounting, tries to find themes saved in localStorage, if saved, sets it as the initial theme.
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme;
    if (saved) setTheme(saved);
  }, []);

  // Runs whenever the Theme changes, also saves the choice in LocalStorage.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function that switches between light and dark, and updates the state by activating the themes.
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
// Creates useTheme, a custom hook to access the context created here - With security logic to prevent access from outside the ThemeProvider.
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
