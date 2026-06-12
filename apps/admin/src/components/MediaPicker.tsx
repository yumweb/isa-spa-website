import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, apiUpload, mediaUrl } from "../lib/api";
import { Modal, Spinner, ErrorAlert } from "./ui";

export type Media = {
  id: number;
  filename: string;
  url: string;
  mime: string;
  alt?: string | null;
  createdAt: string;
};

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: () => api<{ items: Media[] }>("/admin/media").then((r) => r.items),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, alt }: { file: File; alt?: string }) => {
      const form = new FormData();
      form.append("file", file);
      if (alt) form.append("alt", alt);
      return apiUpload<{ item: Media }>("/admin/media", form).then((r) => r.item);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["media"] }),
  });
}

function isImage(mime: string) {
  return mime.startsWith("image/");
}

export function MediaThumb({ item, size = 120 }: { item: Media; size?: number }) {
  return (
    <div
      className="thumb"
      style={
        isImage(item.mime)
          ? { backgroundImage: `url(${mediaUrl(item.url)})`, height: size }
          : { height: size }
      }
    >
      {!isImage(item.mime) && (item.mime.includes("pdf") ? "PDF" : "FILE")}
    </div>
  );
}

/** Inline upload field. */
export function UploadButton({ label = "Upload" }: { label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const upload = useUploadMedia();
  return (
    <>
      <button className="btn-primary" onClick={() => ref.current?.click()} disabled={upload.isPending}>
        {upload.isPending ? "Uploading…" : label}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload.mutate({ file });
          e.target.value = "";
        }}
      />
      {upload.isError && <ErrorAlert error={upload.error} />}
    </>
  );
}

/**
 * Reusable media chooser. Renders the current value (preview + clear) plus a
 * "Choose" button that opens the library modal with upload support. Returns the
 * media `url` string (e.g. /uploads/x.jpg) which is what every content schema
 * stores for image fields.
 */
export function MediaPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {value ? (
        <div className="row" style={{ alignItems: "center" }}>
          <img
            src={mediaUrl(value)}
            alt=""
            style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid var(--line)" }}
          />
          <button type="button" className="btn-sm" onClick={() => setOpen(true)}>
            Change
          </button>
          <button type="button" className="btn-sm btn-ghost" onClick={() => onChange(undefined)}>
            Clear
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          Choose image…
        </button>
      )}
      {open && (
        <MediaLibraryModal
          onClose={() => setOpen(false)}
          onPick={(m) => {
            onChange(m.url);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export function MediaLibraryModal({
  onClose,
  onPick,
}: {
  onClose: () => void;
  onPick: (m: Media) => void;
}) {
  const { data, isLoading, error } = useMedia();
  return (
    <Modal title="Media library" onClose={onClose} wide>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
        <span className="muted">Click an item to select it.</span>
        <UploadButton />
      </div>
      <ErrorAlert error={error} />
      {isLoading ? (
        <Spinner />
      ) : !data?.length ? (
        <p className="muted">No media yet — upload an image to get started.</p>
      ) : (
        <div className="media-grid" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {data.map((m) => (
            <button
              key={m.id}
              className="media-tile"
              style={{ padding: 0, textAlign: "left", cursor: "pointer" }}
              onClick={() => onPick(m)}
              type="button"
            >
              <MediaThumb item={m} />
              <div className="meta">
                <span className="fn" title={m.filename}>
                  {m.filename}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
}
