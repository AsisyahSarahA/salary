// app/(pages)/dashboard/page.tsx
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
  Minus
} from "lucide-react";

export default function DashboardAdmin() {
  const router = useRouter();
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    // Cek auth dan ambil nama user
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.name?.split(" ")[0] || "Admin");
      
      // Redirect jika bukan ADMIN
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
    } else {
      router.push("/sign-in");
    }
  }, [router]);

  // Dummy data untuk statistik
  const stats = [
    {
      title: "Total Karyawan",
      value: "124",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-900/20",
    },
    {
      title: "Divisi",
      value: "8",
      change: "Stable",
      trend: "stable",
      icon: Building2,
      color: "text-purple-400",
      bgColor: "bg-purple-900/20",
    },
    {
      title: "Payroll Bulan Ini",
      value: "Rp 450M",
      change: "+5%",
      trend: "up",
      icon: Wallet,
      color: "text-emerald-400",
      bgColor: "bg-emerald-900/20",
    },
    {
      title: "Pending Approval",
      value: "12",
      change: "-2",
      trend: "down",
      icon: Hourglass,
      color: "text-amber-400",
      bgColor: "bg-amber-900/20",
    },
  ];

  // Dummy data untuk recent activities
  const recentActivities = [
    { id: 1, action: "Updated Divisi", target: "IT Support", time: "2 hours ago" },
    { id: 2, action: "Updated Divisi", target: "IT Support", time: "4 hours ago" },
    { id: 3, action: "Updated Divisi", target: "IT Support", time: "6 hours ago" },
    { id: 4, action: "Approved Cuti", target: "Ahmad Fauzi", time: "8 hours ago" },
    { id: 5, action: "Added Karyawan", target: "Siti Aminah", time: "1 day ago" },
  ];

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {userName}!
        </h1>
        <p className="text-purple-300 mt-1">
          Heres whats happening with your payroll system today.
        </p>
      </div>

      {/* Stats Cards */}
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
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-slate-900 border border-purple-800 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <h2 className="text-lg font-semibold text-white">
              Recent Activities
            </h2>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-900/20 transition-colors"
              >
                <div className="p-2 bg-purple-900/30 rounded-lg">
                  <FileText className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {activity.action} "{activity.target}"
                  </p>
                  <p className="text-xs text-purple-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Reports Coming Soon */}
        <div className="bg-slate-900 border border-dashed border-purple-800 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            New Reports Coming Soon
          </h2>
          <p className="text-sm text-purple-300 max-w-md">
            We're building advanced analytics for your payroll.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/karyawan"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl p-6 transition-all hover:scale-105"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Kelola Karyawan</h3>
          <p className="text-sm text-blue-100">Tambah, edit, atau hapus data karyawan</p>
        </Link>

        <Link
          href="/gaji/proses"
          className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl p-6 transition-all hover:scale-105"
        >
          <Wallet className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Proses Gaji</h3>
          <p className="text-sm text-emerald-100">Hitung dan proses gaji bulanan</p>
        </Link>

        <Link
          href="/cuti"
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-xl p-6 transition-all hover:scale-105"
        >
          <Hourglass className="w-8 h-8 mb-3" />
          <h3 className="font-semibold text-lg mb-1">Approval Cuti</h3>
          <p className="text-sm text-purple-100">Setujui atau tolak pengajuan cuti</p>
        </Link>
      </div>
    </div>
  );
}