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
                "fixed top-16 left-0 h-[calc(100vh-4rem)] bg-background/50 backdrop-blur-xl z-40 transform transition-all duration-500 ease-in-out md:static md:h-[calc(100vh-4rem)] border-r border-border/50",
                sidebarOpen ? "w-64 translate-x-0" : "w-20 translate-x-0",
                "md:translate-x-0"
            )}>
                <div className="p-4 flex flex-col h-full">
                    {/* Sidebar toggle button for desktop */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn(
                                "p-2 rounded-xl hover:bg-secondary transition-all duration-300 text-muted-foreground hover:text-foreground border border-transparent hover:border-border",
                                !sidebarOpen && "mx-auto"
                            )}
                        >
                            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                    </div>

                    <nav className="flex-1">
                        <ul className="space-y-1.5">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <li key={item.path}>
                                        <button
                                            onClick={() => handleNavigation(item.path)}
                                            className={cn(
                                                "group flex items-center p-3 rounded-xl transition-all duration-300 w-full relative overflow-hidden",
                                                isActive
                                                    ? "text-primary font-semibold"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
                                                !sidebarOpen && "justify-center"
                                            )}
                                            title={!sidebarOpen ? item.name : undefined}
                                        >
                                            {/* Active indicator */}
                                            {isActive && (
                                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                                            )}

                                            <item.icon className={cn(
                                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
                                                isActive && "text-primary"
                                            )} />

                                            {sidebarOpen && (
                                                <span className="ml-3 text-sm tracking-wide transition-opacity duration-300">
                                                    {item.name}
                                                </span>
                                            )}

                                            {/* Minimal glow on active */}
                                            {isActive && (
                                                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer or extra info could go here */}
                    {sidebarOpen && (
                        <div className="mt-auto p-4 bg-secondary/30 rounded-2xl border border-border/50">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Status</p>
                            <div className="flex items-center text-xs text-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                                System Online
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </>
    );
}
