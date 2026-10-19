import { THEME_KEY } from "@/components/layout/ThemeScript";

export type Theme = "light" | "dark";

const CHANGED = "pw-theme-changed";

export function readTheme(): Theme {
  const stamped = document.documentElement.dataset.theme;
  if (stamped === "dark" || stamped === "light") return stamped;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const serverTheme = (): Theme => "light";

export function subscribeTheme(onChange: () => void): () => void {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onChange);
  window.addEventListener(CHANGED, onChange);

  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener(CHANGED, onChange);
  };
}

export function writeTheme(next: Theme): void {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {}
  window.dispatchEvent(new Event(CHANGED));
}
