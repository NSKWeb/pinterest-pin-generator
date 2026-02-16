// Dashboard Header Component

'use client';

import { useState } from 'react';
import { Bell, User, Search, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/Button';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
  const [isDark, setIsDark] = useState(true);
  const [notifications] = useState(0); // Mock notification count

  const toggleTheme = () => {
    setIsDark(!isDark);
    // In a real app, you'd update the theme context or CSS variables
  };

  return (
    <header className="h-16 bg-gray-900/50 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Title section */}
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400">{subtitle}</p>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-80 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {notifications > 9 ? '9+' : notifications}
            </span>
          )}
        </button>

        {/* Admin profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
          <div className="text-right">
            <div className="text-sm font-medium text-white">Admin</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}