'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserIcon, MenuIcon, HomeIcon, SettingsIcon, LogOutIcon, BarChart3, Users, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed to true by default for desktop
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      // If not authenticated, redirect to login
      router.push('/auth/login');
    }
    
    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    router.push('/auth/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    // Only close mobile sidebar, keep desktop sidebar open
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-lg border-b border-gray-700 w-full">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 md:hidden"
            >
              <MenuIcon className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-300 hidden md:block">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center space-x-2">
              <UserIcon className="w-6 h-6 text-gray-300" />
              <span className="text-gray-300 hidden md:block">User</span>
            </div>
            <Button 
              onClick={handleLogout}
              className="py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex items-center"
            >
              <LogOutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar - collapsible on desktop, overlay on mobile */}
        <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900/90 backdrop-blur-lg z-40 transform transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64 translate-x-0' : 'w-20 translate-x-0'} md:static md:translate-x-0 md:h-screen`}>
          <div className="p-3">
            {/* Sidebar toggle button for desktop */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-gray-300"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
            
            {sidebarOpen && (
              <nav className="mt-4">
                <ul className="space-y-2">
                  <li>
                    <button 
                      onClick={() => handleNavigation('/')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white bg-gray-800/50"
                    >
                      <HomeIcon className="w-5 h-5" />
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/profile')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <UserIcon className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/analytics')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <BarChart3 className="w-5 h-5" />
                      <span>Analytics</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/users')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <Users className="w-5 h-5" />
                      <span>Users</span>
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => handleNavigation('/settings')}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </nav>
            )}
            
            {/* Collapsed sidebar icons for when sidebar is minimized */}
            {!sidebarOpen && (
              <nav className="mt-4">
                <ul className="space-y-4">
                  <li className="flex justify-center">
                    <button 
                      onClick={() => handleNavigation('/')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Dashboard"
                    >
                      <HomeIcon className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button 
                      onClick={() => handleNavigation('/profile')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Profile"
                    >
                      <UserIcon className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button 
                      onClick={() => handleNavigation('/analytics')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Analytics"
                    >
                      <BarChart3 className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button 
                      onClick={() => handleNavigation('/users')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Users"
                    >
                      <Users className="w-5 h-5" />
                    </button>
                  </li>
                  <li className="flex justify-center">
                    <button 
                      onClick={() => handleNavigation('/settings')}
                      className="p-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-white"
                      title="Settings"
                    >
                      <SettingsIcon className="w-5 h-5" />
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main content */}
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-0 md:ml-64' : 'ml-0 md:ml-20'}`}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
              <p className="text-gray-400">Welcome back! Here's what's happening today.</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
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
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
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
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
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
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
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
              
              <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleNavigation('/profile')}
                    className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white"
                  >
                    <UserIcon className="w-5 h-5 mr-2" />
                    Profile
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('/settings')}
                    className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white"
                  >
                    <SettingsIcon className="w-5 h-5 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    onClick={() => handleNavigation('/analytics')}
                    className="py-6 bg-gray-700/50 hover:bg-gray-700 border border-gray-600 text-white"
                  >
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Analytics
                  </Button>
                  <Button 
                    onClick={handleLogout}
                    className="py-6 bg-red-600/30 hover:bg-red-600/40 border border-red-700 text-white"
                  >
                    <LogOutIcon className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}