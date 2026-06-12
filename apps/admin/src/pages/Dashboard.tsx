import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { ErrorAlert, Spinner, StatusBadge } from "../components/ui";

type Lead = { id: number; type: string; status: string; createdAt: string };

function Stat({ label, value, to }: { label: string; value: number | string; to?: string }) {
  const inner = (
    <div className="panel stat">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

export function DashboardPage() {
  const leads = useQuery({
    queryKey: ["dash-leads"],
    queryFn: () =>
      api<{ items: Lead[]; total: number }>("/submissions/admin?pageSize=100"),
  });
  const counts = useQuery({
    queryKey: ["dash-counts"],
    queryFn: async () => {
      const get = (e: string) => api<{ items: unknown[] }>(`/admin/${e}`).then((r) => r.items.length);
      const [locations, blog, services] = await Promise.all([
        get("locations"),
        get("blog"),
        get("services"),
      ]);
      return { locations, blog, services };
    },
  });

  const items = leads.data?.items ?? [];
  const by = (s: string) => items.filter((l) => l.status === s).length;

  return (
    <div>
      <div className="page-head">
        <h1>Dashboard</h1>
      </div>
      <ErrorAlert error={leads.error || counts.error} />

      {leads.isLoading ? (
        <Spinner />
      ) : (
        <>
          <h3 style={{ marginTop: 8 }}>Leads</h3>
          <div className="card-grid">
            <Stat label="Total leads" value={leads.data?.total ?? items.length} to="/leads" />
            <Stat label="New" value={by("NEW")} to="/leads" />
            <Stat label="Contacted" value={by("CONTACTED")} to="/leads" />
            <Stat label="Closed" value={by("CLOSED")} to="/leads" />
          </div>

          <h3 style={{ marginTop: 24 }}>Content</h3>
          <div className="card-grid">
            <Stat label="Locations" value={counts.data?.locations ?? "…"} to="/locations" />
            <Stat label="Blog posts" value={counts.data?.blog ?? "…"} to="/blog" />
            <Stat label="Services" value={counts.data?.services ?? "…"} to="/services" />
          </div>

          <h3 style={{ marginTop: 24 }}>Recent submissions</h3>
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {items.slice(0, 8).map((l) => (
                  <tr key={l.id}>
                    <td>#{l.id}</td>
                    <td>{l.type}</td>
                    <td>
                      <StatusBadge value={l.status} />
                    </td>
                    <td className="muted">{new Date(l.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {!items.length && (
                  <tr>
                    <td colSpan={4} className="muted" style={{ textAlign: "center" }}>
                      No submissions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
