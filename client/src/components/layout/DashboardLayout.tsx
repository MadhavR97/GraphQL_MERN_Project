'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground">
            {/* Subtle background glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
            </div>

            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <div className="flex pt-16 relative z-10">
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                {/* Main content */}
                <main className="flex-1 p-6 transition-all duration-300">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
