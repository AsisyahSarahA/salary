"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CutiHistory {
  id: number;
  jenis: "Tahunan" | "Sakit" | "KHUSUS";
  tanggal: string;
  durasi: string;
  alasan: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

export default function RiwayatCutiPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<"Semua" | "Pending" | "Approved" | "Rejected">("Semua");

  const [cutiHistory] = useState<CutiHistory[]>([
    { id: 1, jenis: "Tahunan", tanggal: "15 Feb - 17 Feb 2024", durasi: "3 Hari", alasan: "Acara Keluarga", status: "APPROVED" },
    { id: 2, jenis: "Sakit", tanggal: "10 Jan - 11 Jan 2024", durasi: "1 Hari", alasan: "Flu & Demam", status: "APPROVED" },
    { id: 3, jenis: "Tahunan", tanggal: "10 Mar - 12 Mar 2024", durasi: "3 Hari", alasan: "Liburan Akhir Pekan", status: "PENDING" },
  ]);

  // Cek role USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== "USER") {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  const filteredHistory = filter === "Semua" 
    ? cutiHistory 
    : cutiHistory.filter(h => h.status === filter.toUpperCase());

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: "bg-emerald-100 text-emerald-700",
      PENDING: "bg-amber-100 text-amber-700",
      REJECTED: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-purple-100 text-purple-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">Data & Saldo Cuti</h1>
        <p className="text-sm text-purple-500 mt-1">Informasi kuota dan riwayat pengajuan cuti Anda.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-400 font-semibold mb-1">TOTAL CUTI</p>
            <p className="text-3xl font-bold text-purple-100">12 <span className="text-sm font-normal text-purple-400">Hari / Tahun</span></p>
          </div>
          <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-400 font-semibold mb-1">CUTI DIAMBIL</p>
            <p className="text-3xl font-bold text-purple-100">4 <span className="text-sm font-normal text-purple-400">Hari</span></p>
          </div>
          <div className="w-12 h-12 bg-rose-900/50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📋</span>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-400 font-semibold mb-1">SISA CUTI</p>
            <p className="text-3xl font-bold text-emerald-400">8 <span className="text-sm font-normal text-purple-400">Hari Tersisa</span></p>
          </div>
          <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
        </div>
      </div>

      {/* Riwayat Pengajuan */}
      <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-700">Riwayat Pengajuan</h2>
          
          {/* Filter Tabs */}
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
            {["Semua", "Pending", "Approved", "Rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  filter === f
                    ? "bg-purple-600 text-white"
                    : "text-purple-300 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 border-b border-purple-800">
                <th className="py-3 text-left font-medium">JENIS CUTI</th>
                <th className="py-3 text-left font-medium">TANGGAL</th>
                <th className="py-3 text-left font-medium">DURASI</th>
                <th className="py-3 text-left font-medium">ALASAN</th>
                <th className="py-3 text-left font-medium">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item) => (
                <tr key={item.id} className="border-b border-purple-900/50">
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-lg bg-purple-800/50 text-purple-300 text-xs border border-purple-700">
                      {item.jenis}
                    </span>
                  </td>
                  <td className="py-4 text-purple-100 font-medium">{item.tanggal}</td>
                  <td className="py-4 text-purple-300">{item.durasi}</td>
                  <td className="py-4 text-purple-400 text-xs">{item.alasan}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12 text-purple-400">
            <p>Tidak ada data pengajuan cuti</p>
          </div>
        )}
      </div>
    </div>
  );
}