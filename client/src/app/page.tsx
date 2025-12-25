'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Bell, Users, BarChart3, UserIcon, SettingsIcon, LogOutIcon, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight mb-2">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome back, <span className="text-primary font-semibold">Madhav</span>! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Total Users', value: '1,254', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active Sessions', value: '128', icon: BarChart3, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Notifications', value: '24', icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map((stat, i) => (
          <div key={i} className="group p-6 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground tabular-nums">{stat.value}</p>
              </div>
              <div className={`p-4 ${stat.bg} rounded-2xl group-hover:scale-110 transition-transform duration-500`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl bg-card border border-border relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-foreground flex items-center">
                <span className="w-1.5 h-6 bg-primary rounded-full mr-3" />
                Recent Activity
              </h2>
              <Button variant="ghost" className="text-sm text-primary hover:text-primary/80">View All</Button>
            </div>
            <div className="space-y-6">
              {[
                { title: 'New user registered', time: '2 minutes ago', icon: UserIcon, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { title: 'Monthly report generated', time: '1 hour ago', icon: BarChart3, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { title: 'System settings updated', time: '3 hours ago', icon: SettingsIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
                { title: 'New post published', time: '5 hours ago', icon: Bell, color: 'text-amber-400', bg: 'bg-amber-400/10' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center group cursor-pointer">
                  <div className={`p-3 ${activity.bg} rounded-xl mr-4 group-hover:scale-110 transition-transform`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">{activity.title}</p>
                    <p className="text-muted-foreground text-sm">{activity.time}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 rounded-3xl bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-8 flex items-center">
              <span className="w-1.5 h-6 bg-primary rounded-full mr-3" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Profile Settings', path: '/profile', icon: UserIcon, variant: 'secondary' as const },
                { label: 'Application Settings', path: '/settings', icon: SettingsIcon, variant: 'secondary' as const },
                { label: 'View Analytics', path: '/analytics', icon: BarChart3, variant: 'secondary' as const },
                { label: 'Terminate Session', onClick: handleLogout, icon: LogOutIcon, variant: 'destructive' as const },
              ].map((action, i) => (
                <Button
                  key={i}
                  variant={action.variant}
                  onClick={action.onClick || (() => handleNavigation(action.path!))}
                  className={cn(
                    "w-full h-14 justify-start px-4 rounded-2xl transition-all duration-300 border border-transparent hover:border-border group",
                    action.variant === 'secondary' ? "bg-secondary/50 hover:bg-secondary" : "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border-rose-500/10 hover:border-rose-500"
                  )}
                >
                  <action.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="font-semibold">{action.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
