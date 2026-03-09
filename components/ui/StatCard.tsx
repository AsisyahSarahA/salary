// components/ui/StatCard.tsx
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "purple" | "emerald" | "amber" | "rose" | "blue";
}

export default function StatCard({
  title,
  value,
  icon,
  color = "purple",
}: StatCardProps) {
  const colors = {
    purple: "bg-purple-900/50 border-purple-700 text-purple-300",
    emerald: "bg-emerald-900/50 border-emerald-700 text-emerald-300",
    amber: "bg-amber-900/50 border-amber-700 text-amber-300",
    rose: "bg-rose-900/50 border-rose-700 text-rose-300",
    blue: "bg-blue-900/50 border-blue-700 text-blue-300",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${colors[color]} flex items-center justify-between`}
    >
      <div>
        <p className="text-xs opacity-80">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-2xl">{icon}</div>}
    </div>
  );
}