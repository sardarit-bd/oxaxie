export default function Footer() {
    return (
        <>
            <footer class="bg-[#1E293E] text-[#FBFAF9] py-12 px-6">
                <div class="max-w-7xl mx-auto">
                    
                    <div class="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div class="flex items-center space-x-2 mb-6 md:mb-0">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
                        </svg>
                        <span class="text-xl tracking-tight font-serif text-white">Advocate</span>
                    </div>

                    <nav class="flex space-x-8 text-sm font-medium">
                        <a href="#" class="hover:text-white text-gray-300/80 transition-colors">How It Works</a>
                        <a href="#" class="hover:text-white text-gray-300/80 transition-colors">Privacy</a>
                        <a href="#" class="hover:text-white text-gray-300/80 transition-colors">Terms</a>
                        <a href="#" class="hover:text-white text-gray-300/80 transition-colors">Contact</a>
                    </nav>
                    </div>

                    <hr class="border-[#FBFAF9] opacity-10 mb-8" />

                    <div class="text-center text-gray-300/60 text-[13.4px] leading-relaxed">
                    <p class="mb-2">
                        Advocate provides educational legal information, not legal advice. 
                        For specific legal matters, consult a licensed attorney in your jurisdiction.
                    </p>
                    <p>© 2026 Advocate. All rights reserved.</p>
                    </div>

                </div>
            </footer>
        </>
    );
}