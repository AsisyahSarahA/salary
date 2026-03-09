"use client";

import { useState } from "react";

interface ReportGajiData {
  id: number;
  bulan: string;
  tahun: number;
  totalKaryawan: number;
  totalGaji: number;
  status: "DRAFT" | "FINAL" | "DIBAYAR";
}

export default function ReportGajiPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const data: ReportGajiData[] = [
    {
      id: 1,
      bulan: "Maret",
      tahun: 2024,
      totalKaryawan: 120,
      totalGaji: 1250000000,
      status: "DIBAYAR",
    },
    {
      id: 2,
      bulan: "Februari",
      tahun: 2024,
      totalKaryawan: 118,
      totalGaji: 1230000000,
      status: "DIBAYAR",
    },
    {
      id: 3,
      bulan: "Januari",
      tahun: 2024,
      totalKaryawan: 115,
      totalGaji: 1200000000,
      status: "DIBAYAR",
    },
  ];

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DRAFT: "bg-amber-100 text-amber-700",
      FINAL: "bg-blue-100 text-blue-700",
      DIBAYAR: "bg-emerald-100 text-emerald-700",
    };
    return styles[status] || "bg-purple-100 text-purple-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">Report Gaji</h1>
        <p className="text-sm text-purple-500 mt-1">
          Riwayat dan laporan penggajian bulanan.
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Cari laporan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900 text-purple-100 placeholder-purple-400"
        />
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 border-b border-purple-800">
                <th className="py-3 px-4 text-left font-medium">PERIODE</th>
                <th className="py-3 px-4 text-left font-medium">TOTAL KARYAWAN</th>
                <th className="py-3 px-4 text-left font-medium">TOTAL GAJI</th>
                <th className="py-3 px-4 text-left font-medium">STATUS</th>
                <th className="py-3 px-4 text-left font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-purple-900/50 hover:bg-purple-900/20 transition"
                >
                  <td className="py-4 px-4">
                    <div className="font-semibold text-purple-100">{item.bulan} {item.tahun}</div>
                  </td>
                  <td className="py-4 px-4 text-purple-300">{item.totalKaryawan} Orang</td>
                  <td className="py-4 px-4 font-semibold text-purple-100">{formatRupiah(item.totalGaji)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-purple-400 hover:text-purple-200 text-sm font-medium">
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}