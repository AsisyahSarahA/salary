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
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
}

interface SidebarUserProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SidebarUser({ isOpen = true, onClose }: SidebarUserProps) {

  const router = useRouter();
  const pathname = usePathname();

  const [userName, setUserName] = useState("User");
  const [isLoaded, setIsLoaded] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.name?.split(" ")[0] || "User");
      } catch {
        setUserName("User");
      }
    }

    setIsLoaded(true);
  }, []);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/sign-in");
  };

  const toggleMenu = (id: string) => {
    setOpenMenu(openMenu === id ? null : id);
  };

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
      children: [
        {
          label: "Ajukan Cuti",
          href: "/pengajuan"
        },
        {
          label: "Riwayat Cuti",
          href: "/riwayat"
        }
      ]
    },
    {
      id: 'gaji',
      label: 'Slip Gaji',
      icon: Wallet,
      href: '/slip'
    },
  ];

  if (!isLoaded) {
    return (
      <aside className="w-64 bg-slate-950 border-r border-purple-900/50 flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-purple-900/50">
          <div className="w-8 h-8 rounded-lg bg-purple-800 animate-pulse" />
        </div>
      </aside>
    );
  }

  return (
    <>
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-purple-900/50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } flex flex-col`}
      >

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-purple-900/50">
          <Link href="/dashboarduser" className="flex items-center gap-3">

            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>

            <div>
              <h1 className="text-lg font-bold text-purple-400">Sar-SalaryApp</h1>
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


        {/* User */}
        <div className="px-6 py-4 border-b border-purple-900/50 bg-purple-900/20">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-purple-400">Karyawan</p>
            </div>

          </div>
        </div>


        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">

          <ul className="space-y-1">

            {menuItems.map((item) => {

              const activeParent =
                item.children?.some(child => isActive(child.href)) ||
                (item.href && isActive(item.href));

              return (

                <li key={item.id}>

                  {item.children ? (

                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                          activeParent
                            ? "bg-purple-700"
                            : "hover:bg-purple-900/30"
                        }`}
                      >

                        <div className="flex items-center gap-3">

                          <item.icon className="w-5 h-5 text-purple-300" />

                          <span className="text-purple-200 font-medium">
                            {item.label}
                          </span>

                        </div>

                        {openMenu === item.id ? (
                          <ChevronDown className="w-4 h-4 text-purple-300" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-purple-300" />
                        )}

                      </button>


                      {openMenu === item.id && (

                        <ul className="ml-10 mt-2 space-y-1">

                          {item.children.map((child) => (

                            <li key={child.href}>

                              <Link
                                href={child.href}
                                className={`block px-3 py-2 rounded-lg text-sm transition ${
                                  isActive(child.href)
                                    ? "bg-purple-600 text-white"
                                    : "text-purple-300 hover:bg-purple-900/30"
                                }`}
                              >
                                {child.label}
                              </Link>

                            </li>

                          ))}

                        </ul>

                      )}

                    </>
                  ) : (

                    <Link
                      href={item.href!}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isActive(item.href!)
                          ? "bg-purple-700 text-white"
                          : "hover:bg-purple-900/30 text-purple-200"
                      }`}
                    >

                      <item.icon className="w-5 h-5" />

                      {item.label}

                    </Link>

                  )}

                </li>

              );

            })}

          </ul>

        </nav>


        {/* Logout */}
        <div className="p-4 border-t border-purple-900/50">

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20"
          >

            <LogOut className="w-5 h-5" />

            Keluar Aplikasi

          </button>

          <p className="text-xs text-purple-400 text-center mt-3">
            © 2026 Sar-SalaryApp
          </p>

        </div>

      </aside>
    </>
  );
}