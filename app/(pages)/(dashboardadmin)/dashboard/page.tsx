// app/(pages)/dashboard/page.tsx (untuk ADMIN role)
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Building2,
  Wallet,
  Hourglass,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

export default function DashboardAdmin() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const userData = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (!token || !userData) {
      router.replace("/sign-in");
      return;
    }

    try {
      const user = JSON.parse(userData);

      // cek role admin
      if (user.role?.toLowerCase() !== "admin") {
        router.replace("/dashboarduser");
        return;
      }

      const name = user.name || "Admin";
      setUserName(name.split(" ")[0]);
      setIsAuthenticated(true);

    } catch (error) {
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

  /* ================= LOADING STATE ================= */
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 rounded-full mx-auto mb-4"></div>
          <p className="text-purple-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  /* ================= DATA ================= */
  const stats = [
    {
      title: "Total Karyawan",
      value: "124",
      subtitle: "Aktif saat ini",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
      progress: 85,
      trend: "up",
      change: "+12%",
    },
    {
      title: "Divisi",
      value: "8",
      subtitle: "Terdaftar",
      icon: Building2,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
      progress: 100,
      trend: "stable",
      change: "Stable",
    },
    {
      title: "Payroll Bulan Ini",
      value: "Rp 450M",
      subtitle: "Estimasi total",
      icon: Wallet,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20",
      progress: 78,
      trend: "up",
      change: "+5%",
    },
    {
      title: "Pending Approval",
      value: "12",
      subtitle: "Perlu tindakan",
      icon: Hourglass,
      color: "text-amber-400",
      bgColor: "bg-amber-900/20",
      progress: 30,
      trend: "down",
      change: "-2",
    },
  ];

  const recentActivities = [
    { id: 1, title: "Updated Divisi", desc: "IT Support", time: "2 jam lalu", status: "success" },
    { id: 2, title: "Approved Cuti", desc: "Ahmad Fauzi - 3 Hari", time: "4 jam lalu", status: "success" },
    { id: 3, title: "Added Karyawan", desc: "Siti Aminah - HR Specialist", time: "6 jam lalu", status: "success" },
    { id: 4, title: "Pending Cuti", desc: "Budi Santoso - Menunggu", time: "8 jam lalu", status: "pending" },
    { id: 5, title: "Updated Gaji", desc: "Perubahan tunjangan Q1", time: "1 hari lalu", status: "info" },
  ];

  const quickActions = [
    { title: "Kelola Karyawan", href: "/karyawan", icon: Users, color: "from-blue-600 to-blue-700", desc: "Tambah, edit, atau hapus data karyawan" },
    { title: "Proses Gaji", href: "/gaji/proses", icon: Wallet, color: "from-emerald-600 to-emerald-700", desc: "Hitung dan proses gaji bulanan" },
    { title: "Approval Cuti", href: "/cuti", icon: Hourglass, color: "from-purple-600 to-purple-700", desc: "Setujui atau tolak pengajuan cuti" },
  ];

  const pendingApprovals = [
    { id: 1, type: "Cuti", employee: "Ahmad Fauzi", detail: "3 Hari - Tahunan", date: "15-17 Mar" },
    { id: 2, type: "Cuti", employee: "Siti Aminah", detail: "1 Hari - Sakit", date: "10 Mar" },
    { id: 3, type: "Karyawan Baru", employee: "Dewi Lestari", detail: "Frontend Developer", date: "Input Baru" },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-amber-400" />;
    if (status === "info") return <AlertCircle className="w-4 h-4 text-blue-400" />;
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
    if (trend === "down") return <ArrowDownRight className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* ========== HEADER (Admin Style + Interactive Features) ========== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-purple-300 mt-1">
            {formatDate(currentTime)}
          </p>
        </div>
        {/* Real-time Clock + Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-900 border border-purple-800 rounded-xl px-4 py-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-lg font-mono text-purple-100">
              {currentTime.toLocaleTimeString("id-ID")}
            </span>
          </div>
          <button className="relative p-2 bg-slate-900 border border-purple-800 rounded-xl hover:border-purple-600 transition">
            <Bell className="w-5 h-5 text-purple-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>
      </div>

      {/* ========== STATS CARDS (Admin Layout + Progress Bars) ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-slate-900 border border-purple-800 rounded-xl p-6 hover:border-purple-600 hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 ${stat.bgColor.replace("/20", "/10")} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative flex items-start justify-between mb-4">
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
            <h2 className="text-2xl font-bold text-white mb-1">{stat.value}</h2>
            <p className="text-xs text-purple-400 mb-3">{stat.subtitle}</p>

            {/* Progress Bar - Interactive Feature */}
            <div className="h-1.5 bg-purple-900/50 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${stat.color.replace("text", "from").replace("-400", "-500")} to-${stat.color.replace("text-", "").replace("-400", "-600")} rounded-full transition-all duration-500`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ========== CONTENT GRID (Admin Layout + User Features) ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Activities & Pending */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <div className="bg-slate-900 border border-purple-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold text-white">Aktivitas Terbaru</h2>
              </div>
              <Link href="#" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors group"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white group-hover:text-purple-200 transition">
                      {activity.title}
                    </p>
                    <p className="text-xs text-purple-400">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-purple-500 whitespace-nowrap font-mono">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals Widget */}
          <div className="bg-slate-900 border border-amber-800/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Hourglass className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Menunggu Persetujuan</h3>
              </div>
              <span className="text-xs bg-amber-900/50 text-amber-300 px-3 py-1 rounded-full border border-amber-700">
                {pendingApprovals.length} Items
              </span>
            </div>

            <div className="space-y-3">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-purple-800/50 hover:border-amber-600 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.employee}</p>
                    <p className="text-xs text-purple-400">{item.type} • {item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-purple-500">{item.date}</span>
                    <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR - Widgets */}
        <div className="space-y-6">
          {/* Quick Stats Summary */}
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-800/50 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Ringkasan Maret 2024
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-300">Hari Kerja</span>
                <span className="text-white font-medium">22 Hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Karyawan Hadir</span>
                <span className="text-emerald-400 font-medium">118/124</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Cuti Diajukan</span>
                <span className="text-amber-400 font-medium">15 Permohonan</span>
              </div>
              <div className="border-t border-purple-800/50 pt-3 flex justify-between">
                <span className="text-purple-300 font-semibold">Payroll Status</span>
                <span className="text-emerald-400 font-bold">● On Track</span>
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-slate-900 border border-emerald-800/50 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Status Sistem</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">Database</span>
                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">API Backend</span>
                <span className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-300">Last Sync</span>
                <span className="text-xs text-purple-400 font-mono">2 min ago</span>
              </div>
            </div>
          </div>

          {/* Admin User Status */}
          <div className="bg-slate-900 border border-purple-800 rounded-xl p-4 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
                {userName?.charAt?.(0) || "A"}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-purple-400">● Admin (HRD) • Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== QUICK ACTIONS (Admin Style + Interactive) ========== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`group relative bg-gradient-to-r ${action.color} hover:from-opacity-90 hover:to-opacity-90 text-white rounded-xl p-6 transition-all hover:scale-105 overflow-hidden`}
          >
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <action.icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
              <p className="text-sm text-white/80">{action.desc}</p>
            </div>

            {/* Arrow indicator */}
            <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* ========== FLOATING USER STATUS (Bottom Right) ========== */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-slate-900 border border-emerald-800/50 rounded-xl p-4 flex items-center gap-3 shadow-lg hover:border-emerald-600 transition cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold">
              {userName?.charAt?.(0) || "A"}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{userName}</p>
            <p className="text-xs text-emerald-400">● Online • Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}