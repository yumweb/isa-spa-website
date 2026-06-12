import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, login, setToken } from "./lib/api";

type Lead = {
  id: number;
  type: string;
  status: string;
  createdAt: string;
  payload: Record<string, unknown>;
};

/**
 * Minimal CMS shell: login + leads inbox. Next session: add routing
 * (react-router) and CRUD screens for Locations, Services, Blog, etc.
 */
export function App() {
  const [authed, setAuthed] = useState<boolean>(!!localStorage.getItem("isa_access"));
  if (!authed) return <Login onDone={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { setToken(null); setAuthed(false); }} />;
}

function Login({ onDone }: { onDone: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  return (
    <form
      style={{ maxWidth: 320, margin: "12vh auto", display: "grid", gap: 10, fontFamily: "system-ui" }}
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await login(email, password);
          onDone();
        } catch (e) {
          setErr((e as Error).message);
        }
      }}
    >
      <h1 style={{ fontSize: 22 }}>ISA Spa CMS</h1>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Sign in</button>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
    </form>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["leads"],
    queryFn: () => api<{ items: Lead[]; total: number }>("/submissions/admin"),
  });
  return (
    <div style={{ maxWidth: 1000, margin: "40px auto", fontFamily: "system-ui" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Leads</h1>
        <button onClick={onLogout}>Logout</button>
      </header>
      {isLoading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>{(error as Error).message}</p>}
      <table style={{ width: "100%", marginTop: 16, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Type</th>
            <th align="left">Status</th>
            <th align="left">Created</th>
            <th align="left">Payload</th>
          </tr>
        </thead>
        <tbody>
          {data?.items.map((l) => (
            <tr key={l.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{l.id}</td>
              <td>{l.type}</td>
              <td>{l.status}</td>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td><code>{JSON.stringify(l.payload)}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
