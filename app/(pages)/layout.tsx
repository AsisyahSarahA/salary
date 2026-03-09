'use client'

import Navbar from "@/components/Navbar";
import SidebarAdmin from "@/components/SidebarAdmin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950">

      <SidebarAdmin />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
}