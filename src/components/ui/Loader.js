// components/ui/Loader.js
'use client';

import { Scale } from 'lucide-react'; 

export default function PageLoader() {
  return (
    <div className="min-h-screen w-full bg-[#FBFAF9] flex flex-col items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        
        {/* --- LOGO SECTION --- */}
        {/* Replace this Icon block with your actual logo if you have one: */}
        {/* <Image src="/logo.png" width={50} height={50} alt="Advocate Logo" /> */}
        
        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center">
            <Scale className="text-[#FF9500]" size={32} />
        </div>
        
        {/* --- TEXT SECTION --- */}
        <p className="text-gray-500 font-medium text-sm tracking-wide font-serif">
          Loading Advocate...
        </p>
      </div>
    </div>
  );
}