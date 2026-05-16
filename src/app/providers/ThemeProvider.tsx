import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useColorScheme } from "react-native";
import { AppTheme, darkTheme, lightTheme } from "../../theme";


// ─── CONTEXT TYPE ───────────────────────────────────────────
interface ThemeContextType {
  theme: AppTheme;
  isDark: boolean;
  toggleTheme: () => void;
  setDarkMode: (value: boolean) => void;
}

// ─── CONTEXT ────────────────────────────────────────────────
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ─── PROVIDER ───────────────────────────────────────────────
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // System theme detect karo (iOS/Android dono pe kaam karta hai)
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === "dark");

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const setDarkMode = useCallback((value: boolean) => {
    setIsDark(value);
  }, []);

  // Memoize karo — unnecessary re-renders avoid karne ke liye
  const value = useMemo(
    () => ({
      theme: isDark ? darkTheme : lightTheme,
      isDark,
      toggleTheme,
      setDarkMode,
    }),
    [isDark, toggleTheme, setDarkMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// ─── HOOK ───────────────────────────────────────────────────
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
