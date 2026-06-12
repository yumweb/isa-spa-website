import { useState } from "react";
import type { WithId } from "../lib/entities";
import { useList, useRemove, useSave } from "../lib/entities";
import { DataTable, type Column } from "./DataTable";
import { ResourceForm, type FieldDef, type ZodLike } from "./Form";
import { ConfirmDelete, Drawer, ErrorAlert, Spinner } from "./ui";

/**
 * Generic list + create/edit/delete screen for a CMS entity. Each concrete page
 * just supplies the entity name, table columns, form fields and the shared Zod
 * schema — all data flow (React Query list/save/remove + drawer/confirm state)
 * lives here so the entity pages stay tiny.
 */
export function ResourcePage<T extends WithId>({
  entity,
  title,
  schema,
  fields,
  columns,
  labelOf,
  newLabel = "New",
}: {
  entity: string;
  title: string;
  schema: ZodLike;
  fields: FieldDef[];
  columns: Column<T>[];
  labelOf: (item: T) => string;
  newLabel?: string;
}) {
  const list = useList<T>(entity);
  const save = useSave<T>(entity);
  const remove = useRemove(entity);

  const [editing, setEditing] = useState<T | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<T | null>(null);

  const closeForm = () => {
    setEditing(null);
    setCreating(false);
    save.reset();
  };

  return (
    <div>
      <div className="page-head">
        <h1>{title}</h1>
        <button className="btn-primary" onClick={() => setCreating(true)}>
          + {newLabel}
        </button>
      </div>

      <ErrorAlert error={list.error} />
      {list.isLoading ? (
        <Spinner />
      ) : (
        <DataTable<T>
          columns={columns}
          rows={list.data ?? []}
          actions={(item) => (
            <>
              <button className="btn-sm" onClick={() => setEditing(item)}>
                Edit
              </button>
              <button className="btn-sm btn-danger" onClick={() => setDeleting(item)}>
                Delete
              </button>
            </>
          )}
        />
      )}

      {(creating || editing) && (
        <Drawer title={editing ? `Edit ${title}` : `New ${title}`} onClose={closeForm}>
          <ResourceForm
            fields={fields}
            schema={schema}
            item={editing ?? undefined}
            submitting={save.isPending}
            submitError={save.error}
            onCancel={closeForm}
            onSubmit={(data) =>
              save.mutate(
                { id: editing?.id, body: data },
                { onSuccess: closeForm },
              )
            }
          />
        </Drawer>
      )}

      {deleting && (
        <ConfirmDelete
          label={labelOf(deleting)}
          busy={remove.isPending}
          error={remove.error}
          onCancel={() => {
            setDeleting(null);
            remove.reset();
          }}
          onConfirm={() =>
            remove.mutate(deleting.id, {
              onSuccess: () => setDeleting(null),
            })
          }
        />
      )}
    </div>
  );
}
