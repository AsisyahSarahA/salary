'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Validasi Sederhana
        if (!name || !email || !password) {
            setError("Semua field harus diisi");
            return;
        }

        if (password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Registrasi gagal");
            }

            // Simpan token ke localStorage jika ada
            if (data.token) {
                localStorage.setItem("access_token", data.token);
            }
            
            if (data.user) {
                localStorage.setItem("user", JSON.stringify(data.user));
            }

            // Redirect ke dashboard atau login
            alert("Registrasi berhasil! Silakan login.");
            router.push("/sign-in");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 relative">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>

            {/* Main container */}
            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-slate-900 bg-opacity-50 backdrop-blur-lg rounded-2xl border border-purple-500 border-opacity-30 shadow-2xl p-8 md:p-10">

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-2">
                            Salary
                        </h1>
                        <p className="text-purple-300 text-sm">Buat akun baru Anda</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-500 rounded-lg text-red-300 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        {/* Full Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-purple-300 mb-2">
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="John Doe"
                                required
                                className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:border-opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition duration-300"
                            />
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-purple-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="your@email.com"
                                required
                                className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:border-opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition duration-300"
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-purple-300 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 bg-slate-800 border border-purple-500 border-opacity-30 rounded-lg text-white placeholder-purple-300 placeholder-opacity-50 focus:outline-none focus:border-purple-500 focus:border-opacity-100 focus:ring-2 focus:ring-purple-500 focus:ring-opacity-30 transition duration-300"
                            />
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-6 py-3 px-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold rounded-lg transition duration-300 shadow-lg hover:shadow-purple-500/50 transform hover:scale-[1.02] active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Mendaftar...' : 'Sign Up'}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center text-purple-300 text-sm mt-6">
                        Sudah punya akun?{" "}
                        <Link href="/sign-in" className="text-purple-400 font-semibold hover:text-purple-300 transition duration-300">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}