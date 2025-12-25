'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Bell, Users, BarChart3, UserIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-white">1,254</p>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Active Sessions</p>
              <p className="text-2xl font-bold text-white">128</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Notifications</p>
              <p className="text-2xl font-bold text-white">24</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-500/20 rounded-full">
                <UserIcon className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-white">New user registered</p>
                <p className="text-gray-400 text-sm">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-500/20 rounded-full">
                <BarChart3 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-white">Report generated</p>
                <p className="text-gray-400 text-sm">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-full">
                <SettingsIcon className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <p className="text-white">Settings updated</p>
                <p className="text-gray-400 text-sm">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleNavigation('/profile')}
              className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition-all"
            >
              <UserIcon className="w-5 h-5 mr-2" />
              Profile
            </Button>
            <Button
              onClick={() => handleNavigation('/settings')}
              className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition-all"
            >
              <SettingsIcon className="w-5 h-5 mr-2" />
              Settings
            </Button>
            <Button
              onClick={() => handleNavigation('/analytics')}
              className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white rounded-xl transition-all"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </Button>
            <Button
              onClick={handleLogout}
              className="py-6 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-xl transition-all"
            >
              <LogOutIcon className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
