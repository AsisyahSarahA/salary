
'use client';

import { useState } from "react";

interface Karyawan {
    id: number;
    nik: string;
    nama: string;
    jabatan: string;
    email: string;
    tempat_lahir: string;
    tanggal_lahir: string;
    alamat: string;
    status: "AKTIF" | "NONAKTIF";
}

export default function KaryawanPage() {
    const [data, setData] = useState<Karyawan[]>([
        { id: 1, nik: "EMP001", nama: "Ahmad Fauzi", jabatan: "Manager IT", email: "ahmad.fauzi@company.com", tempat_lahir: "Jakarta", tanggal_lahir: "1990-01-01", alamat: "Jl. Merdeka No. 123", status: "AKTIF" },
        { id: 2, nik: "EMP002", nama: "Siti Aminah", jabatan: "HR Specialist", email: "siti.aminah@company.com", tempat_lahir: "Bandung", tanggal_lahir: "1992-05-15", alamat: "Jl. Diponegoro No. 456", status: "AKTIF" },
    ]);

    const [form, setForm] = useState({
        nik: "",
        nama: "",
        jabatan: "",
        email: "",
        tempat_lahir: "",
        tanggal_lahir: "",
        alamat: "",
        status: "AKTIF",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        setData(prev => [
            ...prev,
            {
                id: prev.length + 1,
                nik: form.nik,
                nama: form.nama,
                email: form.email,
                tempat_lahir: form.tempat_lahir,
                tanggal_lahir: form.tanggal_lahir,
                alamat: form.alamat,
                jabatan: form.jabatan,
                status: form.status as "AKTIF" | "NONAKTIF",
            },
        ]);

        setForm({ nik: "", nama: "", email: "", tempat_lahir: "", tanggal_lahir: "", alamat: "", jabatan: "", status: "AKTIF" });
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-purple-700">
                    Management Karyawan
                </h1>
                <p className="text-sm text-purple-500">
                    Manage employee records and information
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-start items-start">
                {/* FORM */}
                <div className="bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
                        <span className="bg-purple-300 text-purple-700 p-2 rounded-lg">+</span>
                        Tambah Karyawan
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-1">
                                    NIK
                                </label>
                                <input
                                    name="nik"
                                    value={form.nik}
                                    onChange={handleChange}
                                    placeholder="EMP001"
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                    required
                                />
                            </div>

                            <div className="gap-2">
                                <label className="block text-sm font-medium text-purple-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    name="nama"
                                    value={form.nama}
                                    onChange={handleChange}
                                    placeholder="Nama Karyawan"
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="gap-2">
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Email
                            </label>
                            <input
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email Karyawan"
                                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-purple-700 mb-1">
                                    Tempat Lahir
                                </label>
                                <input
                                    name="tempat_lahir"
                                    value={form.tempat_lahir}
                                    onChange={handleChange}
                                    placeholder="Tempat Lahir"
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                    required
                                />
                            </div>

                            <div className="gap-2">
                                <label className="block text-sm font-medium text-purple-700 mb-1">
                                    Tangga Lahir
                                </label>
                                <input
                                    type="date"
                                    name="tanggal_lahir"
                                    value={form.tanggal_lahir}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none "
                                    required
                                />
                            </div>
                        </div>

                        <div className="gap-2">
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Alamat
                            </label>
                            <textarea
                                name="alamat"
                                value={form.alamat}
                                onChange={handleChange}
                                placeholder="Alamat Karyawan"
                                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                                required
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Jabatan
                            </label>
                            <select
                                name="jabatan"
                                value={form.jabatan}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-900"
                                required
                            >
                                <option value="">Pilih Jabatan</option>
                                <option value="Manager IT">Manager IT</option>
                                <option value="HR Specialist">HR Specialist</option>
                                <option value="Staff Finance">Staff Finance</option>
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-purple-700 mb-1">
                                Status Aktif
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
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition"
                        >
                            Simpan
                        </button>
                    </form>
                </div>

                {/* TABLE */}
                <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6 overflow-x-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-purple-700">
                            Data Karyawan
                        </h2>
                        <span className="text-xs bg-purple-300 text-purple-700 px-3 py-1 rounded-full">
                            {data.length} Items Total
                        </span>
                    </div>

                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-purple-500 border-b">
                                <th className="py-3 text-left">NO</th>
                                <th className="py-3 text-left">NAMA</th>
                                <th className="py-3 text-left">JABATAN</th>
                                <th className="py-3 text-left">STATUS</th>
                                <th className="py-3 text-left">AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="border-b hover:bg-purple-400 transition"
                                >
                                    <td className="py-3">{index + 1}</td>
                                    <td className="py-3 font-medium text-purple-700">
                                        {item.nama}
                                    </td>
                                    <td className="py-3">
                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                                            {item.jabatan}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${item.status === "AKTIF"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-red-100 text-red-600"}
                      `}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3 space-x-2">
                                        <button className="text-purple-600 hover:underline">
                                            Edit
                                        </button>
                                        <button className="text-red-500 hover:underline">
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
    );
}