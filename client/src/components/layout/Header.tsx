'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserIcon, MenuIcon, LogOutIcon, Activity } from 'lucide-react';

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
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border w-full">
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-xl hover:bg-secondary transition-colors duration-300 md:hidden"
                    >
                        <MenuIcon className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Activity className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
                            Pulse
                        </h1>
                    </div>
                </div>
                <div className="flex items-center space-x-6">
                    <div className="text-sm font-medium text-muted-foreground hidden md:flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        {isClient ? currentTime : '00:00'}
                    </div>
                    <div className="h-6 w-px bg-border hidden md:block" />
                    <div className="flex items-center space-x-3 group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors">
                            <UserIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <span className="text-sm font-medium text-foreground hidden md:block">Madhav</span>
                    </div>
                    <Button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all duration-300 border border-rose-500/10 hover:border-rose-500 flex items-center shadow-sm hover:shadow-rose-500/20"
                    >
                        <LogOutIcon className="w-4 h-4 mr-2" />
                        <span className="text-sm font-bold">Logout</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
