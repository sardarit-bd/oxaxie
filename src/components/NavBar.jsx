import { Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1E293E] border-b border-gray-600/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-foreground text-white" />
            <span className="text-xl tracking-tight font-serif text-white">Advocate</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-gray-300/80 text-semibold">
            <a href="#how-it-works" className="hover:text-gray-100 text-sm">
              How It Works
            </a>
            <a href="/pricing" className="hover:text-gray-100 text-sm">
              Pricing
            </a>
          </div>

          {/* CTA Button */}
          <Link href="/login">
            <Button variant="outline" size="sm" className="bg-[#FFAF0B] text-gray-800 hover:bg-FFB417 font-semibold px-2.5 py-3 border-none rounded rounded-lg cursor-pointer">
            Get Started
          </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
