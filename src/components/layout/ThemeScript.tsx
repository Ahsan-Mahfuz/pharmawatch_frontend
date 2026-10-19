export const THEME_KEY = "pw-theme";

const SCRIPT = `
try {
  var t = localStorage.getItem("${THEME_KEY}");
  if (t === "dark" || t === "light") document.documentElement.dataset.theme = t;
} catch (e) {}
`.trim();

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
