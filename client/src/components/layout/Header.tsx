'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserIcon, MenuIcon, LogOutIcon } from 'lucide-react';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [currentTime, setCurrentTime] = useState<string | null>(null);

    useEffect(() => {
        setIsClient(true);
        setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth/login');
    };

    return (
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
                        {isClient ? currentTime : '00:00'}
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserIcon className="w-6 h-6 text-gray-300" />
                        <span className="text-gray-300 hidden md:block">User</span>
                    </div>
                    <Button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-md transition-all duration-300 border border-rose-500/20 hover:border-rose-500 flex items-center shadow-sm hover:shadow-rose-500/25"
                    >
                        <LogOutIcon className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}
