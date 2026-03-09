// components/ui/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    secondary: "bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    ghost: "hover:bg-purple-900/30 text-purple-400 hover:text-purple-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`rounded-lg transition font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}