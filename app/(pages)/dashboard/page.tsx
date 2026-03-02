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

export default function Dashboard({ children }: { children: React.ReactNode }) {

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

    <div>
      <h1 className="text-3xl font-bold mb-4">Selamat datang, {userName}!</h1>
       
       <p className="text-lg text-gray-300 mb-6">
        Ini adalah dashboard utama Anda. Gunakan menu di sebelah kiri untuk mengelola data perusahaan Anda, termasuk divisi, jabatan, karyawan, dan konfigurasi lainnya.
      </p>

    </div>
  );
}