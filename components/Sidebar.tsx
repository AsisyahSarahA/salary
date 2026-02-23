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
    LayoutDashboard
} from 'lucide-react';

// ✅ 1. Definisikan interface untuk submenu
interface SubMenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href: string;  // ✅ href wajib string, tidak undefined
}

// ✅ 2. Definisikan interface untuk menu utama
interface MenuItem {
    id: string;
    label: string;
    icon: LucideIcon;
    href?: string;  // ✅ optional karena ada yang tidak punya href (submenu)
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
    const [openMaster, setOpenMaster] = useState(true);

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
                { id: 'divisi', label: 'Divisi', icon: Building2, href: '/master/divisi' },
                { id: 'jabatan', label: 'Jabatan', icon: Briefcase, href: '/master/jabatan' },
                { id: 'karyawan', label: 'Karyawan', icon: Users, href: '/master/karyawan' },
                { id: 'user', label: 'User', icon: UserCog, href: '/master/user' },
                { id: 'konfigurasi', label: 'Konfigurasi', icon: Settings, href: '/master/konfigurasi' },
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
        {
            id: 'gaji',
            label: 'Gaji',
            icon: Wallet,
            href: '/gaji'
        },
    ];

    // ✅ 3. Tambahkan type guard untuk memastikan href adalah string
    const isActive = (href: string | undefined): boolean => {
        if (!href) return false;
        return pathname === href;
    };

    const isMasterActive = menuItems
        .find(item => item.id === 'master')
        ?.submenu
        ?.some(sub => isActive(sub.href));

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
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-purple-900/50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    } flex flex-col shadow-2xl`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-purple-900/50">
                    <Link href="/dashboard" className="flex items-center gap-3">
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
                                            onClick={() => setOpenMaster(!openMaster)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group ${openMaster || isMasterActive
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50'
                                                : 'hover:bg-purple-900/30'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={`w-5 h-5 ${openMaster || isMasterActive ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'
                                                    }`} />
                                                <span className={`font-medium ${openMaster || isMasterActive ? 'text-white' : 'text-purple-200 group-hover:text-white'
                                                    }`}>
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`w-4 h-4 text-purple-300 transition-transform duration-200 ${(openMaster || isMasterActive) ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </button>

                                        {/* Submenu */}
                                        {(openMaster || isMasterActive) && item.submenu && (
                                            <ul className="mt-1 ml-4 pl-4 border-l-2 border-purple-800/50 space-y-1">
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.id}>
                                                        {/* ✅ 4. Tambahkan conditional rendering untuk href */}
                                                        {subItem.href && (
                                                            <Link
                                                                href={subItem.href}
                                                                onClick={onClose}
                                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${isActive(subItem.href)
                                                                    ? 'bg-purple-600/20 text-purple-300 border-l-2 border-purple-500'
                                                                    : 'text-purple-300/70 hover:bg-purple-900/20 hover:text-purple-200'
                                                                    }`}
                                                            >
                                                                <subItem.icon className="w-4 h-4" />
                                                                <span className="text-sm font-medium">{subItem.label}</span>
                                                            </Link>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    // ✅ 5. Tambahkan conditional untuk item.href
                                    item.href && (
                                        <Link
                                            href={item.href}
                                            onClick={onClose}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive(item.href)
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50'
                                                : 'hover:bg-purple-900/30'
                                                }`}
                                        >
                                            <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-white' : 'text-purple-400 group-hover:text-purple-300'
                                                }`} />
                                            <span className={`font-medium ${isActive(item.href) ? 'text-white' : 'text-purple-200 group-hover:text-white'
                                                }`}>
                                                {item.label}
                                            </span>
                                        </Link>
                                    )
                                )}
                            </li>

                        ))}
                    </ul>
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