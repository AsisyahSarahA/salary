// components/Modal.tsx
"use client";

import { useEffect } from "react";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  // 🔒 Lock body scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // ⌨️ Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 📏 Size variants
  const sizes = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
  };

  return (
    <>
      {/* 🌑 Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* 📦 Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-slate-900 rounded-2xl border border-purple-800 shadow-2xl w-full ${sizes[size]} transform transition-all animate-modal-in`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-purple-800">
            <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2">
              <span className="bg-purple-900/50 p-2 rounded-lg">📄</span>
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-purple-400 hover:text-purple-200 hover:bg-purple-800 p-2 rounded-lg transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path   strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6">{children}</div>

          {/* Footer (Optional) */}
          <div className="flex justify-end gap-3 p-6 border-t border-purple-800">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition border border-purple-800"
            >
              Tutup
            </button>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition font-medium">
              Cetak
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modal-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-in {
          animation: modal-in 0.2s ease-out;
        }
      `}</style>
    </>
  );
}