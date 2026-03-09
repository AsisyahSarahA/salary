// app/(pages)/cuti/page.tsx
"use client";

import { useState } from "react";
import Modal from "@/components/Modal";
import DetailRow from "@/components/DetailRow";

interface CutiData {
  id: number;
  nik: string;
  nama: string;
  divisi: string;
  total: number;
  terpakai: number;
  sisa: number;
}

export default function ReportCutiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<CutiData | null>(null);

  // DUMMY DATA
  const [data] = useState<CutiData[]>([
    {
      id: 1,
      nik: "EMP001",
      nama: "Ahmad Fauzi",
      divisi: "IT",
      total: 12,
      terpakai: 4,
      sisa: 8,
    },
    {
      id: 2,
      nik: "EMP002",
      nama: "Siti Aminah",
      divisi: "HR",
      total: 12,
      terpakai: 2,
      sisa: 10,
    },
    {
      id: 3,
      nik: "EMP003",
      nama: "Budi Santoso",
      divisi: "Finance",
      total: 12,
      terpakai: 12,
      sisa: 0,
    },
    {
      id: 4,
      nik: "EMP004",
      nama: "Rina Wijaya",
      divisi: "Marketing",
      total: 15,
      terpakai: 5,
      sisa: 10,
    },
    {
      id: 5,
      nik: "EMP005",
      nama: "Dewi Lestari",
      divisi: "IT",
      total: 12,
      terpakai: 3,
      sisa: 9,
    },
    {
      id: 6,
      nik: "EMP006",
      nama: "Eko Prasetyo",
      divisi: "Operational",
      total: 12,
      terpakai: 7,
      sisa: 5,
    },
  ]);

  // Filter data
  const filteredData = data.filter((item) =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.nik.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total
  const totalSaldo = data.reduce((acc, item) => acc + item.total, 0);
  const totalTerpakai = data.reduce((acc, item) => acc + item.terpakai, 0);

  // Handler
  const handleViewDetail = (employee: CutiData) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEmployee(null), 200);
  };

  const handleDownloadReport = () => {
    alert("Fitur Download Report akan diimplementasikan nanti!");
  };

  const getInitial = (nama: string) => nama.charAt(0).toUpperCase();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">
            Report Saldo Cuti
          </h1>
          <p className="text-sm text-purple-500 mt-1">
            Monitor saldo dan penggunaan cuti seluruh karyawan.
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Report
        </button>
      </div>

      {/* SEARCH & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Cari nama karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900 text-purple-100 placeholder-purple-400"
          />
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-emerald-900/20 border border-emerald-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-emerald-400 font-semibold">TOTAL SALDO</p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{totalSaldo} Hari</p>
            </div>
            <div className="w-12 h-12 bg-emerald-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-red-400 font-semibold">TERPAKAI</p>
              <p className="text-2xl font-bold text-red-400 mt-1">{totalTerpakai} Hari</p>
            </div>
            <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 border-b border-purple-800">
                <th className="py-3 px-4 text-left font-medium">KARYAWAN</th>
                <th className="py-3 px-4 text-left font-medium">DIVISI</th>
                <th className="py-3 px-4 text-left font-medium">TOTAL</th>
                <th className="py-3 px-4 text-left font-medium">TERPAKAI</th>
                <th className="py-3 px-4 text-left font-medium">SISA SALDO</th>
                <th className="py-3 px-4 text-left font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
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
                        <div className="text-xs text-purple-400">{item.nik}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-block px-3 py-1 rounded-lg bg-purple-800/50 text-purple-300 text-xs font-medium border border-purple-700">
                      {item.divisi}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-purple-300 font-semibold">{item.total}</td>
                  <td className="py-4 px-4 text-red-400 font-semibold">{item.terpakai}</td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${item.sisa <= 2 ? "text-red-400" : "text-emerald-400"}`}>
                      {item.sisa}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewDetail(item)}
                      className="p-2 hover:bg-purple-800 rounded-lg transition text-purple-400 hover:text-purple-200"
                      title="Lihat Detail"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-purple-400">Data tidak ditemukan</p>
            <p className="text-sm text-purple-600 mt-1">Coba ubah filter pencarian</p>
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Detail Saldo Cuti Karyawan"
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
                <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-purple-800/50 text-purple-300 text-xs font-medium border border-purple-700">
                  {selectedEmployee.divisi}
                </span>
              </div>
            </div>

            {/* Detail Cuti */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Total Jatah Cuti" value={`${selectedEmployee.total} Hari`} />
              <DetailRow 
                label="Cuti Terpakai" 
                value={<span className="text-red-400 font-semibold">{selectedEmployee.terpakai} Hari</span>} 
              />
              <DetailRow 
                label="Sisa Saldo" 
                value={<span className={`font-semibold ${selectedEmployee.sisa <= 2 ? "text-red-400" : "text-emerald-400"}`}>{selectedEmployee.sisa} Hari</span>} 
              />
              <DetailRow label="Tahun" value="2026" />
            </div>

            {/* Progress Bar */}
            <div className="p-4 bg-slate-800 rounded-lg border border-purple-800">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-purple-300">Penggunaan Cuti</span>
                <span className="text-purple-400 font-semibold">
                  {Math.round((selectedEmployee.terpakai / selectedEmployee.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedEmployee.terpakai / selectedEmployee.total >= 0.8
                      ? "bg-red-500"
                      : selectedEmployee.terpakai / selectedEmployee.total >= 0.5
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                  }`}
                  style={{ width: `${(selectedEmployee.terpakai / selectedEmployee.total) * 100}%` }}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
              <p className="text-sm text-amber-300">
                💡 <strong>Info:</strong> Sisa cuti yang tidak digunakan akan hangus pada akhir tahun. 
                Pastikan karyawan menggunakan hak cutinya dengan bijak.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}