"use client";

import { useState } from "react";
import type { z } from "zod";
import { fieldErrors } from "@/lib/schemas";

export function useRecordForm<Schema extends z.ZodType>(
  schema: Schema,
  blank: z.input<Schema>,
) {
  const [values, setValues] = useState<z.input<Schema>>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  return {
    values,
    errors,
    set: (key: string, value: string) =>
      setValues((current) => ({ ...(current as object), [key]: value }) as z.input<Schema>),
    load: (next: z.input<Schema>) => {
      setValues(next);
      setErrors({});
    },
    blame: (field?: string, message?: string) => {
      if (field && message) setErrors((current) => ({ ...current, [field]: message }));
    },
    reset: () => {
      setValues(blank);
      setErrors({});
    },
    validate: (): z.output<Schema> | null => {
      const parsed = schema.safeParse(values);
      if (parsed.success) {
        setErrors({});
        return parsed.data as z.output<Schema>;
      }
      setErrors(fieldErrors(parsed.error));
      return null;
    },
  };
}
