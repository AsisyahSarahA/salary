// components/ui/Input.tsx
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  icon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-purple-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`w-full rounded-lg border border-purple-200 px-3 py-2 ${
            icon ? "pl-10" : ""
          } focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900 text-purple-100 placeholder-purple-400 ${
            error ? "border-red-500" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}