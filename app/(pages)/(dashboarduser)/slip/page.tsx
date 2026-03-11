"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import DetailRow from "@/components/DetailRow";

interface SlipGaji {
  id: number;
  periode: string;
  bulan: string;
  tahun: number;
  gajiPokok: number;
  tunjangan: number;
  potongan: number;
  totalGaji: number;
  tanggalBayar: string;
  status: "PAID" | "PENDING";
}

export default function SlipGajiPage() {
  const router = useRouter();
  const [selectedSlip, setSelectedSlip] = useState<SlipGaji | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [slipHistory] = useState<SlipGaji[]>([
    {
      id: 1,
      periode: "Maret 2024",
      bulan: "Maret",
      tahun: 2024,
      gajiPokok: 15000000,
      tunjangan: 500000,
      potongan: 200000,
      totalGaji: 15300000,
      tanggalBayar: "2024-03-25",
      status: "PAID",
    },
    {
      id: 2,
      periode: "Februari 2024",
      bulan: "Februari",
      tahun: 2024,
      gajiPokok: 15000000,
      tunjangan: 0,
      potongan: 200000,
      totalGaji: 14800000,
      tanggalBayar: "2024-02-25",
      status: "PAID",
    },
    {
      id: 3,
      periode: "Januari 2024",
      bulan: "Januari",
      tahun: 2024,
      gajiPokok: 15000000,
      tunjangan: 350000,
      potongan: 200000,
      totalGaji: 15150000,
      tanggalBayar: "2024-01-25",
      status: "PAID",
    },
  ]);

  // Cek role USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role?.toLowerCase() !== "user") {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const handleViewDetail = (slip: SlipGaji) => {
    setSelectedSlip(slip);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => setSelectedSlip(null), 200);
  };

  const handleDownload = (slip: SlipGaji) => {
    alert(`Downloading slip gaji ${slip.periode}...`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">Riwayat Slip Gaji</h1>
        <p className="text-sm text-purple-500 mt-1">Unduh slip gaji bulanan Anda dengan mudah.</p>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-400 border-b border-purple-800">
                <th className="py-3 text-left font-medium">PERIODE</th>
                <th className="py-3 text-left font-medium">TOTAL GAJI NETTO</th>
                <th className="py-3 text-left font-medium">TANGGAL PEMBAYARAN</th>
                <th className="py-3 text-left font-medium">STATUS</th>
                <th className="py-3 text-left font-medium">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {slipHistory.map((slip) => (
                <tr key={slip.id} className="border-b border-purple-900/50 hover:bg-purple-900/20 transition">
                  <td className="py-4 font-semibold text-purple-100">{slip.periode}</td>
                  <td className="py-4 font-bold text-blue-400">{formatRupiah(slip.totalGaji)}</td>
                  <td className="py-4 text-purple-300">
                    {new Date(slip.tanggalBayar).toLocaleDateString("id-ID")}
                  </td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {slip.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(slip)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-purple-400"
                        title="Lihat Detail"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownload(slip)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition text-purple-400"
                        title="Download"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title="Detail Slip Gaji"
        size="md"
      >
        {selectedSlip && (
          <div className="space-y-6">
            <div className="text-center p-4 bg-purple-900/30 rounded-xl border border-purple-800">
              <h3 className="text-xl font-bold text-purple-100">{selectedSlip.periode}</h3>
              <p className="text-sm text-purple-400">PT. Salary Application</p>
            </div>

            <div className="space-y-3">
              <DetailRow label="Gaji Pokok" value={formatRupiah(selectedSlip.gajiPokok)} />
              <DetailRow 
                label="Tunjangan" 
                value={<span className="text-emerald-400">+{formatRupiah(selectedSlip.tunjangan)}</span>} 
              />
              <DetailRow 
                label="Potongan" 
                value={<span className="text-red-400">-{formatRupiah(selectedSlip.potongan)}</span>} 
              />
              <div className="border-t border-purple-800 pt-3 mt-3">
                <DetailRow 
                  label="Total Gaji Netto" 
                  value={<span className="text-xl font-bold text-purple-100">{formatRupiah(selectedSlip.totalGaji)}</span>} 
                />
              </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 <strong>Info:</strong> Slip gaji ini telah dibayarkan pada tanggal {new Date(selectedSlip.tanggalBayar).toLocaleDateString("id-ID")}
              </p>
            </div>

            <button
              onClick={() => handleDownload(selectedSlip)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Slip Gaji (PDF)
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}