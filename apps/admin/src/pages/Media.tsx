import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, mediaUrl } from "../lib/api";
import { ConfirmDelete, ErrorAlert, Spinner } from "../components/ui";
import { MediaThumb, UploadButton, useMedia, type Media } from "../components/MediaPicker";

export function MediaPage() {
  const { data, isLoading, error } = useMedia();
  const qc = useQueryClient();
  const [deleting, setDeleting] = useState<Media | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  const remove = useMutation({
    mutationFn: (id: number) => api(`/admin/media/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["media"] });
      setDeleting(null);
    },
  });

  const copy = (m: Media) => {
    navigator.clipboard?.writeText(mediaUrl(m.url));
    setCopied(m.id);
    setTimeout(() => setCopied((c) => (c === m.id ? null : c)), 1500);
  };

  return (
    <div>
      <div className="page-head">
        <h1>Media</h1>
        <UploadButton label="+ Upload" />
      </div>

      <ErrorAlert error={error} />
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <div className="panel empty">No media yet. Upload an image or PDF to get started.</div>
      ) : (
        <div className="media-grid">
          {data.map((m) => (
            <div className="media-tile" key={m.id}>
              <MediaThumb item={m} />
              <div className="meta">
                <span className="fn" title={m.filename}>
                  {m.filename}
                </span>
                <div className="row" style={{ justifyContent: "space-between" }}>
                  <button className="btn-sm btn-ghost" onClick={() => copy(m)}>
                    {copied === m.id ? "Copied!" : "Copy URL"}
                  </button>
                  <button className="btn-sm btn-danger" onClick={() => setDeleting(m)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {deleting && (
        <ConfirmDelete
          label={deleting.filename}
          busy={remove.isPending}
          error={remove.error}
          onCancel={() => {
            setDeleting(null);
            remove.reset();
          }}
          onConfirm={() => remove.mutate(deleting.id)}
        />
      )}
    </div>
  );
}
