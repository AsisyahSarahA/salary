'use client';

import { useState } from "react";

interface Divisi {
  id: number;
  name: string;
}

export default function DivisiPage() {
  const [divisiList, setDivisiList] = useState<Divisi[]>([
    { id: 1, name: "STAFF" },
    { id: 2, name: "HEAD OF" },
  ]);

  const [form, setForm] = useState({ name: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: Divisi = {
      id: divisiList.length + 1,
      name: form.name.toUpperCase(),
    };

    setDivisiList(prev => [...prev, newItem]);
    setForm({ name: "" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-700">
          Management Divisi
        </h1>
        <p className="text-sm text-purple-500">
          Manage company divisions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
            <span className="bg-purple-100 text-purple-700 p-2 rounded-lg">+</span>
            Tambah Divisi
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Nama Divisi
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm(prev => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contoh: Information Technology"
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-purple-100 shadow-sm p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Divisi
            </h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {divisiList.length} Items Total
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-purple-500 border-b">
                <th className="py-3 text-left">NO</th>
                <th className="py-3 text-left">DIVISI</th>
                <th className="py-3 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody>
              {divisiList.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b hover:bg-purple-50 transition"
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 font-medium text-purple-700">
                    {item.name}
                  </td>
                  <td className="py-3 text-right space-x-3">
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