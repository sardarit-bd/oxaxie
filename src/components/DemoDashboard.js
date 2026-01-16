// components/DemoDashboard.js
'use client';

import { Plus, FileText, MessageSquare, Clock, ChevronRight, Eye, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DemoDashboard() {
    const router = useRouter();
    const [showBanner, setShowBanner] = useState(true);

    const mockCases = [
        {
            id: 101,
            issue_type: 'employment',
            status: 'active',
            situation_description: 'I was recently terminated from my job without any prior warning or written notice. I believe this violates my employment contract regarding severance pay.',
            location_city: 'San Francisco',
            location_state: 'CA',
            created_at: '2023-10-24T10:30:00Z',
        },
        {
            id: 102,
            issue_type: 'landlord_tenant',
            status: 'resolved',
            situation_description: 'My landlord has refused to return my security deposit of $1,500, citing damages that were already present when I moved in.',
            location_city: 'Austin',
            location_state: 'TX',
            created_at: '2023-09-15T14:20:00Z',
        },
    ];

    // Helpers (Same as Real Dashboard)
    const formatDate = (d) => { if(!d) return ''; const date = new Date(d); return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`; };
    const getStatusColor = (s) => { const map = { 'active': 'bg-green-100 text-green-700', 'resolved': 'bg-blue-100 text-blue-700', 'pending': 'bg-yellow-100 text-yellow-700' }; return map[s] || 'bg-blue-100 text-blue-700'; };
    const formatIssueType = (t) => { const map = { 'landlord_tenant': 'Landlord/Tenant', 'employment': 'Employment', 'family': 'Family', 'business': 'Business' }; return map[t] || t; };
    const getCategoryColor = (t) => { const map = { 'employment': 'bg-slate-100 text-slate-700', 'landlord_tenant': 'bg-slate-100 text-slate-700' }; return map[t] || 'bg-gray-100 text-gray-700'; };
    const truncateText = (t, l=80) => (!t || t.length <= l) ? t : t.substring(0, l) + '...';

    return (
        <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto">
                {showBanner && (
                <div className="bg-amber-500 text-white px-4 py-2 sm:px-6 sm:py-3 flex justify-between items-center shadow-sm z-50 relative mb-6 rounded-lg">
                    <div className="flex items-center gap-2"><Eye size={18} className="animate-pulse" /><span className="text-sm font-semibold">You are viewing a Demo Dashboard</span></div>
                    <button onClick={() => setShowBanner(false)}><X size={18} /></button>
                </div>
            )}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-serif">Your Cases</h1>
                        <p className="text-base text-gray-600">Manage your legal matters and get guidance</p>
                    </div>
                    <button onClick={() => router.push('/signup')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#ffa70a] text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer">
                        <Plus size={18} />
                        <span className='text-sm font-semibold'>New Case</span>
                    </button>
                </div>

                <div className="space-y-4">
                    {mockCases.map((caseItem) => (
                        <div key={caseItem.id} onClick={() => router.push('/case/demo')} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200 group cursor-pointer">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(caseItem.issue_type)}`}>{formatIssueType(caseItem.issue_type)}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>{caseItem.status}</span>
                                    </div>
                                    <h3 className="text-lg text-gray-900 mb-4 font-medium break-words line-clamp-2">{truncateText(caseItem.situation_description, 100)}</h3>
                                    <div className="flex justify-between items-start pt-2 border-t border-gray-50">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600"><MessageSquare size={15} className="text-gray-400" />{caseItem.location_city}, {caseItem.location_state}</div>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600"><Clock size={15} className="text-gray-400" />{formatDate(caseItem.created_at)}</div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to manage your own cases?</h3>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => router.push('/signup')} className="bg-[#FF9500] hover:bg-[#FFA70A] text-white font-semibold px-6 py-2 rounded-lg shadow-sm cursor-pointer">Get Started Free</button>
                        <button onClick={() => router.push('/pricing')} className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-2 rounded-lg border border-gray-300 shadow-sm cursor-pointer">View Pricing</button>
                    </div>
                </div>
            </div>
        </div>
    );
}