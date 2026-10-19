export const MIN_LENGTH = 10;

const COMMON = new Set([
  "password", "password1", "password123", "12345678", "123456789", "1234567890",
  "qwertyuiop", "qwerty123", "letmein123", "welcome123", "admin123", "pharmacy1",
  "iloveyou", "abc12345", "pass1234", "changeme", "medicine1", "dhaka1234",
]);

export type Rule = { id: string; label: string; met: boolean };

export function passwordRules(password: string, email = ""): Rule[] {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  const lower = password.toLowerCase();

  return [
    { id: "length", label: `At least ${MIN_LENGTH} characters`, met: password.length >= MIN_LENGTH },
    { id: "case", label: "An upper and a lower case letter", met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { id: "digit", label: "A number", met: /\d/.test(password) },
    { id: "common", label: "Not a commonly used password", met: password.length > 0 && !COMMON.has(lower) },
    {
      id: "personal",
      label: "Not your own name or email",
      met: password.length > 0 && (local.length < 3 || !lower.includes(local)),
    },
  ];
}

export function passwordOk(password: string, email = ""): boolean {
  return passwordRules(password, email).every((r) => r.met);
}

export type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string; percent: number };

const LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"] as const;

export function passwordStrength(password: string, email = ""): Strength {
  if (!password) return { score: 0, label: "", percent: 0 };

  const rules = passwordRules(password, email);
  const failed = rules.filter((r) => !r.met).length;

  let points = rules.length - failed;
  if (password.length >= 14) points += 1;
  if (/[^A-Za-z0-9]/.test(password)) points += 1;
  if (failed > 0) points = Math.min(points, 3);

  const score = Math.max(0, Math.min(4, points - 2)) as Strength["score"];
  return { score, label: LABELS[score]!, percent: ((score + 1) / 5) * 100 };
}
