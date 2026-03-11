"use client";

import Link from "next/link";
import { LayoutDashboard, CalendarCheck, FileText, Wallet } from "lucide-react";

export default function DashboardUser() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-purple-400">
          Welcome back, user!
        </h1>
        <p className="text-purple-300">
          Heres your overview for this month.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
          <p className="text-purple-300 text-sm">Kehadiran Bulan Ini</p>
          <h2 className="text-2xl font-bold text-white">22/24</h2>
        </div>

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
          <p className="text-purple-300 text-sm">Sisa Cuti</p>
          <h2 className="text-2xl font-bold text-white">8 Hari</h2>
        </div>

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
          <p className="text-purple-300 text-sm">Gaji Terakhir</p>
          <h2 className="text-2xl font-bold text-white">Rp 5.5M</h2>
        </div>

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
          <p className="text-purple-300 text-sm">Tugas Pending</p>
          <h2 className="text-2xl font-bold text-white">3</h2>
        </div>

      </div>

      {/* History */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-purple-400 mb-4">
            Your Recent History
          </h2>

          <ul className="space-y-3 text-sm text-gray-300">
            <li>Gaji Bulan Januari Telah Dibayar</li>
            <li>Pengajuan Cuti Disetujui</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-purple-700 rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold text-purple-400 mb-2">
            Pengumuman Kantor
          </h2>

          <p className="text-gray-300">
            Libur nasional jatuh pada tanggal 25 Maret.
          </p>
        </div>

      </div>

    </div>
  );
}