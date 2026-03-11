// components/Sidebar.tsx - Update bagian menuItems untuk Gaji
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';
import {
    LayoutGrid,
    ChevronDown,
    Building2,
    Briefcase,
    Users,
    UserCog,
    Settings,
    CalendarCheck,
    CalendarDays,
    Wallet,
    X,
    LayoutDashboard,
    FileText,        // ✅ Tambahkan import ini untuk icon Report
    CreditCard       // ✅ Tambahkan import ini untuk icon Proses Gaji
} from 'lucide-react';

// ✅ Interface untuk submenu
interface SubMenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;
}

// ✅ Interface untuk menu utama
interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href?: string;
    hasSubmenu?: boolean;
    submenu?: SubMenuItem[];
}

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutGrid,
            href: '/dashboard'
        },
        {
            id: 'master',
            label: 'Master',
            icon: Building2,
            hasSubmenu: true,
            submenu: [
                { id: 'divisi', label: 'Divisi', icon: Building2, href: '/divisi' },
                { id: 'jabatan', label: 'Jabatan', icon: Briefcase, href: '/jabatan' },
                { id: 'karyawan', label: 'Karyawan', icon: Users, href: '/karyawan' },
                { id: 'user', label: 'User', icon: UserCog, href: '/user' },
                { id: 'konfigurasi', label: 'Konfigurasi', icon: Settings, href: '/konfigurasi' },
            ]
        },
        {
            id: 'presensi',
            label: 'Presensi',
            icon: CalendarCheck,
            href: '/presensi'
        },
        {
            id: 'cuti',
            label: 'Cuti',
            icon: CalendarDays,
            href: '/cuti'
        },
        // ✅ UPDATE: Gaji menjadi dropdown dengan 2 submenu
        {
            id: 'gaji',
            label: 'Gaji',
            icon: Wallet,
            hasSubmenu: true,  // ✅ Aktifkan submenu
            submenu: [
                { id: 'proses-gaji', label: 'Proses Gaji', icon: CreditCard, href: '/gaji/proses' },
                { id: 'report-gaji', label: 'Report Gaji', icon: FileText, href: '/gaji/report' },
            ]
        },
    ];

    // ✅ Helper: Cek apakah link aktif
    const isActive = (href: string | undefined): boolean => {
        if (!href) return false;
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    // ✅ Helper: Toggle submenu
    const toggleSubmenu = (id: string) => {
        setOpenSubmenu(openSubmenu === id ? null : id);
    };

    // ✅ Helper: Cek apakah submenu aktif
    const isSubmenuActive = (submenu?: SubMenuItem[]): boolean => {
        if (!submenu) return false;
        return submenu.some(sub => isActive(sub.href));
    };

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
                            <span className="text-white font-bold text-xl">S</span>
                        </div>
                        <h1 className="text-xl font-bold">
                            <span className="text-white">Salary</span>
                            <span className="text-purple-400">App</span>
                        </h1>
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 rounded-lg hover:bg-purple-900/30 text-purple-300"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3">
                    <ul className="space-y-1">
                        {menuItems.map((item) => (
                            <li key={item.id}>
                                {item.hasSubmenu ? (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(item.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${
                                                openSubmenu === item.id || isSubmenuActive(item.submenu)
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50'
                                                    : 'hover:bg-purple-900/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon 
                                                    className={`w-5 h-5 ${
                                                        openSubmenu === item.id || isSubmenuActive(item.submenu)
                                                            ? 'text-white' 
                                                            : 'text-purple-400 group-hover:text-purple-300'
                                                    }`} 
                                                />
                                                <span className={`font-medium ${
                                                    openSubmenu === item.id || isSubmenuActive(item.submenu)
                                                        ? 'text-white' 
                                                        : 'text-purple-200 group-hover:text-white'
                                                }`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-purple-300 transition-transform duration-200 ${
                                                    (openSubmenu === item.id || isSubmenuActive(item.submenu)) 
                                                        ? 'rotate-180' 
                                                        : ''
                                                }`}
                                            />
                                        </button>

                                        {/* Submenu */}
                                        {(openSubmenu === item.id || isSubmenuActive(item.submenu)) && item.submenu && (
                                            <ul className="mt-1 ml-4 pl-4 border-l-2 border-purple-800/50 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        <Link
                                                            href={subItem.href}
                                                            onClick={onClose}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                                                isActive(subItem.href)
                                                                    ? 'bg-purple-600/20 text-purple-300 border-l-2 border-purple-500'
                                                                    : 'text-purple-300/70 hover:bg-purple-900/20 hover:text-purple-200'
                                                            }`}
                                                        >
                                                            <subItem.icon className="w-4 h-4" />
                                                            <span className="text-sm font-medium">{subItem.label}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    item.href && (
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
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-purple-900/50">
                    <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/30 rounded-lg p-3">
                        <p className="text-xs text-purple-300 text-center">© 2026 SalaryApp</p>
                    </div>
                </div>
            </aside>
        </>
    );
}