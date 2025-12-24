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
      // Store the token in localStorage
      localStorage.setItem('token', data.login.token);
      // Redirect to home page
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
      console.error('Error during login:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:60px_60px] opacity-10"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full opacity-40 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-r from-cyan-900 to-blue-900 rounded-full opacity-40 blur-3xl"></div>
      
      <Card className="w-full max-w-md border-0 bg-gray-900/90 backdrop-blur-lg relative z-10 transition-all duration-500">
        <CardHeader className="text-center space-y-2 pb-2 pt-8 px-8">
          <div className="mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <LogInIcon className="text-white w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
        <CardContent className="px-8 pb-6">
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-2 relative">
              <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-5 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 bg-gray-800" 
                />
              </div>
            </div>
            
            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
              <div className="relative">
                <LockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 py-5 text-white border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-300 bg-gray-800" 
                />
                <button 
                  type="button" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <Checkbox id="remember" className="border-gray-300" />
                <Label htmlFor="remember" className="text-gray-300 text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="#" className="text-sm text-indigo-400 hover:underline font-medium transition-colors duration-300">
                Forgot password?
              </Link>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 px-8 pb-8">
          <Button 
            type="submit"
            className="w-full py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
          <div className="text-center text-sm text-gray-400 pt-2 transition-colors duration-300">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-400 hover:underline font-semibold pl-1 transition-colors duration-300">
              Sign up
            </Link>
          </div>
        </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;