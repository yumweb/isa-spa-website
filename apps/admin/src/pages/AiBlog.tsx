import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { BLOG_AUDIENCES, CONTENT_PILLARS, GENERATION_STATUSES } from "@isa/shared";
import { api } from "../lib/api";
import { Drawer, ErrorAlert, Spinner, StatusBadge } from "../components/ui";

/**
 * AI Blog generator console. Lets an editor kick off a manual draft-generation
 * run and watch the runs history. The generation is async on the API side, so
 * the runs list self-polls (4s) while anything is PENDING/RUNNING and stops
 * once everything settles — no websockets needed.
 */
type Run = {
  id: number;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
  trigger: "MANUAL" | "SCHEDULED";
  currentStep: string | null;
  pillar: string | null;
  topic: string | null;
  blogPostId: number | null;
  seoScore: number | null;
  qualityScore: number | null;
  retryCount: number;
  imageSource: "pexels" | "unsplash" | "none" | null;
  generationMs: number | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
};
type RunsResp = { items: Run[]; total: number; page: number; pageSize: number };
type GenerateResp = { runId: number; status: "PENDING" };

const PAGE_SIZE = 20;

export function AiBlogPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Run | null>(null);

  // ── Generate panel state ──
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [pillar, setPillar] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const runs = useQuery({
    queryKey: ["ai-runs", { status, page }],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
      if (status) p.set("status", status);
      return api<RunsResp>(`/admin/ai-blog/runs?${p.toString()}`);
    },
    // Self-poll while any run is still in flight, otherwise leave it static.
    refetchInterval: (q) => {
      const data = q.state.data as RunsResp | undefined;
      const active = data?.items.some((r) => r.status === "PENDING" || r.status === "RUNNING");
      return active ? 4000 : false;
    },
  });

  const generate = useMutation({
    mutationFn: () => {
      const body: { topic?: string; keywords?: string[]; pillar?: string } = {};
      if (topic.trim()) body.topic = topic.trim();
      const kw = keywords
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      if (kw.length) body.keywords = kw;
      if (pillar) body.pillar = pillar;
      return api<GenerateResp>("/admin/ai-blog/generate", {
        method: "POST",
        body: JSON.stringify(body),
      });
    },
    onSuccess: (data) => {
      setNote(`Run #${data.runId} started — drafting in the background.`);
      setTopic("");
      setKeywords("");
      setPillar("");
      qc.invalidateQueries({ queryKey: ["ai-runs"] });
    },
  });

  const total = runs.data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="page-head">
        <h1>AI Blog</h1>
        <Link to="/blog" className="btn">
          Go to Blog →
        </Link>
      </div>

      {/* ── Generate panel ── */}
      <div className="panel" style={{ padding: 18, marginBottom: 20 }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 17 }}>Generate a draft</h2>
        <p className="muted" style={{ margin: "0 0 14px", fontSize: 12.5 }}>
          Generates a DRAFT post for review. Uses free AI models; a run takes ~1–2 minutes.
        </p>

        <ErrorAlert error={generate.error} />
        {note && (
          <div className="alert alert-success" style={{ marginBottom: 12 }}>
            {note}
          </div>
        )}

        <div className="field-row">
          <div className="field">
            <label>Topic (optional)</label>
            <input
              type="text"
              value={topic}
              placeholder="Leave blank to auto-derive from the pillar"
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Keywords (optional, comma-separated)</label>
            <input
              type="text"
              value={keywords}
              placeholder="deep tissue, stress relief"
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Content pillar</label>
            <select value={pillar} onChange={(e) => setPillar(e.target.value)}>
              <option value="">Auto (rotate all pillars)</option>
              {BLOG_AUDIENCES.map((aud) => (
                <optgroup key={aud} label={aud}>
                  {CONTENT_PILLARS.filter((p) => p.audience === aud).map((p) => (
                    <option key={p.pillar} value={p.pillar}>
                      {p.pillar}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <button
              className="btn-primary"
              onClick={() => {
                setNote(null);
                generate.mutate();
              }}
              disabled={generate.isPending}
            >
              {generate.isPending ? "Starting…" : "Generate draft"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Runs history ── */}
      <div className="toolbar">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All statuses</option>
          {GENERATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="muted">{total} runs</span>
      </div>

      <ErrorAlert error={runs.error} />
      {runs.isLoading ? (
        <Spinner />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>ID</th>
                <th>Status</th>
                <th>Step</th>
                <th>Topic</th>
                <th>Pillar</th>
                <th>SEO</th>
                <th>Quality</th>
                <th>Image</th>
                <th>Trigger</th>
                <th>Created</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {runs.data?.items.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>
                    <StatusBadge value={r.status} />
                  </td>
                  <td className="muted">
                    {r.status === "RUNNING" || r.status === "PENDING"
                      ? r.currentStep ?? "—"
                      : "—"}
                  </td>
                  <td>{r.topic ?? <span className="muted">—</span>}</td>
                  <td className="muted">{r.pillar ?? "—"}</td>
                  <td className="muted">{r.seoScore ?? "—"}</td>
                  <td className="muted">{r.qualityScore ?? "—"}</td>
                  <td className="muted">{r.imageSource ?? "—"}</td>
                  <td className="muted">{r.trigger}</td>
                  <td className="muted">{new Date(r.createdAt).toLocaleString()}</td>
                  <td>
                    {r.blogPostId ? (
                      <Link className="btn-sm" to="/blog">
                        View draft →
                      </Link>
                    ) : r.status === "FAILED" ? (
                      <button className="btn-sm" onClick={() => setSelected(r)} title={r.errorMessage ?? ""}>
                        Why?
                      </button>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!runs.data?.items.length && (
                <tr>
                  <td colSpan={11} className="muted" style={{ textAlign: "center", padding: 28 }}>
                    No runs yet. Generate a draft above to get started.
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
        <Drawer
          title={`Run #${selected.id} · ${selected.status}`}
          onClose={() => setSelected(null)}
          footer={
            <button onClick={() => setSelected(null)}>Close</button>
          }
        >
          <fieldset>
            <legend>Run</legend>
            <dl className="kv">
              <dt>Status</dt>
              <dd>
                <StatusBadge value={selected.status} />
              </dd>
              <dt>Trigger</dt>
              <dd>{selected.trigger}</dd>
              <dt>Pillar</dt>
              <dd>{selected.pillar ?? "—"}</dd>
              <dt>Topic</dt>
              <dd>{selected.topic ?? "—"}</dd>
              <dt>Retries</dt>
              <dd>{selected.retryCount}</dd>
              <dt>Duration</dt>
              <dd>{selected.generationMs ? `${(selected.generationMs / 1000).toFixed(1)}s` : "—"}</dd>
              <dt>Created</dt>
              <dd>{new Date(selected.createdAt).toLocaleString()}</dd>
            </dl>
          </fieldset>
          {selected.errorMessage && (
            <fieldset>
              <legend>Error</legend>
              <div className="alert alert-error">{selected.errorMessage}</div>
            </fieldset>
          )}
        </Drawer>
      )}
    </div>
  );
}
