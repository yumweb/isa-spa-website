import type { ReactNode } from "react";

/** Surface card matching the cream/sand aesthetic used across the site. */
export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-sand/50 bg-white/40 p-8 ${
        hover ? "transition hover:border-gold" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
