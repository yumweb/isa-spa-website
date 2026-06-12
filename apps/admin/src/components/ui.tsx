import { useEffect, type ReactNode } from "react";

export function Spinner({ label = "Loading…" }: { label?: string }) {
  return <div className="spinner">{label}</div>;
}

export function ErrorAlert({ error }: { error: unknown }) {
  if (!error) return null;
  const msg = error instanceof Error ? error.message : String(error);
  return <div className="alert alert-error">{msg}</div>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function StatusBadge({ value }: { value: string }) {
  return <span className={`badge badge-${value}`}>{value}</span>;
}

/** Right-side drawer used for create/edit forms and detail views. */
export function Drawer({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEscClose(onClose);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="drawer" onMouseDown={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2 style={{ margin: 0, fontSize: 20 }}>{title}</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </div>
  );
}

/** Centered modal for small dialogs (confirm, media picker). */
export function Modal({
  title,
  onClose,
  children,
  wide,
}: {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  useEscClose(onClose);
  return (
    <div className="overlay center" onMouseDown={onClose}>
      <div
        className="modal"
        style={wide ? { width: "min(820px, 96vw)" } : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && <h2 style={{ fontSize: 20, marginTop: 0 }}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function ConfirmDelete({
  label,
  busy,
  error,
  onCancel,
  onConfirm,
}: {
  label: string;
  busy?: boolean;
  error?: unknown;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal title="Confirm delete" onClose={onCancel}>
      <p>
        Delete <strong>{label}</strong>? This cannot be undone.
      </p>
      <ErrorAlert error={error} />
      <div className="row" style={{ justifyContent: "flex-end", marginTop: 16 }}>
        <button onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={busy}>
          {busy ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

function useEscClose(onClose: () => void) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
}
