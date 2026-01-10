'use client';

import { useRouter } from "next/navigation";
import { Scale, Menu, LogOut, X } from "lucide-react";
import { useState } from 'react';
import Link from "next/link";

export default function DashboardNavbar({ isLoggedIn = false, userName = null }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await fetch('/api/auth/logout', { 
                method: 'POST',
                credentials: 'include'
            });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
                        <Scale className="text-gray-900" size={24} strokeWidth={2} />
                        <span className="text-xl font-semibold text-gray-900">Advocate</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {isLoggedIn ? (
                            <>
                                <Link href="/pricing">
                                    <button 
                                    onClick={() => router.push('/pricing')}
                                    className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Pricing
                                    </button>
                                </Link>

                                <Link href="/profile">
                                    <button 
                                    onClick={() => router.push('/profile')}
                                    className="text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Profile
                                    </button>
                                </Link>
                                <button 
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm font-medium transition-colors hover:bg-[#FFA70A] px-3 py-2 rounded-xl font-semibold cursor-pointer"
                                >
                                    <LogOut size={16} className="text-gray-800"/>
                                    <span className="ml-1">Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => router.push('/login')}
                                    className="text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => router.push('/signup')}
                                    className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-5 py-2 rounded-md text-sm font-semibold transition-colors cursor-pointer"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200">
                    <div className="px-4 py-3 space-y-2">
                        {isLoggedIn ? (
                            <>
                                <button 
                                    onClick={() => {
                                        router.push('/pricing');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
                                >
                                    Pricing
                                </button>

                                <button 
                                    onClick={() => {
                                        router.push('/profile');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
                                >
                                    Profile
                                </button>


                                <button 
                                    onClick={() => {
                                        handleSignOut();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-2 text-left text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
                                >
                                    <LogOut size={16} />
                                    <span>Sign Out</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => {
                                        router.push('/login');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full text-left text-gray-700 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 rounded-md"
                                >
                                    Sign In
                                </button>
                                <button 
                                    onClick={() => {
                                        router.push('/signup');
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold transition-colors"
                                >
                                    Get Started
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}