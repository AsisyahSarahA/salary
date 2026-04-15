'use client';

import { useState, useEffect } from "react";

interface Divisi {
  id: number;
  divisi: string;  // ✅ Field sesuai endpoint backend
}

const API_URL = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/divisi";

export default function DivisiPage() {
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);
  const [form, setForm] = useState({ divisi: "" });  // ✅ Field form disesuaikan
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  // 🔑 Ambil token dari localStorage
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  // ===============================
  // GET DATA DIVISI (FETCH)
  // ===============================
  const fetchDivisi = async () => {
    const token = getToken();
    if (!token) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data divisi");
      }

      // Support response: {  [...] } atau langsung [...]
      setDivisiList(data.data || data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  // 🔄 Auto-fetch saat token tersedia
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchDivisi();
    }
  }, []);

  // 📝 Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, divisi: e.target.value }));
  };

  // ➕ CREATE / ✏️ UPDATE: Submit ke API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // ✅ Payload sesuai field endpoint: { divisi: "..." }
        body: JSON.stringify({
          divisi: form.divisi.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Gagal ${editingId ? "mengupdate" : "menambah"} data`);
      }

      // Reset form & refresh data
      setForm({ divisi: "" });
      setEditingId(null);
      fetchDivisi(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Prepare edit: isi form dengan data yang dipilih
  const handleEdit = (item: Divisi) => {
    setEditingId(item.id);
    setForm({ divisi: item.divisi });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE: Hapus data divisi
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus divisi ini?")) return;
    
    const token = getToken();
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus data");
      }

      fetchDivisi(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
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

      {/* Error & Loading States */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          ❌ {error}
        </div>
      )}
      
      {loading && !error && (
        <div className="text-center text-purple-600 py-4">
          ⏳ Memproses...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
            <span className="bg-purple-300 text-purple-700 p-2 rounded-lg">
              {editingId ? "✏️" : "+"}
            </span>
            {editingId ? "Edit Divisi" : "Tambah Divisi"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Nama Divisi
              </label>
              <input
                type="text"
                value={form.divisi}  // ✅ Bind ke field divisi
                onChange={handleChange}
                placeholder="Contoh: INFORMATION TECHNOLOGY"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 rounded-lg transition"
              >
                {loading ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ divisi: "" });
                  }}
                  disabled={loading}
                  className="px-4 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded-lg transition"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Divisi
            </h2>
            <span className="text-xs bg-purple-300 text-purple-700 px-3 py-1 rounded-full">
              {divisiList.length} Items Total
            </span>
          </div>

          {divisiList.length === 0 && !loading ? (
            <p className="text-center text-purple-400 py-8">
              📭 Belum ada data divisi. Silakan tambah data pertama.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-purple-500 border-b border-purple-700">
                  <th className="py-3 text-left">NO</th>
                  <th className="py-3 text-left">DIVISI</th>
                  <th className="py-3 text-right">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {divisiList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-purple-800 hover:bg-purple-900/30 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3 font-medium text-purple-300">
                      {item.divisi}  {/* ✅ Tampilkan field divisi */}
                    </td>
                    <td className="py-3 text-right space-x-3">
                      <button 
                        onClick={() => handleEdit(item)}
                        className="text-blue-400 hover:text-blue-300 hover:underline transition"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="text-red-400 hover:text-red-300 hover:underline transition"
                        disabled={loading}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>  
  );
}