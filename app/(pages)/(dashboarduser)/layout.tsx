'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SidebarUser from "@/components/SidebarUser";

export default function Layout({ children }: { children: React.ReactNode }) {

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "admin" || user.role === "hrd") {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarUser />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}