'use client';

import { useState } from "react";

type Role = "ADMIN" | "USER";

interface User {
  id: number;
  nama: string;
  email: string;
  role: Role;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, nama: "Admin HRD", email: "hrd@mail.com", role: "ADMIN" },
    { id: 2, nama: "John Doe", email: "john@mail.com", role: "USER" },
    { id: 3, nama: "Jane Smith", email: "jane@mail.com", role: "USER" },
  ]);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    password: "",
    role: "USER",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setUsers(prev => [
      ...prev,
      {
        id: prev.length + 1,
        nama: form.nama,
        email: form.email,
        role: form.role as Role,
      },
    ]);

    setForm({ nama: "", email: "", password: "", role: "USER" });
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="bg-slate-900 rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 text-xl">
              +
            </span>
            Tambah User
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-purple-500">
            <div>
              <label className="block text-sm font-medium mb-1">Nama</label>
              <input
                name="nama"
                value={form.nama}
                onChange={handleChange}
                placeholder="Nama Lengkap"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-900"
              >
                <option value="USER">User / Karyawan</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-purple-800 hover:bg-purple-900 text-white py-2 rounded-lg transition"
            >
              Simpan
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl border shadow-sm p-6 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Data User</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              {users.length} Items Total
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 border-b">
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
                  className="border-b hover:bg- slate-50 transition"
                >
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 font-medium">{user.nama}</td>
                  <td className="py-3 text-purple-600">{user.email}</td>
                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${
                          user.role === "ADMIN"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button className="text-indigo-600 hover:underline">
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