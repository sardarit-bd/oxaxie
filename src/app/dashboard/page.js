'use client';
import { Plus, FileText } from 'lucide-react';

export default function Dashboard() {
    
    return (
        <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-2">
                    Your Cases
                    </h1>
                    <p className="text-base text-gray-600">
                    Manage your legal matters and get guidance
                    </p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-[#FFA70A] hover:bg-[#FF9500] text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm">
                    <Plus size={20} />
                    <span>New Case</span>
                </button>
                </div>

                {/* Empty State Card */}
                <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 md:p-16">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    {/* Icon */}
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FileText size={36} className="text-gray-400" />
                    </div>

                    {/* Text Content */}
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    No cases yet
                    </h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                    Start by creating a new case to get legal guidance for your situation.
                    </p>

                    {/* CTA Button */}
                    <button className="flex items-center justify-center gap-2 bg-[#FFA70A] hover:bg-[#FF9500] text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-sm">
                    <Plus size={20} />
                    <span>Create Your First Case</span>
                    </button>
                </div>
                </div>
            </div>
        </div>
  );
}