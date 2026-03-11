"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AttendanceRecord {
  id: number;
  tanggal: string;
  masuk: string;
  pulang: string;
  status: "HADIR" | "IZIN" | "SAKIT" | "ALPHA";
  keterangan?: string;
}

export default function KehadiranPage() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<"HADIR" | "IZIN" | "SAKIT">("HADIR");
  const [keterangan, setKeterangan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [attendanceHistory] = useState<AttendanceRecord[]>([
    { id: 1, tanggal: "2024-03-01", masuk: "08:00", pulang: "17:00", status: "HADIR" },
    { id: 2, tanggal: "2024-02-28", masuk: "08:15", pulang: "17:05", status: "HADIR" },
    { id: 3, tanggal: "2024-02-27", masuk: "-", pulang: "-", status: "IZIN", keterangan: "Urusan Keluarga" },
    { id: 4, tanggal: "2024-02-26", masuk: "07:55", pulang: "17:00", status: "HADIR" },
  ]);

  // Cek role USER
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role?.toLowerCase() !== "user") {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulasi API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Presensi ${status} berhasil disimpan!`);
    setIsLoading(false);
    setKeterangan("");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
          <p className="text-sm text-purple-500 mt-1">Silahkan melakukan presensi harian Anda.</p>
        </div>
        <div className="bg-slate-900 rounded-lg px-6 py-3 border border-purple-800">
          <div className="text-2xl font-bold text-purple-100">
            {currentTime.toLocaleTimeString("id-ID")}
          </div>
          <div className="text-xs text-purple-400 uppercase">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>

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
                <button
                  onClick={() => setStatus("HADIR")}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    status === "HADIR"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-purple-300 hover:bg-slate-700"
                  }`}
                >
                  Hadir
                </button>
                <button
                  onClick={() => setStatus("IZIN")}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    status === "IZIN"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-purple-300 hover:bg-slate-700"
                  }`}
                >
                  Izin
                </button>
                <button
                  onClick={() => setStatus("SAKIT")}
                  className={`py-3 px-4 rounded-lg font-medium transition ${
                    status === "SAKIT"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 text-purple-300 hover:bg-slate-700"
                  }`}
                >
                  Sakit
                </button>
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-70 flex items-center justify-center gap-2"
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
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
            <div className="flex gap-3">
              <span className="text-blue-400 text-xl">ℹ️</span>
              <div>
                <h4 className="font-semibold text-blue-300 text-sm">Info Penting</h4>
                <p className="text-xs text-blue-400 mt-1">
                  Batas waktu presensi masuk adalah pukul 08:30 WIB.<br />
                  Keterlambatan akan dicatat secara otomatis oleh sistem.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Kehadiran */}
        <div className="bg-slate-900 rounded-2xl border border-purple-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-purple-700">Riwayat Kehadiran</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">Lihat Semua</button>
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
                {attendanceHistory.map((record) => (
                  <tr key={record.id} className="border-b border-purple-900/50">
                    <td className="py-4 text-purple-100 font-medium">
                      {new Date(record.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 text-purple-300">{record.masuk}</td>
                    <td className="py-4 text-purple-300">{record.pulang}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-4 text-purple-400 text-xs">{record.keterangan || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}