'use client';

import { useState, useEffect } from 'react';
import RealDashboard from '../../../components/RealDashboard';
import DemoDashboard from '../../../components/DemoDashboard';

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFAF9] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF9500]"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <RealDashboard />;
  }

  return <DemoDashboard />;
}