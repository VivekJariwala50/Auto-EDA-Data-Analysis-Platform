import { Moon, Sun } from "lucide-react";
import { useTheme } from "../store/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-icon"
      style={{ position: "absolute", top: "20px", right: "20px", zIndex: 100 }}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
}
