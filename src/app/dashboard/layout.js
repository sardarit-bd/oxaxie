"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      router.push('/login');
      return;
    }

    try { jwtDecode(token); } catch { localStorage.clear(); router.push('/login'); }

  }, [router]);

  return <>{children}</>;
}