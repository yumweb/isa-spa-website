import type { ReactNode } from "react";

export type Column<T> = {
  header: string;
  render: (item: T) => ReactNode;
  width?: number | string;
};

export function DataTable<T extends { id: number }>({
  columns,
  rows,
  actions,
  emptyText = "Nothing here yet.",
}: {
  columns: Column<T>[];
  rows: T[];
  actions?: (item: T) => ReactNode;
  emptyText?: string;
}) {
  if (!rows.length) return <div className="panel empty">{emptyText}</div>;
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={c.width ? { width: c.width } : undefined}>
                {c.header}
              </th>
            ))}
            {actions && <th style={{ width: 1, textAlign: "right" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c, i) => (
                <td key={i}>{c.render(row)}</td>
              ))}
              {actions && (
                <td>
                  <div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
