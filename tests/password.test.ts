import { describe, expect, it } from "vitest";
import { MIN_LENGTH, passwordOk, passwordRules, passwordStrength } from "@/domain";

const met = (pw: string, id: string, email = "") =>
  passwordRules(pw, email).find((r) => r.id === id)?.met;

describe("passwordRules", () => {
  it("wants a minimum length", () => {
    expect(met("Ab1".padEnd(MIN_LENGTH - 1, "x"), "length")).toBe(false);
    expect(met("Ab1".padEnd(MIN_LENGTH, "x"), "length")).toBe(true);
  });

  it("wants both cases", () => {
    expect(met("alllowercase1", "case")).toBe(false);
    expect(met("ALLUPPERCASE1", "case")).toBe(false);
    expect(met("MixedCase1xyz", "case")).toBe(true);
  });

  it("wants a number", () => {
    expect(met("NoDigitsHere", "digit")).toBe(false);
    expect(met("HasADigit1xx", "digit")).toBe(true);
  });

  it("rejects a password from the common list, whatever the casing", () => {
    expect(met("Password123", "common")).toBe(false);
    expect(met("PASSWORD123", "common")).toBe(false);
  });

  it("rejects a password built from the email", () => {
    expect(met("Rafiq12345xyz", "personal", "rafiq@pharmawatch.test")).toBe(false);
    expect(met("Unrelated1Pass", "personal", "rafiq@pharmawatch.test")).toBe(true);
  });

  it("ignores a very short email local part rather than banning two letters", () => {
    expect(met("AbSolutely1Fine", "personal", "ab@x.test")).toBe(true);
  });

  it("marks every rule unmet for an empty password", () => {
    expect(passwordRules("").every((r) => !r.met)).toBe(true);
  });
});

describe("passwordOk", () => {
  it("accepts a password that passes every rule", () => {
    expect(passwordOk("Shahjalal2026", "owner@pharmawatch.test")).toBe(true);
  });

  it("refuses one that fails any single rule", () => {
    expect(passwordOk("shahjalal2026")).toBe(false);
  });
});

describe("passwordStrength", () => {
  it("reports nothing for an empty box", () => {
    expect(passwordStrength("")).toEqual({ score: 0, label: "", percent: 0 });
  });

  it("never rates a failing password above fair", () => {
    expect(passwordStrength("short1A").score).toBeLessThanOrEqual(2);
  });

  it("rewards length and symbols once the rules are met", () => {
    const plain = passwordStrength("Shahjalal2026");
    const longer = passwordStrength("Shahjalal2026!extra");
    expect(longer.score).toBeGreaterThan(plain.score);
    expect(longer.label).toBe("Strong");
  });

  it("keeps the meter inside its track", () => {
    for (const pw of ["", "a", "Shahjalal2026", "Shahjalal2026!!!!!!!!!!"]) {
      const { percent } = passwordStrength(pw);
      expect(percent).toBeGreaterThanOrEqual(0);
      expect(percent).toBeLessThanOrEqual(100);
    }
  });
});
