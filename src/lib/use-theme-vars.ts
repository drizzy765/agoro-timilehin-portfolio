"use client";

import { useEffect, useState } from "react";

/** Reads CSS custom properties from <html> and re-reads when data-theme changes (theme previews). */
export function useThemeVars<T extends Record<string, string>>(defaults: T): T {
  const [vals, setVals] = useState<T>(defaults);
  useEffect(() => {
    const el = document.documentElement;
    const read = () => {
      const cs = getComputedStyle(el);
      const next = { ...defaults };
      for (const k of Object.keys(defaults) as (keyof T)[]) {
        const v = cs.getPropertyValue(k as string).trim();
        if (v) next[k] = v as T[keyof T];
      }
      setVals(next);
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => mo.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return vals;
}
