// components/SidebarUser.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutDashboard,
    CalendarCheck,
    FileText,
    Wallet,
    X,
    LogOut,
    Clock
} from 'lucide-react';

// Interface untuk menu item
interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
}

interface SidebarUserProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function SidebarUser({ isOpen = true, onClose }: SidebarUserProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [userName, setUserName] = useState<string>("User");
    const [isLoaded, setIsLoaded] = useState(false);

    // Ambil user data dari localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    setUserName(user.name?.split(" ")[0] || "User");
                } catch (e) {
                    setUserName("User");
                }
            }
            setIsLoaded(true);
        }
    }, []);

    // Helper: Cek apakah link aktif
    const isActive = (href: string): boolean => {
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // Handler: Logout
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        router.push("/sign-in");
    };

    // Menu items untuk User
    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            href: '/dashboarduser'
        },
        {
            id: 'presensi',
            label: 'Kehadiran',
            icon: CalendarCheck,
            href: '/kehadiran'
        },
        {
            id: 'cuti',
            label: 'Pengajuan Cuti',
            icon: FileText,
            href: '/pengajuan'
        },
        {
            id: 'gaji',
            label: 'Slip Gaji',
            icon: Wallet,
            href: '/slip'
        },
    ];

    // Loading skeleton
    if (!isLoaded) {
        return (
            <aside className="w-64 bg-slate-950 border-r border-purple-900/50 flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-purple-900/50">
                    <div className="w-8 h-8 rounded-lg bg-purple-800 animate-pulse" />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-12 bg-purple-900/30 rounded-lg animate-pulse" />
                    ))}
                </nav>
            </aside>
        );
    }

    return (
        <>
            {/* Overlay untuk mobile */}
            {!isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-purple-900/50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } flex flex-col shadow-2xl`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-purple-900/50">
                    <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">N</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-purple-400 leading-tight">
                               Salary-App
                            </h1>
                            <p className="text-xs text-purple-300">Payroll System</p>
                        </div>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-purple-900/30 text-purple-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="px-6 py-4 border-b border-purple-900/50 bg-purple-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{userName}</p>
                            <p className="text-xs text-purple-400">Karyawan</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                <Link
                                    href={item.href}
                                    onClick={onClose}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                                        isActive(item.href)
                                            ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50'
                                            : 'hover:bg-purple-900/30'
                                    }`}
                                >
                                    <item.icon 
                                        className={`w-5 h-5 ${
                                            isActive(item.href) 
                                                ? 'text-white' 
                                                : 'text-purple-400 group-hover:text-purple-300'
                                        }`} 
                                    />
                                    <span className={`font-medium ${
                                        isActive(item.href) 
                                            ? 'text-white' 
                                            : 'text-purple-200 group-hover:text-white'
                                    }`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer + Logout */}
                <div className="p-4 border-t border-purple-900/50 space-y-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Keluar Aplikasi</span>
                    </button>
                    <p className="text-xs text-purple-400 text-center">© 2026 NUSAPAY</p>
                </div>
            </aside>
        </>
    );
}