import { create } from "zustand";

interface ThemeState {
  dark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  dark: localStorage.getItem("theme") === "dark",
  toggle: () =>
    set((state) => {
      const next = !state.dark;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.classList.toggle("dark", next);
      return { dark: next };
    }),
}));

// Apply on load
if (localStorage.getItem("theme") === "dark") {
  document.documentElement.classList.add("dark");
}
