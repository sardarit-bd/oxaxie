import React from 'react';
import { Scale, Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FBFAF9] gap-4">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating spinner */}
        <Loader2 
          className="text-[#f59e0b] animate-spin" 
          size={64} 
          strokeWidth={1.5}
        />
        
        {/* Inner static branding icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Scale 
            className="text-[#1a1a1a] opacity-80" 
            size={24} 
            strokeWidth={2} 
          />
        </div>
      </div>
      
      <p className="text-[#666] font-serif animate-pulse">
        Loading Advocate...
      </p>
    </div>
  );
}