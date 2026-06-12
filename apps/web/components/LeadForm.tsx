"use client";

import { useForm, type FieldValues, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ZodType } from "zod";
import { formSchemas, type FormType } from "@isa/shared";
import { submitForm } from "@/lib/api";
import { Field, inputBase } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export type LeadFieldType = "text" | "email" | "tel" | "number" | "date" | "time" | "textarea" | "select";

export type LeadField<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  type?: LeadFieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  /** Span both columns of the grid. */
  full?: boolean;
};

type LeadFormProps<T extends FieldValues> = {
  /**
   * Submission type, e.g. "APPOINTMENT". The matching Zod schema is looked up
   * from @isa/shared internally — schemas are class instances and cannot be
   * passed as props from a Server Component to this Client Component.
   */
  type: FormType;
  /** Field render config. */
  fields: LeadField<T>[];
  /** Page the form lives on (stored with the lead). */
  sourcePage: string;
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
  /** Extra payload merged into the submission (e.g. preset plan/role). */
  defaults?: Partial<T>;
};

/**
 * Reusable lead-capture form. Validates with RHF + zodResolver against the
 * shared schema, includes a honeypot, and POSTs via the same-origin proxy.
 * All seven public forms are thin wrappers around this.
 */
export function LeadForm<T extends FieldValues>({
  type,
  fields,
  sourcePage,
  submitLabel = "Submit",
  successTitle = "Thank you.",
  successMessage = "We've received your details and will be in touch shortly.",
  defaults,
}: LeadFormProps<T>) {
  const schema = formSchemas[type] as unknown as ZodType<FieldValues>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<T>({
    resolver: zodResolver(schema) as never,
    defaultValues: defaults as never,
  });

  async function onSubmit(values: T) {
    try {
      await submitForm({ type, sourcePage, ...defaults, ...values });
    } catch (e) {
      setError("root" as Path<T>, {
        message: e instanceof Error ? e.message : "Something went wrong. Please try again.",
      });
    }
  }

  if (isSubmitSuccessful && !errors.root) {
    return (
      <div className="rounded-2xl border border-gold/40 bg-white/60 p-8 text-center" role="status">
        <h3 className="font-serif text-2xl text-ink">{successTitle}</h3>
        <p className="mt-2 text-ink-soft">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const id = `lead-${f.name}`;
        const err = errors[f.name]?.message as string | undefined;
        const aria = err ? { "aria-invalid": true, "aria-describedby": `${id}-error` } : {};
        // Optional number/select fields submit "" when blank. zod's `coerce.number`
        // turns "" into 0 (which fails `.positive()`), so send `undefined` instead.
        const reg =
          f.type === "number" || f.type === "select"
            ? register(f.name, { setValueAs: (v) => (v === "" || v == null ? undefined : v) })
            : register(f.name);
        return (
          <Field
            key={f.name}
            label={f.label}
            htmlFor={id}
            error={err}
            required={f.required}
            className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}
          >
            {f.type === "textarea" ? (
              <textarea id={id} rows={4} placeholder={f.placeholder} className={inputBase} {...reg} {...aria} />
            ) : f.type === "select" ? (
              <select id={id} className={inputBase} defaultValue="" {...reg} {...aria}>
                <option value="">{f.placeholder ?? "Select…"}</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : (
              <input id={id} type={f.type ?? "text"} placeholder={f.placeholder} className={inputBase} {...reg} {...aria} />
            )}
          </Field>
        );
      })}

      {/* Honeypot — hidden from humans; bots fill it and get rejected. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="lead-honeypot">Leave this field empty</label>
        <input id="lead-honeypot" type="text" tabIndex={-1} autoComplete="off" {...register("honeypot" as Path<T>)} />
      </div>

      {errors.root && (
        <p className="sm:col-span-2 text-sm text-red-700" role="alert">
          {errors.root.message as string}
        </p>
      )}

      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
