'use client';

import { 
  Bell, 
  Search, 
  Menu,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick?: () => void;
  userName?: string;
}

export default function Navbar({ onMenuClick, userName = 'Admin' }: NavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  return (
    <nav className="h-16 bg-slate-900 border-b border-purple-900/50 flex items-center justify-between px-6 shadow-lg">
      {/* Left Section - Mobile Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Cari sesuatu..."
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-purple-900/50 rounded-lg text-white placeholder-purple-400/70 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Right Section - Notifications & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="relative p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Notification Dropdown */}
          {showNotification && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-purple-900/50 rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-purple-900/50">
                <h3 className="font-semibold text-white">Notifikasi</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <div className="p-4 hover:bg-purple-900/20 cursor-pointer border-b border-purple-900/30">
                  <p className="text-sm text-purple-200">Presensi berhasil disimpan</p>
                  <p className="text-xs text-purple-400 mt-1">5 menit yang lalu</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="hidden sm:flex p-2 rounded-lg hover:bg-purple-900/30 text-purple-300 transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-900/30 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-purple-400">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-purple-400 hidden md:block" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-purple-900/50 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-4 border-b border-purple-900/50">
                <p className="font-medium text-white">{userName}</p>
                <p className="text-sm text-purple-400">admin@salaryapp.com</p>
              </div>
              <div className="py-2">
                <a href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-200 hover:bg-purple-900/30 transition-colors">
                  <User className="w-4 h-4" />
                  Profil Saya
                </a>
                <a href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-200 hover:bg-purple-900/30 transition-colors">
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </a>
              </div>
              <div className="border-t border-purple-900/50 py-2">
                <button
                  onClick={() => {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    window.location.href = '/sign-in';
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}