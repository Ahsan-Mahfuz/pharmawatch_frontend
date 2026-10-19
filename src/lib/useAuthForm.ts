"use client";

import { useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "./schemas";

export function useAuthForm<Schema extends z.ZodType, Values extends object>(
  schema: Schema,
  blank: Values,
) {
  const [values, setValues] = useState<Values>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((s) => ({ ...s, [key]: value }));
    setErrors((e) => (e[key as string] ? { ...e, [key as string]: "" } : e));
  }

  function validate(): z.output<Schema> | null {
    const parsed = schema.safeParse(values);
    if (parsed.success) {
      setErrors({});
      return parsed.data as z.output<Schema>;
    }
    setErrors(fieldErrors(parsed.error));
    return null;
  }

  function blame(field: string | undefined, message: string) {
    if (field) setErrors((e) => ({ ...e, [field]: message }));
  }

  return { values, errors, set, validate, blame };
}
