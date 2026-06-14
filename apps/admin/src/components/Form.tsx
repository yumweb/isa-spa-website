import { useMemo, useState, type ReactNode } from "react";
import { mediaUrl } from "../lib/api";
import { MediaPicker } from "./MediaPicker";
import { ErrorAlert } from "./ui";

/**
 * Structural type for the shared Zod schemas. We can't import `zod` directly
 * (it isn't an admin dependency — only a transitive one via @isa/shared), so we
 * narrow to the `.safeParse` surface the form actually uses.
 */
export type ZodLike = {
  safeParse: (
    value: unknown,
  ) =>
    | { success: true; data: unknown }
    | { success: false; error: { issues: { path: (string | number)[]; message: string }[] } };
};

/** Declarative field config that drives the generic CMS forms. */
export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "checkbox"
  | "select"
  | "tags"
  | "media"
  | "images"
  | "datetime"
  | "json";

export type Option = { label: string; value: string | number };

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: Option[];
  required?: boolean;
  help?: string;
  /** Place under the nested `seo` object (metaTitle, etc.). */
  seo?: boolean;
  half?: boolean;
  /** For `select`: coerce the chosen value to a number (e.g. categoryId). */
  numeric?: boolean;
};

export const SEO_FIELDS: FieldDef[] = [
  { name: "metaTitle", label: "Meta title", type: "text", seo: true, half: true },
  { name: "canonical", label: "Canonical URL", type: "text", seo: true, half: true },
  { name: "metaDescription", label: "Meta description", type: "textarea", seo: true },
  { name: "ogImage", label: "OG image", type: "media", seo: true },
];

type Values = Record<string, unknown>;
type Errors = Record<string, string>;

/** Convert an existing record into editable form values. */
function toFormValues(fields: FieldDef[], item?: Values): Values {
  const v: Values = {};
  const seo = (item?.seo as Values) ?? {};
  for (const f of fields) {
    const src = f.seo ? seo[f.name] : item?.[f.name];
    if (f.type === "datetime") {
      v[f.name] = src ? toLocalInput(String(src)) : "";
    } else if (f.type === "tags") {
      v[f.name] = Array.isArray(src) ? (src as string[]).join(", ") : "";
    } else if (f.type === "images") {
      v[f.name] = Array.isArray(src) ? src : [];
    } else if (f.type === "json") {
      v[f.name] = src != null ? JSON.stringify(src, null, 2) : "";
    } else if (f.type === "checkbox") {
      v[f.name] = src ?? false;
    } else {
      v[f.name] = src ?? "";
    }
  }
  return v;
}

