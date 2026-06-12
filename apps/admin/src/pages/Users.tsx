import { useState } from "react";
import { ROLES, userCreateSchema, userUpdateSchema } from "@isa/shared";
import { useAuth } from "../context/auth";
import { useList, useRemove, useSave } from "../lib/entities";
import { DataTable } from "../components/DataTable";
import { ConfirmDelete, Drawer, ErrorAlert, Spinner, StatusBadge } from "../components/ui";

type User = {
  id: number;
  email: string;
  name?: string | null;
  role: "ADMIN" | "EDITOR";
  isActive: boolean;
  createdAt: string;
};

export function UsersPage() {
  const { isAdmin, user: me } = useAuth();
  const list = useList<User>("users");
  const save = useSave<User>("users");
  const remove = useRemove("users");
  const [editing, setEditing] = useState<User | null>(null);
  const [creating, setCreating] = useState(false);
  const [disabling, setDisabling] = useState<User | null>(null);

  if (!isAdmin)
    return <div className="panel empty">Admin access required to manage users.</div>;

  const close = () => {
    setEditing(null);
    setCreating(false);
    save.reset();
  };

  return (
    <div>
      <div className="page-head">
        <h1>Users</h1>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + New user
        </button>
      </div>

      <ErrorAlert error={list.error} />
      {list.isLoading ? (
        <Spinner />
      ) : (
        <DataTable<User>
          rows={list.data ?? []}
          columns={[
            { header: "Email", render: (u) => u.email },
            { header: "Name", render: (u) => u.name ?? "—" },
            { header: "Role", render: (u) => <span className="badge badge-gold">{u.role}</span> },
            {
              header: "Active",
              render: (u) => <StatusBadge value={u.isActive ? "PUBLISHED" : "CLOSED"} />,
            },
          ]}
          actions={(u) => (
            <>
              <button className="btn-sm" onClick={() => setEditing(u)}>
                Edit
              </button>
              {u.isActive && u.id !== me?.id && (
                <button className="btn-sm btn-danger" onClick={() => setDisabling(u)}>
                  Disable
                </button>
              )}
            </>
          )}
        />
      )}

      {(creating || editing) && (
        <Drawer title={editing ? "Edit user" : "New user"} onClose={close}>
          <UserForm
            user={editing ?? undefined}
            submitting={save.isPending}
            submitError={save.error}
            onCancel={close}
            onSubmit={(body) => save.mutate({ id: editing?.id, body }, { onSuccess: close })}
          />
        </Drawer>
      )}

      {disabling && (
        <ConfirmDelete
          label={`${disabling.email} (disable login)`}
          busy={remove.isPending}
          error={remove.error}
          onCancel={() => {
            setDisabling(null);
            remove.reset();
          }}
          onConfirm={() => remove.mutate(disabling.id, { onSuccess: () => setDisabling(null) })}
        />
      )}
    </div>
  );
}

function UserForm({
  user,
  submitting,
  submitError,
  onCancel,
  onSubmit,
}: {
  user?: User;
  submitting?: boolean;
  submitError?: unknown;
  onCancel: () => void;
  onSubmit: (body: Record<string, unknown>) => void;
}) {
  const isEdit = !!user;
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>(user?.role ?? "EDITOR");
  const [isActive, setIsActive] = useState(user?.isActive ?? true);
  const [err, setErr] = useState<string | null>(null);

  const submit = () => {
    setErr(null);
    if (isEdit) {
      const body: Record<string, unknown> = { name: name || undefined, role, isActive };
      if (password) body.password = password;
      const r = userUpdateSchema.safeParse(body);
      if (!r.success) return setErr(r.error.issues[0]?.message ?? "Invalid input");
      onSubmit(r.data);
    } else {
      const body = { email, name: name || undefined, password, role, isActive };
      const r = userCreateSchema.safeParse(body);
      if (!r.success) return setErr(r.error.issues[0]?.message ?? "Invalid input");
      onSubmit(r.data);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {err && <div className="alert alert-error">{err}</div>}
      <ErrorAlert error={submitError} />
      <div className="field">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isEdit}
          required={!isEdit}
        />
      </div>
      <div className="field">
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label>Password {isEdit && <span className="muted">(leave blank to keep)</span>}</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required={!isEdit}
        />
      </div>
      <div className="field">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label className="checkbox">
          <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
          Active (can log in)
        </label>
      </div>
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
