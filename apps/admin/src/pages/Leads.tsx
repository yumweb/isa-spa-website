import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FORM_TYPES, SUBMISSION_STATUSES } from "@isa/shared";
import { api, downloadFile } from "../lib/api";
import { useAuth } from "../context/auth";
import { Drawer, ErrorAlert, Spinner, StatusBadge } from "../components/ui";

type Assignee = { id: number; name?: string | null; email: string };
type Lead = {
  id: number;
  type: string;
  status: string;
  assignedTo: number | null;
  notes: string | null;
  sourcePage: string | null;
  payload: Record<string, unknown>;
  createdAt: string;
  ip?: string | null;
  userAgent?: string | null;
  assignee?: Assignee | null;
};
type ListResp = { items: Lead[]; total: number; page: number; pageSize: number };

const PAGE_SIZE = 25;

export function LeadsPage() {
  const { isAdmin } = useAuth();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [exporting, setExporting] = useState(false);

  const query = useQuery({
    queryKey: ["leads", { type, status, page }],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (type) p.set("type", type);
      if (status) p.set("status", status);
      return api<ListResp>(`/submissions/admin?${p.toString()}`);
    },
  });

  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => api<{ items: Assignee[] }>("/admin/users").then((r) => r.items),
    enabled: isAdmin,
  });

  const total = query.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const onExport = async () => {
    setExporting(true);
    try {
      await downloadFile(`/submissions/admin/export${type ? `?type=${type}` : ""}`, "leads.csv");
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      <div className="page-head">
        <h1>Leads</h1>
        {isAdmin && (
          <button onClick={onExport} disabled={exporting}>
            {exporting ? "Exporting…" : "Export CSV"}
          </button>
        )}
      </div>

      <div className="toolbar">
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All types</option>
          {FORM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {SUBMISSION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="muted">{total} total</span>
      </div>

      <ErrorAlert error={query.error} />
      {query.isLoading ? (
        <Spinner />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Assignee</th>
                <th>Received</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {query.data?.items.map((l) => (
                <tr key={l.id}>
                  <td>#{l.id}</td>
                  <td>{l.type}</td>
                  <td>{summaryName(l.payload)}</td>
                  <td className="muted">{summaryContact(l.payload)}</td>
                  <td>
                    <StatusBadge value={l.status} />
                  </td>
                  <td className="muted">{l.assignee ? l.assignee.name || l.assignee.email : "—"}</td>
                  <td className="muted">{new Date(l.createdAt).toLocaleString()}</td>
                  <td>
                    <button className="btn-sm" onClick={() => setSelected(l)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {!query.data?.items.length && (
                <tr>
                  <td colSpan={8} className="muted" style={{ textAlign: "center", padding: 28 }}>
                    No submissions match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="pagination">
        <button className="btn-sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ‹ Prev
        </button>
        <span className="muted">
          Page {page} / {pages}
        </span>
        <button className="btn-sm" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>
          Next ›
        </button>
      </div>

      {selected && (
        <LeadDrawer
          lead={selected}
          users={isAdmin ? users.data ?? [] : []}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function LeadDrawer({
  lead,
  users,
  onClose,
}: {
  lead: Lead;
  users: Assignee[];
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [status, setStatus] = useState(lead.status);
  const [assignedTo, setAssignedTo] = useState<string>(lead.assignedTo ? String(lead.assignedTo) : "");
  const [notes, setNotes] = useState(lead.notes ?? "");

  const save = useMutation({
    mutationFn: () =>
      api(`/submissions/admin/${lead.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          assignedTo: assignedTo ? Number(assignedTo) : null,
          notes,
        }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      onClose();
    },
  });

  return (
    <Drawer
      title={`Lead #${lead.id} · ${lead.type}`}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} disabled={save.isPending}>
            Close
          </button>
          <button className="btn-primary" onClick={() => save.mutate()} disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save changes"}
          </button>
        </>
      }
    >
      <ErrorAlert error={save.error} />

      <div className="field">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {SUBMISSION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {users.length > 0 && (
        <div className="field">
          <label>Assigned to</label>
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name || u.email}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label>Internal notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <fieldset>
        <legend>Submission</legend>
        <dl className="kv">
          <dt>Received</dt>
          <dd>{new Date(lead.createdAt).toLocaleString()}</dd>
          <dt>Source page</dt>
          <dd>{lead.sourcePage || "—"}</dd>
          <dt>IP</dt>
          <dd>{lead.ip || "—"}</dd>
        </dl>
      </fieldset>

      <fieldset>
        <legend>Form payload</legend>
        <dl className="kv">
          {Object.entries(lead.payload).map(([k, v]) => (
            <FragmentRow key={k} k={k} v={v} />
          ))}
        </dl>
      </fieldset>
    </Drawer>
  );
}

function FragmentRow({ k, v }: { k: string; v: unknown }) {
  return (
    <>
      <dt>{k}</dt>
      <dd>{typeof v === "object" ? JSON.stringify(v) : String(v)}</dd>
    </>
  );
}

function summaryName(p: Record<string, unknown>): string {
  return (p.name as string) || (p.recipientName as string) || "—";
}
function summaryContact(p: Record<string, unknown>): string {
  return (p.phone as string) || (p.email as string) || "—";
}
