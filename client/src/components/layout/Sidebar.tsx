'use client';

import { useRouter, usePathname } from 'next/navigation';
import {
    HomeIcon,
    UserIcon,
    BarChart3,
    Users,
    Edit,
    SettingsIcon,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleNavigation = (path: string) => {
        router.push(path);
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: HomeIcon, path: '/' },
        { name: 'Profile', icon: UserIcon, path: '/profile' },
        { name: 'Analytics', icon: BarChart3, path: '/analytics' },
        { name: 'Users', icon: Users, path: '/users' },
        { name: 'Posts', icon: Edit, path: '/posts' },
        { name: 'Settings', icon: SettingsIcon, path: '/settings' },
    ];

    return (
        <>
            {/* Sidebar - collapsible on desktop, overlay on mobile */}
            <aside className={cn(
                "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gray-900/90 backdrop-blur-lg z-40 transform transition-all duration-300 ease-in-out md:static md:h-[calc(100vh-4rem)]",
                sidebarOpen ? "w-64 translate-x-0" : "w-20 translate-x-0",
                "md:translate-x-0"
            )}>
                <div className="p-3">
                    {/* Sidebar toggle button for desktop */}
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn(
                                "p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300 text-gray-300",
                                sidebarOpen ? "mr-0" : "mr-3"
                            )}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <nav className="mt-4">
                        <ul className="space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <li key={item.path} className={cn(!sidebarOpen && "flex justify-center")}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className={cn(
                                                "flex items-center space-x-3 p-3 rounded-lg transition-colors duration-300 text-white w-full",
                                                isActive ? "bg-gray-800/50" : "hover:bg-gray-800",
                                                !sidebarOpen && "justify-center px-3"
                                            )}
                                            title={!sidebarOpen ? item.name : undefined}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {sidebarOpen && <span>{item.name}</span>}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </>
    );
}
