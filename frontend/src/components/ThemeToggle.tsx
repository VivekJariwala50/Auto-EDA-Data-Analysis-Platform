import { Moon, Sun } from "lucide-react";
import { useTheme } from "../store/ThemeContext";

export function ThemeToggle({ style }: { style?: React.CSSProperties }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className="btn btn-ghost"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      style={style}
    >
      {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
