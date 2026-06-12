import type { ReactNode } from "react";

// Matches the approved prototype inputs: white field, warm #E0D2B6 border,
// 10px radius, 13/15 padding, olive-taupe text.
const inputBase =
  "mt-1.5 w-full rounded-[10px] border border-[#E0D2B6] bg-white px-[15px] py-[13px] text-[14px] text-[#56564A] placeholder:text-[#A39C8C] outline-none focus:border-gold focus:ring-2 focus:ring-gold/25";

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
