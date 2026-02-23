'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Helper: ambil nama dari localStorage (aman untuk SSR)
function getUserNameFromStorage(): string {
  if (typeof window === 'undefined') return 'Pengguna';
  
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user.name || user.fullName || 'Pengguna';
    }
  } catch (e) {
    console.error('Error parsing user:', e);
  }
  return 'Pengguna';
}

export default function Dashboard() {
  const router = useRouter();
  const userName = getUserNameFromStorage();

  useEffect(() => {
    // Cek auth: redirect jika tidak ada tokengit
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/sign-in');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="bg-slate-900 bg-opacity-50 backdrop-blur-lg rounded-2xl border border-purple-500 border-opacity-30 shadow-2xl p-8 max-w-lg w-full text-center">
        
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
          Selamat Datang di Dashboard {userName}! 🎉
        </h1>
        
        <p className="text-purple-300 mb-6">
          Anda telah berhasil login. Silakan jelajahi fitur-fitur aplikasi Salary.
        </p>

        <div className="bg-slate-800 rounded-xl p-4 mb-6 border border-purple-500 border-opacity-20">
          <p className="text-sm text-purple-400">Status</p>
          <p className="text-white font-semibold">✅ Terhubung</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            router.push('/sign-in');
          }}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition duration-300"
        >
          Logout
        </button>

      </div>
    </div>
  );
}