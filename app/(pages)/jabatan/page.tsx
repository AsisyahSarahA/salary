'use client';

import { useState } from "react";

interface Jabatan {
  id: number;
  name: string;
  divisi: string;
  salary: number;
}

export default function JabatanPage() {
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([
    { id: 1, name: "MANAGER IT", divisi: "INFORMATION TECHNOLOGY", salary: 3000000 },
    { id: 2, name: "HR SPECIALIST", divisi: "HRD", salary: 5000000 },
  ]);

  const [form, setForm] = useState({
    name: "",
    divisi: "",
    salary: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: Jabatan = {
      id: jabatanList.length + 1,
      name: form.name.toUpperCase(),
      divisi: form.divisi,
      salary: Number(form.salary),
    };

    setJabatanList(prev => [...prev, newItem]);
    setForm({ name: "", divisi: "", salary: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">
          Management Jabatan
        </h1>
        <p className="text-sm text-purple-500">
          Manage job positions and salary structure
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
            <span className="bg-purple-100 text-purple-700 p-2 rounded-lg">+</span>
            Tambah Jabatan
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Nama Jabatan
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Contoh: Manager IT"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Divisi
              </label>
              <select
                name="divisi"
                value={form.divisi}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              >
                <option value="">Pilih Divisi</option>
                <option value="INFORMATION TECHNOLOGY">Information Technology</option>
                <option value="HRD">HRD</option>
                <option value="FINANCE">Finance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Gaji Pokok
              </label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                placeholder="3000000"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
                required
              />
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
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-purple-100 p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Jabatan
            </h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {jabatanList.length} Items Total
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-500 border-b">
                <th className="py-3 text-left">NO</th>
                <th className="py-3 text-left">JABATAN</th>
                <th className="py-3 text-left">DIVISI</th>
                <th className="py-3 text-left">GAJI</th>
                <th className="py-3 text-left">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {jabatanList.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 font-medium text-purple-700">
                    {item.name}
                  </td>
                  <td className="py-3">
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs">
                      {item.divisi}
                    </span>
                  </td>
                  <td className="py-3 font-semibold text-green-600">
                    Rp {item.salary.toLocaleString("id-ID")}
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