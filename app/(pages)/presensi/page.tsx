"use client";


import { useState } from "react";
import Modal from "@/components/Modal";
import DetailRow from "@/components/DetailRow";

// 📦 Interface untuk tipe data presensi
interface PresensiData {
    id: number;
    nik: string;
    nama: string;
    divisi: string;
    jam_masuk: string | null;
    jam_pulang: string | null;
    status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
    avatar?: string;
}

export default function PresensiPage() {
    // 🎯 State Management
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [selectedDivisi, setSelectedDivisi] = useState("Semua Divisi");


    // 🎯 State untuk modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<PresensiData | null>(null);

    // 🗄️ DUMMY DATA - Bisa diganti nanti dengan data dari API/MySQL
    const [data] = useState<PresensiData[]>([
        {
            id: 1,
            nik: "EMP001",
            nama: "Ahmad Fauzi",
            divisi: "IT",
            jam_masuk: "07:58",
            jam_pulang: "17:02",
            status: "HADIR",
        },
        {
            id: 2,
            nik: "EMP002",
            nama: "Siti Aminah",
            divisi: "HR",
            jam_masuk: "08:15",
            jam_pulang: "17:10",
            status: "HADIR",
        },
        {
            id: 3,
            nik: "EMP003",
            nama: "Budi Santoso",
            divisi: "Finance",
            jam_masuk: null,
            jam_pulang: null,
            status: "IZIN",
        },
        {
            id: 4,
            nik: "EMP004",
            nama: "Rina Wijaya",
            divisi: "Marketing",
            jam_masuk: null,
            jam_pulang: null,
            status: "SAKIT",
        },
        {
            id: 5,
            nik: "EMP005",
            nama: "Dewi Lestari",
            divisi: "IT",
            jam_masuk: "08:30",
            jam_pulang: null,
            status: "HADIR",
        },
        {
            id: 6,
            nik: "EMP006",
            nama: "Eko Prasetyo",
            divisi: "Operational",
            jam_masuk: null,
            jam_pulang: null,
            status: "ALPHA",
        },
    ]);

    // 🔍 Filter Data berdasarkan search & divisi
    const filteredData = data.filter((item) => {
        const matchSearch =
            item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.nik.toLowerCase().includes(searchTerm.toLowerCase());
        const matchDivisi =
            selectedDivisi === "Semua Divisi" || item.divisi === selectedDivisi;
        return matchSearch && matchDivisi;
    });

    // 👁️ Handler: Buka modal detail
    const handleViewDetail = (employee: PresensiData) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    // ❌ Handler: Tutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedEmployee(null), 200);
    };

    // 📊 Hitung Statistik untuk Card Summary
    const statistik = {
        hadir: data.filter((d) => d.status === "HADIR").length,
        izin: data.filter((d) => d.status === "IZIN").length,
        sakit: data.filter((d) => d.status === "SAKIT").length,
        alpha: data.filter((d) => d.status === "ALPHA").length,
        total: data.length,
    };

    // 🎨 Helper: Style badge status
    const getStatusBadge = (status: PresensiData["status"]) => {
        const styles = {
            HADIR: "bg-emerald-100 text-emerald-700 border border-emerald-200",
            IZIN: "bg-amber-100 text-amber-700 border border-amber-200",
            SAKIT: "bg-rose-100 text-rose-700 border border-rose-200",
            ALPHA: "bg-red-100 text-red-700 border border-red-200",
        };
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}
            >
                {status}
            </span>
        );
    };

    // 🔤 Helper: Generate initial avatar
    const getInitial = (nama: string) => nama.charAt(0).toUpperCase();

    // 🖨️ Handler: Export & Print (Frontend Only)
    const handleExportPDF = () => {
        alert("📄 Fitur Export PDF akan diimplementasikan nanti!");
    };

    const handlePrint = () => {
        window.print();
    };

 
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* 🏷️ HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-purple-700">
                        📋 Report Presensi
                    </h1>
                    <p className="text-sm text-purple-500 mt-1">
                        Monitoring kehadiran karyawan secara real-time.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg transition border border-purple-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export PDF
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak
                    </button>
                </div>
            </div>

            {/* 🔍 SEARCH & FILTER */}
            <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Cari nama atau NIK..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-purple-100 placeholder-purple-400"
                        />
                    </div>

                    {/* Date Picker */}
                    <div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-purple-100"
                        />
                    </div>

                    {/* Division Filter */}
                    <select
                        value={selectedDivisi}
                        onChange={(e) => setSelectedDivisi(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-purple-100"
                    >
                        <option value="Semua Divisi">📁 Semua Divisi</option>
                        <option value="IT">💻 IT</option>
                        <option value="HR">👥 HR</option>
                        <option value="Finance">💰 Finance</option>
                        <option value="Marketing">📢 Marketing</option>
                        <option value="Operational">⚙️ Operational</option>
                    </select>
                </div>
            </div>

            

            {/* 📋 DATA TABLE */}
            <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-purple-700">
                        Data Kehadiran - {new Date(selectedDate).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </h2>
                    <span className="text-xs bg-purple-900 text-purple-300 px-3 py-1 rounded-full border border-purple-700">
                        {filteredData.length} Data Ditampilkan
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-purple-400 border-b border-purple-800">
                                <th className="py-3 px-4 text-left font-medium">NO</th>
                                <th className="py-3 px-4 text-left font-medium">KARYAWAN</th>
                                <th className="py-3 px-4 text-left font-medium">DIVISI</th>
                                <th className="py-3 px-4 text-left font-medium">JAM MASUK</th>
                                <th className="py-3 px-4 text-left font-medium">JAM PULANG</th>
                                <th className="py-3 px-4 text-left font-medium">STATUS</th>
                                <th className="py-3 px-4 text-left font-medium">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item, index) => (
                                <tr key={item.id} className="border-b border-purple-900/50 hover:bg-purple-900/20 transition">
                                    <td className="py-4 px-4 text-purple-400 font-medium">{index + 1}</td>
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
                                    <td className="py-4 px-4 text-purple-300 font-mono">
                                        {item.jam_masuk || <span className="text-purple-600">-</span>}
                                    </td>
                                    <td className="py-4 px-4 text-purple-300 font-mono">
                                        {item.jam_pulang || <span className="text-purple-600">-</span>}
                                    </td>
                                    <td className="py-4 px-4">{getStatusBadge(item.status)}</td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => handleViewDetail(item)}
                                            className="p-2 hover:bg-purple-800 rounded-lg transition text-purple-400 hover:text-purple-200"
                                            title="Lihat Detail"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty State */}
                {filteredData.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <p className="text-purple-400">Data tidak ditemukan</p>
                        <p className="text-sm text-purple-600 mt-1">Coba ubah filter pencarian</p>
                    </div>
                )}
            </div>

            {/* 🎪 MODAL DETAIL */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Detail Presensi Karyawan"
                size="md"
            >
                {selectedEmployee && (
                    <div className="space-y-6">
                        {/* 👤 Info Karyawan */}
                        <div className="flex items-center gap-4 p-4 bg-purple-900/30 rounded-xl border border-purple-800">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                {selectedEmployee.nama.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-purple-100">{selectedEmployee.nama}</h3>
                                <p className="text-sm text-purple-400">{selectedEmployee.nik}</p>
                                <span className="inline-block mt-1 px-3 py-1 rounded-lg bg-purple-800/50 text-purple-300 text-xs font-medium border border-purple-700">
                                    {selectedEmployee.divisi}
                                </span>
                            </div>
                        </div>

                        {/* 📊 Detail Presensi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailRow
                                label="📅 Tanggal"
                                value={new Date(selectedDate).toLocaleDateString("id-ID", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric"
                                })}
                            />
                            <DetailRow
                                label="⏰ Jam Masuk"
                                value={
                                    selectedEmployee.jam_masuk ? (
                                        <span className="text-emerald-400 font-mono font-semibold">{selectedEmployee.jam_masuk}</span>
                                    ) : (
                                        <span className="text-purple-600">-</span>
                                    )
                                }
                            />
                            <DetailRow
                                label="⏰ Jam Pulang"
                                value={
                                    selectedEmployee.jam_pulang ? (
                                        <span className="text-emerald-400 font-mono font-semibold">{selectedEmployee.jam_pulang}</span>
                                    ) : (
                                        <span className="text-purple-600">-</span>
                                    )
                                }
                            />
                            <DetailRow
                                label="📌 Status"
                                value={
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedEmployee.status === "HADIR" ? "bg-emerald-100 text-emerald-700" :
                                            selectedEmployee.status === "IZIN" ? "bg-amber-100 text-amber-700" :
                                                selectedEmployee.status === "SAKIT" ? "bg-rose-100 text-rose-700" :
                                                    "bg-red-100 text-red-700"
                                        }`}>
                                        {selectedEmployee.status}
                                    </span>
                                }
                            />
                        </div>

                        {/* 📝 Catatan (Optional) */}
                        <div className="p-4 bg-amber-900/20 border border-amber-800 rounded-lg">
                            <h4 className="text-sm font-semibold text-amber-400 mb-2">📝 Keterangan:</h4>
                            <p className="text-sm text-purple-300">
                                {selectedEmployee.status === "HADIR"
                                    ? "Karyawan hadir tepat waktu."
                                    : selectedEmployee.status === "IZIN"
                                        ? "Karyawan mengajukan izin dengan alasan yang telah disetujui."
                                        : selectedEmployee.status === "SAKIT"
                                            ? "Karyawan sakit dengan surat keterangan dokter."
                                            : "Karyawan tidak hadir tanpa keterangan."}
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}