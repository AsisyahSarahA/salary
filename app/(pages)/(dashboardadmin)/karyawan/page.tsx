'use client';

import { useState, useEffect } from "react";

interface Karyawan {
  id: number;
  nik: string;
  nama: string;
  email: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  alamat: string;
  id_jabatan: number;     // Foreign key ke tabel jabatan
  status_aktif: boolean;
}

interface Jabatan {
  id: number;
  jabatan: string;  // ✅ Field sesuai endpoint
  id_divisi: number;
  gaji_pokok: number;
}

const KARYAWAN_API = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan";
const JABATAN_API = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/jabatan";

// 🎨 Helper: Format status boolean ke text
const formatStatus = (aktif: boolean) => aktif ? "AKTIF" : "NONAKTIF";
const getStatusColor = (aktif: boolean) => aktif
  ? "bg-green-100 text-green-600"
  : "bg-red-100 text-red-600";

export default function KaryawanPage() {
  const [karyawanList, setKaryawanList] = useState<Karyawan[]>([]);
  const [jabatanList, setJabatanList] = useState<Jabatan[]>([]);  // ✅ State untuk jabatan
  const [form, setForm] = useState({
    nik: "",
    nama: "",
    email: "",
    tempat_lahir: "",
    tanggal_lahir: "",
    alamat: "",
    id_jabatan: "",
    status_aktif: "true",
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
  // GET DATA JABATAN (FETCH)
  // ===============================
  const fetchJabatan = async () => {
    const token = getToken();
    if (!token) return;

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
      if (err instanceof Error) console.error("Fetch Jabatan Error:", err.message);
    }
  };

  // ===============================
  // GET DATA KARYAWAN (FETCH)
  // ===============================
  const fetchKaryawan = async () => {
    const token = getToken();
    if (!token) {
      setError("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(KARYAWAN_API, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengambil data karyawan");

      setKaryawanList(data.data || data);
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
      fetchJabatan();    // ✅ Fetch jabatan dulu (untuk options select)
      fetchKaryawan();   // ✅ Fetch karyawan (untuk table)
    }
  }, []);

  // 🎨 Helper: Cari nama jabatan berdasarkan ID
  const getJabatanName = (id: number) => {
    const found = jabatanList.find(j => j.id === id);
    return found?.jabatan || `-`;
  };

  // 📝 Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
      const url = editingId ? `${KARYAWAN_API}/${editingId}` : KARYAWAN_API;

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          nik: form.nik,
          nama: form.nama,
          email: form.email,
          tempat_lahir: form.tempat_lahir,
          tanggal_lahir: form.tanggal_lahir,
          alamat: form.alamat,
          id_jabatan: Number(form.id_jabatan),
          status_aktif: form.status_aktif === "true",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Gagal ${editingId ? "mengupdate" : "menambah"} data`);

      setForm({
        nik: "", nama: "", email: "", tempat_lahir: "",
        tanggal_lahir: "", alamat: "", id_jabatan: "", status_aktif: "true"
      });
      setEditingId(null);
      fetchKaryawan(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Prepare edit: isi form dengan data yang dipilih
  const handleEdit = (item: Karyawan) => {
    setEditingId(item.id);
    setForm({
      nik: item.nik,
      nama: item.nama,
      email: item.email,
      tempat_lahir: item.tempat_lahir,
      tanggal_lahir: item.tanggal_lahir,
      alamat: item.alamat,
      id_jabatan: String(item.id_jabatan),
      status_aktif: String(item.status_aktif),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE: Hapus data karyawan
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data karyawan ini?")) return;

    const token = getToken();
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${KARYAWAN_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus data");

      fetchKaryawan(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
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
            {editingId ? "Edit Karyawan" : "Tambah Karyawan"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  NIK
                </label>
                <input
                  name="nik"
                  value={form.nik}
                  onChange={handleChange}
                  placeholder="EMP001"
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
              </div>

              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama Karyawan"
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Karyawan"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Tempat Lahir */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Tempat Lahir
                </label>
                <input
                  name="tempat_lahir"
                  value={form.tempat_lahir}
                  onChange={handleChange}
                  placeholder="Tempat Lahir"
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-1">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal_lahir"
                  value={form.tanggal_lahir}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={form.alamat}
                onChange={handleChange}
                placeholder="Alamat Karyawan"
                rows={3}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Jabatan (Dynamic Options dari API) */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Jabatan
              </label>
              <select
                name="id_jabatan"
                value={form.id_jabatan}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading || jabatanList.length === 0}
              >
                <option value="">Pilih Jabatan</option>
                {jabatanList.map(jbt => (
                  <option key={jbt.id} value={jbt.id}>
                    {jbt.jabatan}
                  </option>
                ))}
              </select>
              {jabatanList.length === 0 && !loading && (
                <p className="text-xs text-purple-400 mt-1">
                  ⚠️ Data jabatan belum tersedia
                </p>
              )}
            </div>

            {/* Status Aktif (boolean) */}
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-1">
                Status Aktif
              </label>
              <select
                name="status_aktif"
                value={form.status_aktif}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none bg-slate-800 text-white"
                disabled={loading}
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
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
                    setForm({
                      nik: "", nama: "", email: "", tempat_lahir: "",
                      tanggal_lahir: "", alamat: "", id_jabatan: "", status_aktif: "true"
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
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-purple-800 shadow-sm p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-purple-700">
              Data Karyawan
            </h2>
            <span className="text-xs bg-purple-300 text-purple-700 px-3 py-1 rounded-full">
              {karyawanList.length} Items Total
            </span>
          </div>

          {karyawanList.length === 0 && !loading ? (
            <p className="text-center text-purple-400 py-8">
              📭 Belum ada data karyawan. Silakan tambah data pertama.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-purple-500 border-b border-purple-700">
                  <th className="py-3 text-left">NO</th>
                  <th className="py-3 text-left">NAMA</th>
                  <th className="py-3 text-left">JABATAN</th> 
                  <th className="py-3 text-left">STATUS</th>
                  <th className="py-3 text-left">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {karyawanList.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-purple-800 hover:bg-purple-900/30 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3 font-medium text-purple-300">
                      {item.nama}
                    </td>
                    <td className="py-3">
                      {/* ✅ Tampilkan nama jabatan, bukan ID */}
                      <span className="bg-purple-800/50 text-purple-300 px-3 py-1 rounded-full text-xs">
                        {getJabatanName(item.id_jabatan)}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(item.status_aktif)}`}
                      >
                        {formatStatus(item.status_aktif)}
                      </span>
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