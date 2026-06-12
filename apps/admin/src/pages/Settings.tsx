import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { ErrorAlert, Spinner } from "../components/ui";

type SettingsResp = { settings: Record<string, unknown> };

const SOCIAL_KEYS = ["instagram", "facebook", "youtube", "linkedin"] as const;

/**
 * Friendly editor over the key/value settings store. Site name + tagline are
 * stored as their own keys; social links live under a single `social` object.
 * Each row PUTs independently (PUT /api/admin/settings/:key).
 */
export function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api<SettingsResp>("/admin/settings"),
  });

  const save = useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) =>
      api(`/admin/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [social, setSocial] = useState<Record<string, string>>({});
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!data) return;
    const s = data.settings;
    setSiteName(typeof s.siteName === "string" ? s.siteName : "");
    setTagline(typeof s.tagline === "string" ? s.tagline : "");
    setSocial((s.social as Record<string, string>) ?? {});
  }, [data]);

  const doSave = (key: string, value: unknown) =>
    save.mutate({ key, value }, { onSuccess: () => flash(key) });
  const flash = (key: string) => {
    setSavedKey(key);
    setTimeout(() => setSavedKey((k) => (k === key ? null : k)), 1500);
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <div className="page-head">
        <h1>Settings</h1>
      </div>
      <ErrorAlert error={error || save.error} />

      <div className="panel" style={{ padding: 20, maxWidth: 640 }}>
        <div className="field">
          <label>Site name</label>
          <input value={siteName} onChange={(e) => setSiteName(e.target.value)} />
        </div>
        <button onClick={() => doSave("siteName", siteName)} disabled={save.isPending}>
          {savedKey === "siteName" ? "Saved ✓" : "Save site name"}
        </button>

        <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid var(--line)" }} />

        <div className="field">
          <label>Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <button onClick={() => doSave("tagline", tagline)} disabled={save.isPending}>
          {savedKey === "tagline" ? "Saved ✓" : "Save tagline"}
        </button>

        <hr style={{ margin: "20px 0", border: 0, borderTop: "1px solid var(--line)" }} />

        <h3 style={{ fontSize: 18 }}>Social links</h3>
        {SOCIAL_KEYS.map((k) => (
          <div className="field" key={k}>
            <label style={{ textTransform: "capitalize" }}>{k}</label>
            <input
              value={social[k] ?? ""}
              onChange={(e) => setSocial((s) => ({ ...s, [k]: e.target.value }))}
            />
          </div>
        ))}
        <button onClick={() => doSave("social", social)} disabled={save.isPending}>
          {savedKey === "social" ? "Saved ✓" : "Save social links"}
        </button>
      </div>
    </div>
  );
}
