"use client";

import { useEffect, useState } from "react";
import { fetchModelInfo, type WireModelInfo } from "@/lib/api/catalogue";

export function useModelInfo(): WireModelInfo | null {
  const [info, setInfo] = useState<WireModelInfo | null>(null);

  useEffect(() => {
    let alive = true;
    void fetchModelInfo()
      .then((next) => alive && setInfo(next))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return info;
}
