'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SidebarAdmin from "@/components/SidebarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "admin" && user.role !== "hrd") {
      router.push("/dashboarduser");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <SidebarAdmin />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6 text-purple-200 dark:text-purple-200">
          {children}
        </main>
      </div>
    </div>
  );
}