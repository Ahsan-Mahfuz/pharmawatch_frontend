import { z } from "zod";
import { MIN_LENGTH, passwordRules } from "@/domain";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Enter your email")
  .email("That does not look like an email address");

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().default(false),
});

const strongPassword = z
  .string()
  .min(MIN_LENGTH, `At least ${MIN_LENGTH} characters`)
  .superRefine((value, ctx) => {
    for (const rule of passwordRules(value)) {
      if (!rule.met) ctx.addIssue({ code: "custom", message: rule.label });
    }
  });

const confirmed = <T extends z.ZodRawShape>(shape: T) =>
  z
    .object(shape)
    .refine((v) => (v as { password: string; confirm: string }).password ===
      (v as { confirm: string }).confirm, {
      path: ["confirm"],
      message: "The two passwords do not match",
    });

export const signUpSchema = confirmed({
  name: z.string().trim().min(2, "Enter your full name"),
  pharmacy: z.string().trim().min(2, "Name the pharmacy"),
  email,
  password: strongPassword,
  confirm: z.string().min(1, "Type the password again"),
  terms: z.literal(true, { message: "Please accept the terms" }),
});

export const forgotSchema = z.object({ email });

export const resetSchema = confirmed({
  password: strongPassword,
  confirm: z.string().min(1, "Type the password again"),
});

export type SignInValues = z.output<typeof signInSchema>;
export type SignUpValues = z.output<typeof signUpSchema>;
export type ForgotValues = z.output<typeof forgotSchema>;
export type ResetValues = z.output<typeof resetSchema>;

export const BLANK_SIGN_IN = { email: "", password: "", remember: false };
export const BLANK_SIGN_UP = {
  name: "", pharmacy: "", email: "", password: "", confirm: "", terms: false,
};
export const BLANK_RESET = { password: "", confirm: "" };
