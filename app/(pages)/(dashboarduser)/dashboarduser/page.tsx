// app/(pages)/dashboard/page.tsx (untuk USER role)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CalendarCheck,
  FileText,
  Wallet,
  Clock,
  TrendingUp,
  TrendingDown,
  Bell,
  CheckCircle2,
  AlertCircle,
  Users,
  Building2,
  Hourglass
} from "lucide-react";

export default function DashboardUser() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (!token || !userData) {
      router.replace("/sign-in");
      return;
    }

    try {
      const user = JSON.parse(userData);

      if (user.role === "ADMIN") {
        router.replace("/dashboard");
        return;
      }

      const name = user.name || "User";
      setUserName(String(name).split(" ")[0]);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth error:", err);
      router.replace("/sign-in");
    } finally {
      setIsChecking(false);
    }
  }, [router]);

  /* ================= REALTIME CLOCK ================= */
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  /* ================= DATA ================= */
  const stats = [
    {
      title: "Kehadiran Bulan Ini",
      value: "22/24",
      subtitle: "Hari kerja",
      icon: CalendarCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20",
      progress: 92,
      trend: "up",
      change: "+3%"
    },
    {
      title: "Sisa Cuti",
      value: "8 Hari",
      subtitle: "Dari 12 hari",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      progress: 67,
      trend: "stable",
      change: "0%"
    },
    {
      title: "Gaji Terakhir",
      value: "Rp 5.5M",
      subtitle: "Maret 2024",
      icon: Wallet,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      progress: 100,
      trend: "up",
      change: "+2%"
    },
    {
      title: "Tugas Pending",
      value: "3",
      subtitle: "Perlu perhatian",
      icon: AlertCircle,
      color: "text-amber-400",
      bgColor: "bg-amber-900/20",
      progress: 25,
      trend: "down",
      change: "-1"
    },
  ];
  const activities = [
    { id: 1, title: "Presensi hari ini", desc: "Berhasil disimpan", time: "08:00", status: "success" },
    { id: 2, title: "Pengajuan cuti", desc: "Menunggu approval", time: "2 hari lalu", status: "pending" },
    { id: 3, title: "Slip gaji Maret", desc: "Telah tersedia", time: "1 minggu lalu", status: "success" },
  ];

  const quickActions = [
    { title: "Presensi Hari Ini", href: "/kehadiran", icon: Clock, color: "from-emerald-600 to-emerald-700", desc: "Catat kehadiran harian Anda" },
    { title: "Ajukan Cuti", href: "/pengajuan", icon: FileText, color: "from-blue-600 to-blue-700", desc: "Ajukan cuti dengan mudah" },
    { title: "Lihat Slip Gaji", href: "/slip", icon: Wallet, color: "from-purple-600 to-purple-700", desc: "Unduh slip gaji bulanan" },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-amber-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* ========== HEADER (Admin Style + User Features) ========== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-purple-300 mt-1">
            {formatDate(currentTime)}
          </p>
        </div>
        {/* Real-time Clock - Fitur User */}
        <div className="flex items-center gap-3 bg-slate-900 border border-purple-800 rounded-xl px-4 py-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-lg font-mono text-purple-100">
            {currentTime.toLocaleTimeString("id-ID")}
          </span>
        </div>
      </div>

      {/* ========== STATS CARDS (Admin Layout + User Progress Bars) ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-900 border border-purple-800 rounded-xl p-6 hover:border-purple-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.trend !== "stable" && (
                <div className="flex items-center gap-1 text-xs">
                  {getTrendIcon(stat.trend)}
                  <span className={stat.trend === "up" ? "text-emerald-400" : "text-red-400"}>
                    {stat.change}
                  </span>
                </div>
              )}
              {stat.trend === "stable" && (
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  {stat.change}
                </span>
              )}
            </div>
            <p className="text-purple-300 text-sm mb-1">{stat.title}</p>
            <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
            <p className="text-xs text-purple-400 mb-3">{stat.subtitle}</p>

            {/* Progress Bar - Fitur User */}
            <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color.replace("text", "from").replace("-400", "-500")} to-${stat.color.replace("text-", "").replace("-400", "-600")} rounded-full transition-all duration-500`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========== CONTENT GRID (Admin Layout) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities - Admin Style */}
        <div className="bg-slate-900 border border-purple-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-white">Aktivitas Terbaru</h2>
          </div>

          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors"
              >
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  {getStatusIcon(activity.status)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{activity.title}</p>
                  <p className="text-xs text-purple-400 mt-1">{activity.desc}</p>
                </div>
                <span className="text-xs text-purple-500 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pengumuman + Cuti Summary - User Features in Admin Layout */}
        <div className="space-y-6">
          {/* Pengumuman Widget */}
          <div className="bg-slate-900 border border-blue-800/50 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Pengumuman</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/50 rounded-lg border border-purple-800/50">
                <p className="text-sm text-purple-200 font-medium">Libur Nasional</p>
                <p className="text-xs text-purple-400 mt-1">
                  Tanggal 25 Maret 2024 - Seluruh karyawan diliburkan.
                </p>
              </div>
            </div>
          </div>

          {/* Cuti Summary Widget - Fitur User */}
          <div className="bg-slate-900 border border-purple-800 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-4">Ringkasan Cuti 2024</h3>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Total Jatah</span>
                  <span className="text-white font-medium">12 Hari</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-purple-600 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Sudah Diambil</span>
                  <span className="text-white font-medium">4 Hari</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-emerald-500 rounded-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-300">Sisa Cuti</span>
                  <span className="text-emerald-400 font-bold">8 Hari</span>
                </div>
                <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <Link
              href="/riwayat"
              className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition"
            >
              Lihat Riwayat Cuti
            </Link>
          </div>
        </div>
      </div>

      {/* ========== QUICK ACTIONS (Admin Style + User Features) ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`bg-gradient-to-r ${action.color} hover:from-opacity-90 hover:to-opacity-90 text-white rounded-xl p-6 transition-all hover:scale-105`}
          >
            <action.icon className="w-8 h-8 mb-3" />
            <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
            <p className="text-sm text-white/80">{action.desc}</p>
          </Link>
        ))}
      </div>

      {/* ========== USER STATUS (User Feature - Bottom Right) ========== */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900 border border-emerald-800/50 rounded-xl p-4 flex items-center gap-3 shadow-lg">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
              {userName?.charAt?.(0) || "U"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-emerald-400">● Online</p>
          </div>
        </div>
      </div>
    </div>
  );
}