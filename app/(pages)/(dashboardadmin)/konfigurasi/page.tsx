'use client';

import { useState, useEffect } from "react";

interface KonfigurasiTahun {
  id: number;
  tahun: number;
  jatah_cuti_tahunan: number;  // ✅ Field sesuai endpoint backend
  nilai_uang_per_cuti: number; // ✅ Field sesuai endpoint backend
  aktif: boolean;              // ✅ Boolean: true = AKTIF, false = NONAKTIF
}

const API_URL = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/konfigurasi";

// 🎨 Helper: Format boolean ke text status
const formatStatus = (aktif: boolean) => aktif ? "AKTIF" : "NONAKTIF";
const getStatusColor = (aktif: boolean) => aktif 
  ? "bg-green-100 text-green-600" 
  : "bg-red-100 text-red-600";

// 🎨 Helper: Format rupiah
const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export default function KonfigurasiTahunPage() {
  const [data, setData] = useState<KonfigurasiTahun[]>([]);
  const [form, setForm] = useState({
    tahun: new Date().getFullYear(),
    jatah_cuti: 0,        // Frontend: jatah_cuti
    nilai_uang: 0,        // Frontend: nilai_uang
    status: "AKTIF" as "AKTIF" | "NONAKTIF",  // Frontend: status
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
  // GET DATA KONFIGURASI (FETCH)
  // ===============================
  const fetchKonfigurasi = async () => {
    const token = getToken();
    if (!token) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mengambil data konfigurasi");
      }

      setData(data.data || data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Auto-fetch saat token tersedia
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchKonfigurasi();
    }
  }, []);

  // 📝 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ 
      ...prev, 
      [name]: name === "tahun" || name === "jatah_cuti" || name === "nilai_uang" 
        ? Number(value) 
        : value 
    }));
  };

  // ➕ CREATE / ✏️ UPDATE: Submit ke API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    // ⚠️ Validasi: Maksimal 1 data konfigurasi
    if (!editingId && data.length >= 1) {
      alert("Tidak dapat menambah data lagi. Hanya diperbolehkan 1 konfigurasi tahun.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const method = editingId ? "PATCH" : "POST";
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      // ✅ Payload sesuai field endpoint backend (dengan mapping)
      const payload = {
        tahun: form.tahun,
        jatah_cuti_tahunan: form.jatah_cuti,      // ✅ Map: jatah_cuti → jatah_cuti_tahunan
        nilai_uang_per_cuti: form.nilai_uang,      // ✅ Map: nilai_uang → nilai_uang_per_cuti
        aktif: form.status === "AKTIF",            // ✅ Map: status → aktif (boolean)
      };

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || `Gagal ${editingId ? "mengupdate" : "menambah"} data`);
      }

      // Reset form & refresh data
      setForm({ 
        tahun: new Date().getFullYear(), 
        jatah_cuti: 0, 
        nilai_uang: 0, 
        status: "AKTIF" 
      });
      setEditingId(null);
      fetchKonfigurasi(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Prepare edit: isi form dengan data yang dipilih
  const handleEdit = (item: KonfigurasiTahun) => {
    setEditingId(item.id);
    setForm({
      tahun: item.tahun,
      jatah_cuti: item.jatah_cuti_tahunan,    // ✅ Map: jatah_cuti_tahunan → jatah_cuti
      nilai_uang: item.nilai_uang_per_cuti,    // ✅ Map: nilai_uang_per_cuti → nilai_uang
      status: item.aktif ? "AKTIF" : "NONAKTIF", // ✅ Map: aktif → status
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE: Hapus data konfigurasi
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus konfigurasi tahun ini?")) return;
    
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

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || "Gagal menghapus data");
      }

      fetchKonfigurasi(); // Refresh table
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
          Konfigurasi Tahun
        </h1>
        <p className="text-sm text-purple-500">
          Setup annual leave and compensation parameters.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 justify-start items-start">
        {/* FORM */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-4">
            <span className="bg-purple-300 text-purple-700 p-2 rounded-lg">
              {editingId ? "✏️" : "+"}
            </span>
            {editingId ? "Edit Konfigurasi" : "Tambah Konfigurasi"}
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
            {/* Tahun */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Tahun
              </label>
              <input
                type="number"
                name="tahun"
                value={form.tahun}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Jatah Cuti Tahunan */}
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
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
                <span className="absolute right-3 top-2 text-sm text-purple-400">
                  HARI
                </span>
              </div>
            </div>

            {/* Nilai Uang Per Cuti */}
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
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 pl-10 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                disabled={loading}
              >
                <option value="AKTIF">Aktif</option>
                <option value="NONAKTIF">Nonaktif</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 rounded-lg transition font-medium"
              >
                {loading ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ 
                      tahun: new Date().getFullYear(), 
                      jatah_cuti: 0, 
                      nilai_uang: 0, 
                      status: "AKTIF" 
                    });
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
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Konfigurasi
            </h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {data.length} Items Total
            </span>
          </div>

          {data.length === 0 && !loading ? (
            <p className="text-center text-purple-400 py-8">
              📭 Belum ada data konfigurasi. Silakan tambah data pertama.
            </p>
          ) : (
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
                      className="border-b border-purple-50 hover:bg-purple-900/30 transition"
                    >
                      <td className="py-3 text-purple-300">{index + 1}</td>
                      <td className="py-3 font-semibold text-purple-300">
                        {item.tahun}
                      </td>
                      <td className="py-3 text-purple-300">
                        {item.jatah_cuti_tahunan} Hari
                      </td>
                      <td className="py-3 font-semibold text-green-400">
                        {formatRupiah(item.nilai_uang_per_cuti)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${getStatusColor(item.aktif)}
                          `}
                        >
                          {formatStatus(item.aktif)}
                        </span>
                      </td>
                      <td className="py-3 space-x-3">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-blue-400 hover:text-blue-300 hover:underline transition text-sm"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-400 hover:text-red-300 hover:underline transition text-sm"
                          disabled={loading}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}