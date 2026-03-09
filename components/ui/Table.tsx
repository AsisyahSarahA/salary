// components/ui/Table.tsx
import React from "react";
import ActionButton from "./ActionButton"; // ✅ Tambahkan ini!

interface TableProps {
  columns: Array<{
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  data: any[];
  onAction?: (type: "view" | "edit" | "delete", row: any) => void;
}

export default function Table({ columns, data, onAction }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-purple-400 border-b border-purple-800">
            <th className="py-3 px-4 text-left font-medium">NO</th>
            {columns.map((col) => (
              <th key={col.key} className="py-3 px-4 text-left font-medium">
                {col.label}
              </th>
            ))}
            {onAction && (
              <th className="py-3 px-4 text-left font-medium">AKSI</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="border-b border-purple-900/50 hover:bg-purple-900/20 transition"
            >
              <td className="py-4 px-4 text-purple-400 font-medium">
                {index + 1}
              </td>
              {columns.map((col) => (
                <td key={col.key} className="py-4 px-4">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {onAction && (
                <td className="py-4 px-4">
                  <div className="flex gap-1">
                    <ActionButton
                      type="view"
                      onClick={() => onAction?.("view", row)}
                    />
                    <ActionButton
                      type="edit"
                      onClick={() => onAction?.("edit", row)}
                    />
                    <ActionButton
                      type="delete"
                      onClick={() => onAction?.("delete", row)}
                    />
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