"use client";

import { passwordRules, passwordStrength } from "@/domain";
import { Bar } from "@/components/ui/Bar";

const TONE = ["var(--st-expired)", "var(--st-expired)", "var(--st-critical)",
  "var(--st-near)", "var(--st-active)"] as const;

export function PasswordRules({ password, email }: { password: string; email: string }) {
  const rules = passwordRules(password, email);
  const strength = passwordStrength(password, email);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Bar percent={strength.percent} color={TONE[strength.score]!} height={6}
          className="flex-1" />
        <span className="num w-[72px] text-right text-[11.5px] text-ink-2">
          {strength.label}
        </span>
      </div>

      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {rules.map((rule) => (
          <li key={rule.id} className="relative flex items-center gap-2 text-[12.5px]"
            style={{ color: rule.met ? "var(--st-active)" : "var(--ink-3)" }}>
            <span aria-hidden="true" className="w-3 text-center font-bold">
              {rule.met ? "✓" : "–"}
            </span>
            <span className={rule.met ? "" : "text-ink-2"}>{rule.label}</span>
            <span className="sr">{rule.met ? "met" : "not met yet"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
