import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { api } from "./api";

/**
 * Generic REST CRUD client for the CMS admin entities. Every `/api/admin/<entity>`
 * route follows the same shape (list -> { items }, single -> { item },
 * delete -> { ok }), so one factory removes a pile of near-identical fetch code.
 */
export type WithId = { id: number };

export function crud<T extends WithId, TInput = Record<string, unknown>>(entity: string) {
  const base = `/admin/${entity}`;
  return {
    entity,
    list: () => api<{ items: T[] }>(base).then((r) => r.items),
    get: (id: number) => api<{ item: T }>(`${base}/${id}`).then((r) => r.item),
    create: (body: TInput) =>
      api<{ item: T }>(base, { method: "POST", body: JSON.stringify(body) }).then((r) => r.item),
    update: (id: number, body: Partial<TInput>) =>
      api<{ item: T }>(`${base}/${id}`, { method: "PATCH", body: JSON.stringify(body) }).then(
        (r) => r.item,
      ),
    remove: (id: number) => api<{ ok: true }>(`${base}/${id}`, { method: "DELETE" }),
  };
}

/** React Query: list an entity. */
export function useList<T extends WithId>(entity: string): UseQueryResult<T[]> {
  return useQuery({ queryKey: [entity], queryFn: () => crud<T>(entity).list() });
}

/** React Query: create-or-update mutation, invalidates the list on success. */
export function useSave<T extends WithId, TInput = Record<string, unknown>>(entity: string) {
  const qc = useQueryClient();
  const c = crud<T, TInput>(entity);
  return useMutation({
    mutationFn: (vars: { id?: number; body: TInput }) =>
      vars.id ? c.update(vars.id, vars.body) : c.create(vars.body),
    onSuccess: () => qc.invalidateQueries({ queryKey: [entity] }),
  });
}

/** React Query: delete mutation, invalidates the list on success. */
export function useRemove(entity: string) {
  const qc = useQueryClient();
  const c = crud(entity);
  return useMutation({
    mutationFn: (id: number) => c.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [entity] }),
  });
}
