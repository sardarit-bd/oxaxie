import Link from "next/link";
import CaseForm from "../../../components/CaseForm";
import { ArrowLeft } from "lucide-react";

export default function NewCase() {
    return (
        <div className="min-h-screen bg-[#FBFAF9]">
            {/* Back button */}
            <div className="pt-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/dashboard">
                    <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors bg-transparent border-none cursor-pointer p-0">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to dashboard</span>
                    </button>
                </Link>
            </div>
            <CaseForm />
        </div>
    );
}