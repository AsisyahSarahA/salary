"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import DetailRow from "@/components/DetailRow";

interface GajiData {
  id: number;
  nik: string;
  nama: string;
  jabatan: string;
  gajiPokok: number;
  uangCuti: number;
  potongan: number;
  totalDiterima: number;
}

export default function ProsesGajiPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-03");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<GajiData | null>(null);

  // DUMMY DATA
  const [data] = useState<GajiData[]>([
    {
      id: 1,
      nik: "EMP001",
      nama: "Ahmad Fauzi",
      jabatan: "Manager IT",
      gajiPokok: 15000000,
      uangCuti: 500000,
      potongan: 200000,
      totalDiterima: 15300000,
    },
    {
      id: 2,
      nik: "EMP002",
      nama: "Siti Aminah",
      jabatan: "HR Specialist",
      gajiPokok: 8000000,
      uangCuti: 0,
      potongan: 100000,
      totalDiterima: 7900000,
    },
    {
      id: 3,
      nik: "EMP003",
      nama: "Budi Santoso",
      jabatan: "Frontend Developer",
      gajiPokok: 10000000,
      uangCuti: 200000,
      potongan: 0,
      totalDiterima: 10200000,
    },
    {
      id: 4,
      nik: "EMP004",
      nama: "Rina Wijaya",
      jabatan: "Marketing Staff",
      gajiPokok: 7000000,
      uangCuti: 300000,
      potongan: 150000,
      totalDiterima: 7150000,
    },
  ]);

  // Hitung total
  const totalPengeluaran = data.reduce((acc, item) => acc + item.totalDiterima, 0);
  const totalKaryawan = data.length;

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleProsesGaji = async () => {
    setIsProcessing(true);
    // Simulasi proses
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    alert("Proses gaji berhasil!");
  };

  const handleViewDetail = (employee: GajiData) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedEmployee(null), 200);
  };

  const getInitial = (nama: string) => nama.charAt(0).toUpperCase();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            Proses Gaji Bulanan
          </h1>
          <p className="text-sm text-purple-500 mt-1">
            Generate dan hitung gaji seluruh karyawan dalam satu klik.
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 bg-slate-900 border border-purple-800 rounded-lg text-purple-100 focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <button
            onClick={handleProsesGaji}
            disabled={isProcessing}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium ${
              isProcessing ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Memproses...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Proses Gaji
              </>
            )}
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 shadow-lg">
          <p className="text-xs text-purple-400 font-semibold mb-2">TOTAL PENGELUARAN GAJI</p>
          <p className="text-2xl font-bold text-purple-100">{formatRupiah(totalPengeluaran)}</p>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 shadow-lg">
          <p className="text-xs text-purple-400 font-semibold mb-2">TOTAL KARYAWAN</p>
          <p className="text-2xl font-bold text-purple-100">{totalKaryawan} Orang</p>
        </div>
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6 shadow-lg">
          <p className="text-xs text-purple-400 font-semibold mb-2">STATUS PERIODE</p>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            DRAFT
          </span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 border-b border-purple-800">
                <th className="py-3 px-4 text-left font-medium">KARYAWAN</th>
                <th className="py-3 px-4 text-left font-medium">GAJI POKOK</th>
                <th className="py-3 px-4 text-left font-medium">UANG CUTI</th>
                <th className="py-3 px-4 text-left font-medium">POTONGAN</th>
                <th className="py-3 px-4 text-left font-medium">TOTAL DITERIMA</th>
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
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-bold shadow-lg">
                        {getInitial(item.nama)}
                      </div>
                      <div>
                        <div className="font-semibold text-purple-100">{item.nama}</div>
                        <div className="text-xs text-purple-400">{item.nik} • {item.jabatan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-purple-300">{formatRupiah(item.gajiPokok)}</td>
                  <td className="py-4 px-4 text-emerald-400">+{formatRupiah(item.uangCuti)}</td>
                  <td className="py-4 px-4 text-red-400">-{formatRupiah(item.potongan)}</td>
                  <td className="py-4 px-4 font-semibold text-purple-100">{formatRupiah(item.totalDiterima)}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="p-2 hover:bg-purple-800 rounded-lg transition text-purple-400 hover:text-purple-200"
                      title="Lihat Detail"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      <Modal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        title="Detail Slip Gaji"
        size="md"
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Info Karyawan */}
            <div className="flex items-center gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-800">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {getInitial(selectedEmployee.nama)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-purple-100">{selectedEmployee.nama}</h3>
                <p className="text-sm text-purple-400">{selectedEmployee.nik}</p>
                <p className="text-sm text-purple-300">{selectedEmployee.jabatan}</p>
              </div>
            </div>

            {/* Detail Gaji */}
            <div className="space-y-3">
              <DetailRow label="Gaji Pokok" value={formatRupiah(selectedEmployee.gajiPokok)} />
              <DetailRow 
                label="Uang Cuti" 
                value={<span className="text-emerald-400">+{formatRupiah(selectedEmployee.uangCuti)}</span>} 
              />
              <DetailRow 
                label="Potongan" 
                value={<span className="text-red-400">-{formatRupiah(selectedEmployee.potongan)}</span>} 
              />
              <div className="border-t border-purple-800 pt-3 mt-3">
                <DetailRow 
                  label="Total Diterima" 
                  value={<span className="text-xl font-bold text-purple-100">{formatRupiah(selectedEmployee.totalDiterima)}</span>} 
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 <strong>Info:</strong> Slip gaji ini masih dalam status DRAFT. 
                Klik tombol Proses Gaji untuk finalisasi dan pembayaran.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}