// components/RealDashboard.js
'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, MessageSquare, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function RealDashboard() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState(null);
    const [updatingCaseId, setUpdatingCaseId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchCases();
    }, []);

    const fetchCases = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/case/user/all-cases?page=${page}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to fetch cases');

            const result = await response.json();
            
            if (result.success && result.data) {
                setCases(result.data.data || []);
                setPagination({
                    currentPage: result.data.current_page,
                    perPage: result.data.per_page,
                    total: result.data.to,
                    nextPageUrl: result.data.next_page_url,
                    prevPageUrl: result.data.prev_page_url,
                });
            }
        } catch (err) {
            console.error('Error fetching cases:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkResolved = async (caseId, e) => {
        e.stopPropagation();
        setUpdatingCaseId(caseId);
        try {
            const response = await fetch(`/api/case/${caseId}/mark-resolved`, {
                method: 'PATCH',
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update case status');
            
            toast.success('Case marked as resolved!');
            setCases(prevCases => prevCases.map(c => c.id === caseId ? { ...c, status: 'resolved' } : c));
        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setUpdatingCaseId(null);
        }
    };

    const handleNewCase = () => router.push('/new-case');
    const handleCaseClick = (caseId) => router.push(`/case/${caseId}`);

    // Helpers
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'resolved': return 'bg-blue-100 text-blue-700';
            case 'archived':
            case 'closed': return 'bg-gray-100 text-gray-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    const formatIssueType = (type) => {
        const types = { 'landlord_tenant': 'Landlord/Tenant', 'employment': 'Employment', 'family': 'Family', 'business': 'Business', 'criminal': 'Criminal', 'consumer': 'Consumer', 'personal_injury': 'Personal Injury' };
        return types[type] || type.replace(/_/g, ' ');
    };

    const getCategoryColor = (type) => {
        const colors = { 'employment': 'bg-slate-100 text-slate-700', 'landlord_tenant': 'bg-slate-100 text-slate-700', 'family': 'bg-purple-100 text-purple-700', 'business': 'bg-blue-100 text-blue-700', 'criminal': 'bg-red-100 text-red-700', 'consumer': 'bg-green-100 text-green-700', 'personal_injury': 'bg-orange-100 text-orange-700' };
        return colors[type] || 'bg-gray-100 text-gray-700';
    };

    const truncateText = (text, maxLength = 80) => (!text || text.length <= maxLength) ? text : text.substring(0, maxLength) + '...';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-serif">Your Cases</h1>
                        <p className="text-base text-gray-600">Manage your legal matters and get guidance</p>
                    </div>
                    <button onClick={handleNewCase} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#FFA70A] text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors shadow-sm cursor-pointer">
                        <Plus size={18} />
                        <span className='text-sm font-semibold'>New Case</span>
                    </button>
                </div>

                {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}

                {cases.length === 0 ? (
                    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 md:p-16 text-center">
                        <FileText size={36} className="text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No cases yet</h2>
                        <p className="text-gray-600 mb-8">Start by creating a new case to get legal guidance.</p>
                        <button onClick={handleNewCase} className="bg-[#FF9500] hover:bg-[#FFA70A] text-gray-900 font-semibold px-6 py-2 rounded-lg shadow-sm cursor-pointer">Create First Case</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cases.map((caseItem) => (
                            <div key={caseItem.id} onClick={() => handleCaseClick(caseItem.id)} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200 group cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(caseItem.issue_type)}`}>{formatIssueType(caseItem.issue_type)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>{caseItem.status}</span>
                                            {caseItem.status === 'active' && (
                                                <button onClick={(e) => handleMarkResolved(caseItem.id, e)} disabled={updatingCaseId === caseItem.id} className="px-3 py-1 bg-[#04174A] hover:bg-[#05215e] text-gray-50 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap">
                                                    {updatingCaseId === caseItem.id ? 'Updating...' : 'Mark Resolved'}
                                                </button>
                                            )}
                                        </div>
                                        <h3 className="text-lg text-gray-900 mb-4 font-medium break-words line-clamp-2">{truncateText(caseItem.situation_description, 100)}</h3>
                                        <div className="flex justify-between items-start pt-2 border-t border-gray-50">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600"><MessageSquare size={15} className="text-gray-400" />{caseItem.location_city}, {caseItem.location_state}</div>
                                                <div className="flex items-center gap-1.5 text-sm text-gray-600"><Clock size={15} className="text-gray-400" />{formatDate(caseItem.created_at)}</div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 pl-2">
                                                <a href={`/feedback/${caseItem.id}`} onClick={(e) => e.stopPropagation()} className="text-sm text-gray-600 hover:text-blue-800 font-medium hover:underline">Response Feedback</a>
                                                {caseItem.status === 'resolved' && <a href={`/case/${caseItem.id}/outcome`} onClick={(e) => e.stopPropagation()} className="text-sm text-gray-600 hover:text-green-800 font-medium hover:underline">Case Outcome</a>}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-gray-300 group-hover:text-gray-500 mt-1" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Pagination */}
                {pagination && (pagination.nextPageUrl || pagination.prevPageUrl) && (
                    <div className="flex justify-center gap-4 mt-8 pb-8">
                        {pagination.prevPageUrl && <button onClick={() => fetchCases(pagination.currentPage - 1)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">Previous</button>}
                        {pagination.nextPageUrl && <button onClick={() => fetchCases(pagination.currentPage + 1)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm">Next</button>}
                    </div>
                )}
            </div>
        </div>
    );
}