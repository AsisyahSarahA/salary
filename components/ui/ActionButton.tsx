// components/ui/ActionButton.tsx
import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

interface ActionButtonProps {
  type: "view" | "edit" | "delete";
  onClick?: () => void;
  disabled?: boolean;
}

export default function ActionButton({
  type,
  onClick,
  disabled = false,
}: ActionButtonProps) {
  const config = {
    view: { icon: Eye, color: "text-purple-400 hover:text-purple-200" },
    edit: { icon: Pencil, color: "text-blue-400 hover:text-blue-200" },
    delete: { icon: Trash2, color: "text-red-400 hover:text-red-200" },
  };

  const { icon: Icon, color } = config[type];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-lg transition ${color} ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-800"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}