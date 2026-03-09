"use client";

import { useState } from "react";

interface KonfigurasiTahun {
    id: number;
    tahun: number;
    jatah_cuti: number;
    nilai_uang: number;
    status: "AKTIF" | "NONAKTIF";
}

export default function KonfigurasiTahunPage() {
    const [data, setData] = useState<KonfigurasiTahun[]>([
        { id: 1, tahun: 2024, jatah_cuti: 12, nilai_uang: 150000, status: "AKTIF" },
    ]);

    const [form, setForm] = useState({
        tahun: new Date().getFullYear(),
        jatah_cuti: 0,
        nilai_uang: 0,
        status: "AKTIF" as "AKTIF" | "NONAKTIF",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ 
            ...prev, 
            [name]: name === "tahun" || name === "jatah_cuti" || name === "nilai_uang" ? Number(value) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Cek apakah sudah ada data
        if (data.length >= 1) {
            alert("Tidak dapat menambah data lagi. Hanya diperbolehkan 1 konfigurasi tahun.");
            return;
        }

        setData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                tahun: form.tahun,
                jatah_cuti: form.jatah_cuti,
                nilai_uang: form.nilai_uang,
                status: form.status,
            },
        ]);

        setForm({ 
            tahun: new Date().getFullYear(), 
            jatah_cuti: 0, 
            nilai_uang: 0, 
            status: "AKTIF" 
        });
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(angka);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-purple-700">
                    Konfigurasi Tahun
                </h1>
                <p className="text-sm text-purple-500">
                    Setup annual leave and compensation parameters.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-start items-start">
                {/* FORM */}
                <div className="bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
                        <span className="bg-purple-300 text-purple-700 p-2 rounded-lg">+</span>
                        Tambah Konfigurasi
                    </h2>

                    {/* Info Box */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                        <div className="flex gap-2">
                            <span className="text-amber-600 text-lg">ℹ️</span>
                            <p className="text-sm text-amber-800">
                                Jika sudah terdapat satu data maka tidak dapat menambah data lagi.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1 ">
                                Tahun
                            </label>
                            <input
                                type="number"
                                name="tahun"
                                value={form.tahun}
                                onChange={handleChange}
                               
                                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Jatah Cuti Tahunan
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="jatah_cuti"
                                    value={form.jatah_cuti}
                                    onChange={handleChange}
                                    
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                    required
                                />
                                <span className="absolute right-3 top-2 text-sm text-purple-400">
                                    HARI
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Nilai Uang Per Cuti
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-purple-400">
                                    Rp
                                </span>
                                <input
                                    type="number"
                                    name="nilai_uang"
                                    value={form.nilai_uang}
                                    onChange={handleChange}
                                    
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 pl-10 focus:ring-2 focus:ring-purple-400 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Status
                            </label>
                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900"
                            >
                                <option value="AKTIF">Aktif</option>
                                <option value="NONAKTIF">Nonaktif</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition font-medium"
                        >
                            Simpan
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6 ">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-purple-700">
                            Data Konfigurasi
                        </h2>
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {data.length} Items Total
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-purple-500 border-b border-purple-100">
                                    <th className="py-3 text-left font-medium">NO</th>
                                    <th className="py-3 text-left font-medium">TAHUN</th>
                                    <th className="py-3 text-left font-medium">JATAH CUTI</th>
                                    <th className="py-3 text-left font-medium">NILAI UANG</th>
                                    <th className="py-3 text-left font-medium">STATUS</th>
                                    <th className="py-3 text-left font-medium">AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-b border-purple-50 hover:bg-purple-400 transition"
                                    >
                                        <td className="py-3 text-purple-600">{index + 1}</td>
                                        <td className="py-3 font-semibold text-purple-700">
                                            {item.tahun}
                                        </td>
                                        <td className="py-3">
                                            {item.jatah_cuti} Hari
                                        </td>
                                        <td className="py-3 font-semibold text-purple-600">
                                            {formatRupiah(item.nilai_uang)}
                                        </td>
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold
                                                    ${item.status === "AKTIF"
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }
                                                `}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 space-x-2">
                                            <button className="text-purple-600 hover:underline text-sm">
                                                Edit
                                            </button>
                                            <button className="text-red-500 hover:underline text-sm">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}