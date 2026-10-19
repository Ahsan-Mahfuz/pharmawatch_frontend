import { describe, expect, it } from "vitest";
import {
  BLANK_SIGN_UP, forgotSchema, resetSchema, signInSchema, signUpSchema,
} from "@/lib/auth-schemas";
import { fieldErrors } from "@/lib/schemas";

const firstError = (result: { success: boolean; error?: unknown }, field: string) =>
  result.success ? undefined : fieldErrors(result.error as never)[field];

const goodSignUp = {
  ...BLANK_SIGN_UP,
  name: "Mahmuda Khatun",
  pharmacy: "Shahjalal Pharmacy",
  email: "Owner@PharmaWatch.test",
  password: "Shahjalal2026",
  confirm: "Shahjalal2026",
  terms: true as const,
};

describe("signInSchema", () => {
  it("normalises the email so casing never blocks a sign in", () => {
    const parsed = signInSchema.parse({
      email: "  Owner@PharmaWatch.test ", password: "x", remember: false,
    });
    expect(parsed.email).toBe("owner@pharmawatch.test");
  });

  it("asks for a password rather than letting an empty one reach the API", () => {
    const result = signInSchema.safeParse({ email: "a@b.test", password: "", remember: false });
    expect(firstError(result, "password")).toBe("Enter your password");
  });

  it("catches an address that is not one", () => {
    const result = signInSchema.safeParse({ email: "owner@", password: "x", remember: false });
    expect(firstError(result, "email")).toContain("email address");
  });
});

describe("signUpSchema", () => {
  it("accepts a complete, policy-passing account", () => {
    expect(signUpSchema.safeParse(goodSignUp).success).toBe(true);
  });

  it("refuses a weak password before it leaves the browser", () => {
    const result = signUpSchema.safeParse({ ...goodSignUp, password: "password123", confirm: "password123" });
    expect(result.success).toBe(false);
  });

  it("points the mismatch at the confirm box, not the password", () => {
    const result = signUpSchema.safeParse({ ...goodSignUp, confirm: "Shahjalal2027" });
    expect(firstError(result, "confirm")).toContain("do not match");
  });

  it("will not create an account without the responsibility box ticked", () => {
    const result = signUpSchema.safeParse({ ...goodSignUp, terms: false });
    expect(firstError(result, "terms")).toContain("accept");
  });

  it("requires a pharmacy name, since stock belongs to one", () => {
    const result = signUpSchema.safeParse({ ...goodSignUp, pharmacy: " " });
    expect(firstError(result, "pharmacy")).toContain("pharmacy");
  });
});

describe("forgotSchema", () => {
  it("only needs a valid address", () => {
    expect(forgotSchema.parse({ email: "Owner@PharmaWatch.test" }).email)
      .toBe("owner@pharmawatch.test");
  });
});

describe("resetSchema", () => {
  it("holds the new password to the same policy as sign up", () => {
    expect(resetSchema.safeParse({ password: "qwerty123", confirm: "qwerty123" }).success)
      .toBe(false);
    expect(resetSchema.safeParse({ password: "Shahjalal2026", confirm: "Shahjalal2026" }).success)
      .toBe(true);
  });
});