/** Build the API payload from raw form values (coercions + nesting). */
function buildPayload(fields: FieldDef[], values: Values): Values {
  const out: Values = {};
  const seo: Values = {};
  for (const f of fields) {
    const raw = values[f.name];
    let val: unknown = raw;
    switch (f.type) {
      case "number":
        val = raw === "" || raw == null ? undefined : Number(raw);
        break;
      case "checkbox":
        val = !!raw;
        break;
      case "tags":
        val = String(raw ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case "datetime":
        val = raw ? new Date(String(raw)).toISOString() : undefined;
        break;
      case "json":
        val = raw && String(raw).trim() ? JSON.parse(String(raw)) : undefined;
        break;
      case "images":
        val = Array.isArray(raw) ? raw : [];
        break;
      case "media":
        // Empty = explicitly cleared. Send null (not undefined) so the API
        // clears the column — undefined gets dropped from the JSON payload.
        val = raw === "" || raw == null ? null : raw;
        break;
      case "select":
        if (f.numeric) val = raw === "" || raw == null ? undefined : Number(raw);
        else val = raw === "" ? undefined : raw;
        break;
      default:
        val = typeof raw === "string" && raw.trim() === "" ? undefined : raw;
    }
    if (f.seo) {
      if (val !== undefined) seo[f.name] = val;
    } else {
      out[f.name] = val;
    }
  }
  if (Object.keys(seo).length) out.seo = seo;
  return out;
}

/**
 * Controlled CMS form: renders fields, validates against the shared Zod schema
 * client-side before submit, surfaces per-field + form errors. We validate with
 * the same schema the API uses so the UX matches the server contract.
 */
export function ResourceForm({
  fields,
  schema,
  item,
  submitting,
  submitError,
  onSubmit,
  onCancel,
  extra,
}: {
  fields: FieldDef[];
  schema: ZodLike;
  item?: Values;
  submitting?: boolean;
  submitError?: unknown;
  onSubmit: (data: Values) => void;
  onCancel: () => void;
  extra?: ReactNode;
}) {
  const [values, setValues] = useState<Values>(() => toFormValues(fields, item));
  const [errors, setErrors] = useState<Errors>({});

  const seoFields = useMemo(() => fields.filter((f) => f.seo), [fields]);
  const mainFields = useMemo(() => fields.filter((f) => !f.seo), [fields]);

  const set = (name: string, value: unknown) =>
    setValues((v) => ({ ...v, [name]: value }));

  const submit = () => {
    let payload: Values;
    try {
      payload = buildPayload(fields, values);
    } catch (e) {
      setErrors({ _form: `Invalid JSON: ${(e as Error).message}` });
      return;
    }
    const result = schema.safeParse(payload);
    if (!result.success) {
      const errs: Errors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[issue.path.length - 1];
        if (typeof key === "string" && !errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit(result.data as Values);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {errors._form && <div className="alert alert-error">{errors._form}</div>}
      <ErrorAlert error={submitError} />
      {renderFields(mainFields, values, set, errors)}
      {seoFields.length > 0 && (
        <fieldset>
          <legend>SEO</legend>
          {renderFields(seoFields, values, set, errors)}
        </fieldset>
      )}
      {extra}
      <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
  );
}

function renderFields(
  fields: FieldDef[],
  values: Values,
  set: (n: string, v: unknown) => void,
  errors: Errors,
): ReactNode {
  // Group consecutive `half` fields into rows of two.
  const out: ReactNode[] = [];
  for (let i = 0; i < fields.length; i++) {
    const f = fields[i];
    if (!f) continue;
    const next = fields[i + 1];
    if (f.half && next?.half) {
      out.push(
        <div className="field-row" key={f.name}>
          <FieldControl f={f} values={values} set={set} errors={errors} />
          <FieldControl f={next} values={values} set={set} errors={errors} />
        </div>,
      );
      i++;
    } else {
      out.push(<FieldControl key={f.name} f={f} values={values} set={set} errors={errors} />);
    }
  }
  return out;
}

function FieldControl({
  f,
  values,
  set,
  errors,
}: {
  f: FieldDef;
  values: Values;
  set: (n: string, v: unknown) => void;
  errors: Errors;
}) {
  const val = values[f.name];
  const err = errors[f.name];
  const id = `f-${f.name}`;
  return (
    <div className="field">
      {f.type !== "checkbox" && (
        <label htmlFor={id}>
          {f.label}
          {f.required && <span style={{ color: "var(--danger)" }}> *</span>}
        </label>
      )}
      {f.type === "textarea" && (
        <textarea id={id} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)} />
      )}
      {f.type === "richtext" && (
        <textarea
          id={id}
          style={{ minHeight: 220 }}
          value={String(val ?? "")}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {f.type === "json" && (
        <textarea
          id={id}
          placeholder="JSON"
          value={String(val ?? "")}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {(f.type === "text" || f.type === "tags") && (
        <input
          id={id}
          value={String(val ?? "")}
          placeholder={f.type === "tags" ? "comma, separated, values" : undefined}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {f.type === "number" && (
        <input
          id={id}
          type="number"
          step="any"
          value={val === undefined || val === null ? "" : String(val)}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {f.type === "datetime" && (
        <input
          id={id}
          type="datetime-local"
          value={String(val ?? "")}
          onChange={(e) => set(f.name, e.target.value)}
        />
      )}
      {f.type === "checkbox" && (
        <label className="checkbox">
          <input
            id={id}
            type="checkbox"
            checked={!!val}
            onChange={(e) => set(f.name, e.target.checked)}
          />
          {f.label}
        </label>
      )}
      {f.type === "select" && (
        <select id={id} value={String(val ?? "")} onChange={(e) => set(f.name, e.target.value)}>
          <option value="">— select —</option>
          {f.options?.map((o) => (
            <option key={String(o.value)} value={String(o.value)}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {f.type === "media" && (
        <MediaPicker value={(val as string) || undefined} onChange={(u) => set(f.name, u ?? "")} />
      )}
      {f.type === "images" && (
        <ImagesField value={(val as string[]) ?? []} onChange={(v) => set(f.name, v)} />
      )}
      {f.help && <span className="help">{f.help}</span>}
      {err && <span className="err">{err}</span>}
    </div>
  );
}

function ImagesField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div>
      <div className="row">
        {value.map((url, i) => (
          <div key={i} style={{ position: "relative" }}>
            <img
              src={mediaUrl(url)}
              alt=""
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }}
            />
            <button
              type="button"
              className="btn-sm btn-danger"
              style={{ position: "absolute", top: -8, right: -8, padding: "0 6px" }}
              onClick={() => onChange(value.filter((_, j) => j !== i))}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>
        <MediaPicker onChange={(u) => u && onChange([...value, u])} />
      </div>
    </div>
  );
}

function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}
