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
      {/* <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
        Selamat Datang di Dashboard {userName}! 🎉
      </h1> */}
      {/* layout */}
      {children}

    </div>
  );
}