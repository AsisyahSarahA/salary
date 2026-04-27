"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface AttendanceRecord {
  id: number;
  tanggal: string;
  jam_masuk: string;
  jam_keluar: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  keterangan?: string;
}

const API_URL = "https://payroll.politekniklp3i-tasikmalaya.ac.id/api/presensi";

export default function KehadiranPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<"HADIR" | "IZIN" | "SAKIT">("HADIR");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);

  // 🔑 Helper get Auth Data
  const getAuthData = () => {
    if (typeof window === "undefined") return { token: null, user: null };
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user");
    return { 
      token, 
      user: userData ? JSON.parse(userData) : null 
    };
  };

  // ===============================
  // FETCH DATA KEHADIRAN (FILTER BY USER)
  // ===============================
  const fetchAttendance = useCallback(async () => {
    const { token, user } = getAuthData();
    if (!token || !user) return;

    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        const allData = data.data || data;
        
        // 🔍 Tentukan ID Karyawan untuk filter
        let myId = user.id_karyawan || user.karyawan_id || user.id_user || user.id;
        
        // Fallback: Cari by email jika ID di session mungkin ID User
        try {
          const resK = await fetch("https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan", {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }
          });
          const listK = await resK.json();
          const found = (listK.data || listK).find((k: any) => k.email === user.email);
          if (found) myId = found.id;
        } catch (e) { /* ignore fallback error */ }

        // Filter data agar hanya milik user ini
        const filtered = allData.filter((item: any) => 
          Number(item.id_karyawan) === Number(myId)
        );

        // Sort by tanggal terbaru
        filtered.sort((a: any, b: any) => 
          new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );

        setAttendanceHistory(filtered);
      }
    } catch (err) {
      console.error("Gagal mengambil riwayat:", err);
    }
  }, []);

  // Cek role & Fetch Data
  useEffect(() => {
    const { token, user } = getAuthData();
    
    if (!token || !user) {
      router.push("/sign-in");
      return;
    }

    setUserName(user.name || "Karyawan");

    // Role Fix: Allow if NOT admin/hrd
    const role = user.role?.toLowerCase();
    if (role === "admin" || role === "hrd") {
      router.push("/dashboard");
    } else {
      fetchAttendance();
    }
  }, [router, fetchAttendance]);

  // Update waktu setiap detik (Hydration safe)
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCheckoutTime = (date: Date | null) => {
    if (!date) return "--:--:--";
    const checkout = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    return checkout.getHours().toString().padStart(2, '0') + ':' + 
           checkout.getMinutes().toString().padStart(2, '0') + ':' + 
           checkout.getSeconds().toString().padStart(2, '0');
  };

  const handleSubmit = async () => {
    const { token, user } = getAuthData();
    
    if (!token || !user) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Full User Session Object:", user);

      let karyawanIdRaw = user.id_karyawan || user.karyawan_id || user.id_user || user.id;
      let karyawanId: number | null = karyawanIdRaw ? Number(karyawanIdRaw) : null;

      // 🔍 Cari id_karyawan dari API jika tidak ada di session
      try {
        const resKaryawan = await fetch("https://payroll.politekniklp3i-tasikmalaya.ac.id/api/karyawan", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        const dataKaryawan = await resKaryawan.json();
        const listKaryawan = dataKaryawan.data || dataKaryawan;
        
        const findMe = listKaryawan.find((k: any) => k.email === user.email);
        if (findMe) {
          karyawanId = Number(findMe.id);
        }
      } catch (e) {
        console.error("Gagal mencari data karyawan:", e);
      }

      if (!karyawanId) {
        throw new Error("ID Karyawan tidak ditemukan. Silakan hubungi admin.");
      }

      const now = new Date();
      const jamMasuk = now.getHours().toString().padStart(2, '0') + ':' + 
                      now.getMinutes().toString().padStart(2, '0') + ':' + 
                      now.getSeconds().toString().padStart(2, '0');
      
      const jamKeluar = getCheckoutTime(now);

      const payload = {
        id_karyawan: karyawanId,
        tanggal: now.toISOString().split('T')[0],
        status: status,
        keterangan: keterangan || "-",
        jam_masuk: jamMasuk,
        jam_keluar: jamKeluar, 
      };

      console.log("Sending Presensi Payload:", payload);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Server Response Data:", data);

      if (!res.ok) {
        throw new Error(data.message || "Gagal menyimpan presensi");
      }

      alert(`Presensi ${status} berhasil! Estimasi pulang: ${jamKeluar}`);
      setKeterangan("");
      fetchAttendance(); 
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      HADIR: "bg-emerald-100 text-emerald-700",
      IZIN: "bg-amber-100 text-amber-700",
      SAKIT: "bg-rose-100 text-rose-700",
      ALPHA: "bg-red-100 text-red-700",
    };
    return styles[status] || "bg-purple-100 text-purple-700";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-purple-700">Presensi Kehadiran</h1>
          <p className="text-sm text-purple-500 mt-1">Halo {userName}, silahkan melakukan presensi harian Anda.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 rounded-lg px-6 py-3 border border-purple-800">
            <div className="text-2xl font-bold text-purple-100">
              {currentTime ? currentTime.toLocaleTimeString("id-ID") : "--:--:--"}
            </div>
            <div className="text-xs text-purple-400 uppercase">
              JAM MASUK (SEKARANG)
            </div>
          </div>
          <div className="bg-slate-900 rounded-lg px-6 py-3 border border-emerald-800">
            <div className="text-2xl font-bold text-emerald-400">
              {getCheckoutTime(currentTime)}
            </div>
            <div className="text-xs text-emerald-500 uppercase">
              ESTIMASI PULANG (+8 JAM)
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-300 p-4 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Presensi */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
          <h2 className="text-lg font-semibold text-purple-700 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-900/50 rounded-lg flex items-center justify-center">📝</span>
            Form Presensi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-700 mb-3">
                Status Kehadiran
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["HADIR", "IZIN", "SAKIT"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`py-3 px-4 rounded-lg font-medium transition ${
                      status === s
                        ? "bg-purple-600 text-white"
                        : "bg-slate-800 text-purple-300 hover:bg-slate-700"
                    }`}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-700 mb-2">
                Keterangan (Opsional)
              </label>
              <textarea
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Sakit flu, Izin urusan keluarga..."
                rows={4}
                className="w-full rounded-lg border border-purple-800 bg-slate-800 text-purple-100 px-4 py-3 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Submit Kehadiran
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-purple-900/20 border border-purple-800 rounded-lg">
            <div className="flex gap-3">
              <span className="text-purple-400 text-xl">ℹ️</span>
              <div>
                <h4 className="font-semibold text-purple-300 text-sm">Info Penting</h4>
                <p className="text-xs text-purple-400 mt-1">
                  Sistem akan mencatat waktu masuk sekarang dan otomatis menghitung 8 jam kerja.<br />
                  Estimasi waktu pulang Anda adalah pukul <strong className="text-emerald-400">{getCheckoutTime(currentTime)}</strong> WIB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Kehadiran */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-purple-700">Riwayat Kehadiran</h2>
            <button className="text-sm text-purple-400 hover:text-purple-300">Lihat Semua</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-purple-400 border-b border-purple-800">
                  <th className="py-3 text-left font-medium">TANGGAL</th>
                  <th className="py-3 text-left font-medium">MASUK</th>
                  <th className="py-3 text-left font-medium">PULANG</th>
                  <th className="py-3 text-left font-medium">STATUS</th>
                  <th className="py-3 text-left font-medium">KET</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((record) => (
                    <tr key={record.id} className="border-b border-purple-900/50">
                      <td className="py-4 text-purple-100 font-medium">
                        {new Date(record.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 text-purple-300">{record.jam_masuk}</td>
                      <td className="py-4 text-purple-300">{record.jam_keluar}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="py-4 text-purple-400 text-xs">{record.keterangan || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-purple-500">
                      <div className="text-4xl mb-2">📭</div>
                      <p>Belum ada riwayat kehadiran.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}