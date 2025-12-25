'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { EyeIcon, EyeOffIcon, MailIcon, LockIcon, LogInIcon } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '@/lib/mutations';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [login, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      window.location.href = '/';
    },
    onError: (error) => {
      setError(error.message || 'An error occurred during login');
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({
        variables: { email, password }
      });
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden selection:bg-primary/30 selection:text-primary-foreground">
      {/* Premium background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <Card className="w-full max-w-md border border-border/50 bg-card/50 backdrop-blur-2xl relative z-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

        <CardHeader className="text-center space-y-2 pb-6 pt-10 px-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
            <LogInIcon className="text-primary-foreground w-8 h-8" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-foreground tracking-tight italic">Pulse</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Welcome back! Sign in to continue
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-10 pb-6">
            <div className="space-y-5">
              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground text-xs font-bold uppercase tracking-widest ml-1">Email Address</Label>
                <div className="relative group">
                  <MailIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-secondary/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground text-xs font-bold uppercase tracking-widest ml-1">Secret Key</Label>
                <div className="relative group">
                  <LockIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 group-focus-within:text-primary transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-11 h-12 rounded-xl bg-secondary/50 border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="w-4 h-4 rounded border-border" />
                  <Label htmlFor="remember" className="text-muted-foreground text-sm font-medium cursor-pointer select-none">
                    Stay signed in
                  </Label>
                </div>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 font-bold transition-colors">
                  Lost access?
                </Link>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-6 px-10 pb-10">
            <Button
              type="submit"
              className="w-full h-14 text-base font-bold bg-primary text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Commence Journey'}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Don't have an access key?{' '}
              <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-extrabold transition-colors underline decoration-primary/20 underline-offset-4">
                Redeem Invitation
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;