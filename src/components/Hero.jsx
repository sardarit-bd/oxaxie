'use client';

import { Globe, FileText, Shield, ArrowRight, Scale } from "lucide-react";
import { Button } from "../components/ui/button";

const Hero = () => {
  const scrollToHowItWorks  = () => {

    const element = document.getElementById("how-it-works");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  const scrollToCaseForm  = () => {

    const element = document.getElementById("case-form");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-8 overflow-hidden bg-[#27334C]">
      
      {/* --- BACKGROUND PATTERN LAYER --- */}
      <div className="absolute inset-0 opacity-12">
        <div 
          className="absolute inset-0 scale-110" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F2F2F2' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '50px 50px',
            filter: 'blur(0.4px)',
          }}
        />
      </div>

      {/* --- GRADIENT OVERLAYS --- */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#27334C] to-transparent z-[1]" />

      {/* --- CONTENT LAYER --- */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center pb-20 pt-8 sm:pt-0">
          
          {/* Badge - Hidden on mobile, flex on sm+ */}
          <div className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-sm font-medium mb-8 backdrop-blur-sm">
            <Shield className="w-4 h-4 font-semibold" />
            <span>AI-Powered Legal Guidance</span>
          </div>

          {/* Main Heading - Now at the top on mobile */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Know Your Rights. <span className="italic">Take Action.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Get clear, actionable legal guidance for your situation. Upload documents, describe your case, and receive personalized advice with draft documents you can use today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            {/* First Button: w-fit ensures it only expands to fit the text + padding */}
            <button onClick={ scrollToCaseForm } className="w-fit sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFAF0B] text-black font-semibold hover:brightness-110 transition-all active:scale-[0.98] h-14 rounded-xl px-10 text-lg shadow-[0_0_20px_rgba(255,175,11,0.3)] cursor-pointer">
              Get Legal Guidance
              <ArrowRight className="w-5 h-5" />
            </button>
            
            {/* Second Button: w-fit allows it to be a different size than the first one */}
            <button onClick={ scrollToHowItWorks } className="w-fit sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white bg-transparent hover:bg-white/10 transition-all active:scale-[0.98] h-14 rounded-xl px-10 text-lg cursor-pointer">
              How It Works
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>Multi-jurisdiction support</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Document generation</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Private & secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[5] pointer-events-none"></div>
    </section>
  );
};
export default Hero;