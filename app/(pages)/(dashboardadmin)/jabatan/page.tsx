'use client';

import { useState, useEffect } from "react";

interface Jabatan {
  id: number;
  jabatan: string;
  id_divisi: number;
  gaji_pokok: number;
}

interface Divisi {
  id: number;
  divisi: string;  // ✅ Field sesuai endpoint
}

const JABATAN_API = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/jabatan";
const DIVISI_API = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/divisi";

export default function JabatanPage() {
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);
  const [divisiList, setDivisiList] = useState<Divisi[]>([]);  // ✅ State untuk divisi
  const [form, setForm] = useState({
    jabatan: "",
    id_divisi: "",
    gaji_pokok: ""
  });
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
    if (!token) return;

    try {
      const res = await fetch(DIVISI_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil data divisi");
      
      setDivisiList(data.data || data);
    } catch (err: unknown) {
      if (err instanceof Error) console.error("Fetch Divisi Error:", err.message);
    }
  };

  // ===============================
  // GET DATA JABATAN (FETCH)
  // ===============================
  const fetchJabatan = async () => {
    const token = getToken();
    if (!token) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(JABATAN_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil data jabatan");
      
      setJabatanList(data.data || data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-fetch saat token tersedia
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchDivisi();   // ✅ Fetch divisi dulu (untuk options select)
      fetchJabatan();  // ✅ Fetch jabatan (untuk table)
    }
  }, []);

  // 🎨 Helper: Cari nama divisi berdasarkan ID
  const getDivisiName = (id: number) => {
    const found = divisiList.find(d => d.id === id);
    return found?.divisi || `-`;
  };

  // 📝 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      const url = editingId ? `${JABATAN_API}/${editingId}` : JABATAN_API;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          jabatan: form.jabatan.toUpperCase(),
          id_divisi: Number(form.id_divisi),
          gaji_pokok: Number(form.gaji_pokok),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Gagal ${editingId ? "mengupdate" : "menambah"} data`);

      setForm({ jabatan: "", id_divisi: "", gaji_pokok: "" });
      setEditingId(null);
      fetchJabatan(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Prepare edit: isi form dengan data yang dipilih
  const handleEdit = (item: Jabatan) => {
    setEditingId(item.id);
    setForm({
      jabatan: item.jabatan,
      id_divisi: String(item.id_divisi),
      gaji_pokok: String(item.gaji_pokok)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE: Hapus data jabatan
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data jabatan ini?")) return;
    
    const token = getToken();
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${JABATAN_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus data");

      fetchJabatan(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Format rupiah
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FORM */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-purple-800 p-6">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
            <span className="bg-purple-300 text-purple-700 p-2 rounded-lg">
              {editingId ? "✏️" : "+"}
            </span>
            {editingId ? "Edit Jabatan" : "Tambah Jabatan"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Jabatan Name */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Nama Jabatan
              </label>
              <input
                type="text"
                name="jabatan"
                value={form.jabatan}
                onChange={handleChange}
                placeholder="Contoh: MANAGER IT"
                className="w-full rounded-lg border border-purple-400 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Divisi (Dynamic Options dari API) */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Divisi
              </label>
              <select
                name="id_divisi"
                value={form.id_divisi}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-400 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading || divisiList.length === 0}
              >
                <option value="">Pilih Divisi</option>
                {divisiList.map(div => (
                  <option key={div.id} value={div.id}>
                    {div.divisi}
                  </option>
                ))}
              </select>
              {divisiList.length === 0 && !loading && (
                <p className="text-xs text-purple-400 mt-1">
                  ⚠️ Data divisi belum tersedia
                </p>
              )}
            </div>

            {/* Gaji Pokok */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Gaji Pokok
              </label>
              <input
                type="number"
                name="gaji_pokok"
                value={form.gaji_pokok}
                onChange={handleChange}
                placeholder="3000000"
                min="0"
                className="w-full rounded-lg border border-purple-400 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Buttons */}
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
                    setForm({ jabatan: "", id_divisi: "", gaji_pokok: "" });
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
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl shadow-sm border border-purple-800 p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Jabatan
            </h2>
            <span className="text-xs bg-purple-300 text-purple-700 px-3 py-1 rounded-full">
              {jabatanList.length} Items Total
            </span>
          </div>

          {jabatanList.length === 0 && !loading ? (
            <p className="text-center text-purple-400 py-8">
              📭 Belum ada data jabatan. Silakan tambah data pertama.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-purple-500 border-b border-purple-700">
                  <th className="py-3 text-left">NO</th>
                  <th className="py-3 text-left">JABATAN</th>
                  <th className="py-3 text-left">DIVISI</th>  {/* ✅ Sekarang menampilkan NAMA */}
                  <th className="py-3 text-left">GAJI POKOK</th>
                  <th className="py-3 text-left">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {jabatanList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-purple-800 hover:bg-purple-900/30 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3 font-medium text-purple-300">
                      {item.jabatan}
                    </td>
                    <td className="py-3">
                      {/* ✅ Tampilkan nama divisi, bukan ID */}
                      <span className="bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full text-xs">
                        {getDivisiName(item.id_divisi)}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-green-400">
                      {formatRupiah(item.gaji_pokok)}
                    </td>
                    <td className="py-3 space-x-3">
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