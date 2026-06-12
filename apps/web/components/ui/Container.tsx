import type { ReactNode } from "react";

/** Centered max-width wrapper, matching the Home/Locator gutter. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-7xl px-6 ${className}`}>{children}</div>;
}
