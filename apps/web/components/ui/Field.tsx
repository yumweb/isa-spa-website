import type { ReactNode } from "react";

const inputBase =
  "mt-1.5 w-full rounded-xl border border-sand/60 bg-white/60 px-4 py-3 text-ink placeholder:text-mute/70 outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

/** Labelled field wrapper with accessible error messaging. */
export function Field({
  label,
  htmlFor,
  error,
  required,
  className = "",
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {required && <span className="text-gold-deep"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export { inputBase };
