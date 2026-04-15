'use client';

import { useState, useEffect } from "react";

type Role = "ADMIN" | "USER";

interface User {
  id: number;
  name: string;      // ✅ Field sesuai endpoint backend
  email: string;
  role: Role;
}

const API_URL = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/master-user";

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    nama: "",        // Frontend: 'nama' untuk UX Bahasa Indonesia
    email: "",
    password: "",
    role: "USER" as Role,
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
  // GET DATA USER (FETCH)
  // ===============================
  const fetchUsers = async () => {
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
        throw new Error(data.message || "Gagal mengambil data user");
      }

      setUsers(data.data || data);
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
      fetchUsers();
    }
  }, []);

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
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      // ✅ Payload sesuai field endpoint backend
      const payload: Record<string, any> = {
        name: form.nama,           // ✅ Map: nama → name
        email: form.email,
        role: form.role,
      };

      // ✅ Password hanya dikirim saat CREATE atau jika diisi saat EDIT
      if (!editingId || (editingId && form.password.trim() !== "")) {
        payload.password = form.password;
        // 🔐 Backend akan handle hashing password
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Gagal ${editingId ? "mengupdate" : "menambah"} data`);
      }

      // Reset form & refresh data
      setForm({ nama: "", email: "", password: "", role: "USER" });
      setEditingId(null);
      fetchUsers(); // Refresh table
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Prepare edit: isi form dengan data yang dipilih
  const handleEdit = (item: User) => {
    setEditingId(item.id);
    setForm({
      nama: item.name,    // ✅ Map: name → nama
      email: item.email,
      password: "",       // Password tidak ditampilkan saat edit (security)
      role: item.role,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🗑️ DELETE: Hapus data user
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini?")) return;
    
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

      fetchUsers(); // Refresh table
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
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-purple-500">
          Management User
        </h1>
        <p className="text-sm text-purple-500">
          Control system access and user permissions.
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
          <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2 mb-6">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 text-xl">
              {editingId ? "✏️" : "+"}
            </span>
            {editingId ? "Edit User" : "Tambah User"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-purple-500">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800 text-white"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password {editingId && <span className="text-xs text-slate-400">(opsional)</span>}
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={editingId ? "•••••••• (kosongkan jika tidak diubah)" : "••••••••"}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800 text-white"
                required={!editingId}
                disabled={loading}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-purple-200 px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-800 text-white"
                disabled={loading}
              >
                <option value="USER">User / Karyawan</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-600 text-white py-2 rounded-lg transition"
              >
                {loading ? "Menyimpan..." : editingId ? "Update" : "Simpan"}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ nama: "", email: "", password: "", role: "USER" });
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
            <h2 className="text-lg font-semibold text-purple-700">Data User</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {users.length} Items Total
            </span>
          </div>

          {users.length === 0 && !loading ? (
            <p className="text-center text-purple-400 py-8">
              📭 Belum ada data user. Silakan tambah data pertama.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-purple-700">
                  <th className="py-3 text-left">NO</th>
                  <th className="py-3 text-left">NAMA</th>
                  <th className="py-3 text-left">EMAIL</th>
                  <th className="py-3 text-left">ROLE</th>
                  <th className="py-3 text-left">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b border-purple-800 hover:bg-slate-800/50 transition"
                  >
                    <td className="py-3">{index + 1}</td>
                    <td className="py-3 font-medium text-purple-300">{user.name}</td>
                    <td className="py-3 text-purple-400">{user.email}</td>
                    <td className="py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            user.role === "ADMIN"
                              ? "bg-yellow-100/20 text-yellow-400"
                              : "bg-slate-100/20 text-slate-300"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 space-x-3">
                      <button 
                        onClick={() => handleEdit(user)}
                        className="text-indigo-400 hover:text-indigo-300 hover:underline transition"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
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