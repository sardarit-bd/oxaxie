'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, MessageSquare, Clock, ChevronRight, Lock, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

export default function Dashboard() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState(null);
    const [updatingCaseId, setUpdatingCaseId] = useState(null);
    const [userPlan, setUserPlan] = useState(null);
    const [isLoadingPlan, setIsLoadingPlan] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchUserPlan();
        fetchCases();
    }, []);

    const fetchUserPlan = async () => {
        try {
            const response = await fetch('/api/user/subscription', {
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                setUserPlan(data.data?.plan || 'free');
            }
        } catch (error) {
            console.error('Error fetching user plan:', error);
            setUserPlan('free');
        } finally {
            setIsLoadingPlan(false);
        }
    };

    const fetchCases = async (page = 1) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/case/user/all-cases?page=${page}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cases');
            }

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

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update case status');
            }

            toast.success('Case marked as resolved!');

            setCases(prevCases => 
                prevCases.map(c => 
                    c.id === caseId 
                        ? { ...c, status: 'resolved' } 
                        : c
                )
            );
        } catch (err) {
            console.error('Error marking case as resolved:', err);
            alert(err.message || 'Failed to mark case as resolved');
        } finally {
            setUpdatingCaseId(null);
        }
    };

    const handleNewCase = () => {
        router.push('/new-case');
    };

    const handleCaseClick = (caseId) => {
        router.push(`/case/${caseId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        } catch (error) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'resolved':
                return 'bg-blue-100 text-blue-700';
            case 'archived':
            case 'closed':
                return 'bg-gray-100 text-gray-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            default:
                return 'bg-blue-100 text-blue-700';
        }
    };

    const formatIssueType = (issueType) => {
        const types = {
            'landlord_tenant': 'Landlord/Tenant',
            'employment': 'Employment',
            'family': 'Family',
            'business': 'Business',
            'criminal': 'Criminal',
            'consumer': 'Consumer',
            'personal_injury': 'Personal Injury',
        };
        return types[issueType] || issueType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const getCategoryColor = (issueType) => {
        const colors = {
            'employment': 'bg-slate-100 text-slate-700',
            'landlord_tenant': 'bg-slate-100 text-slate-700',
            'family': 'bg-purple-100 text-purple-700',
            'business': 'bg-blue-100 text-blue-700',
            'criminal': 'bg-red-100 text-red-700',
            'consumer': 'bg-green-100 text-green-700',
            'personal_injury': 'bg-orange-100 text-orange-700',
        };
        return colors[issueType] || 'bg-gray-100 text-gray-700';
    };

    const truncateText = (text, maxLength = 80) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const canViewCaseHistory = () => {
        return userPlan !== 'free';
    };

    if (loading || isLoadingPlan) {
        return (
            <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-serif">
                            Your Cases
                        </h1>
                        <p className="text-base text-gray-600">
                            Manage your legal matters and get guidance
                        </p>
                    </div>
                    <button 
                        onClick={handleNewCase}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#ffa70a] text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                    >
                        <Plus size={18} />
                        <span className='text-sm font-semibold'>New Case</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Free Plan: No Case History Access */}
                {!canViewCaseHistory() ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12">
                        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                                <Lock size={36} className="text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                Case History Unavailable
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Case history and management features are not available on the Free plan. 
                                Upgrade to Pro to access your case history, track progress, and manage multiple cases.
                            </p>
                            
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 w-full">
                                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                                    With Pro, you'll get:
                                </h3>
                                <ul className="text-sm text-gray-700 space-y-1.5 text-left">
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">✓</span>
                                        <span>Access to case history and timeline</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">✓</span>
                                        <span>Create up to 3 cases per month</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">✓</span>
                                        <span>Unlimited AI chat messages</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-0.5">✓</span>
                                        <span>Download documents in multiple formats</span>
                                    </li>
                                </ul>
                            </div>

                            <button 
                                onClick={() => router.push('/pricing')}
                                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                            >
                                <Zap size={18} fill="currentColor" />
                                <span>Upgrade to Pro</span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Case History for Pro/Pro Plus Users */
                    <>
                        {cases.length === 0 ? (
                            /* Empty State */
                            <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 md:p-16">
                                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <FileText size={36} className="text-gray-400" />
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900 mb-3">No cases yet</h2>
                                    <p className="text-gray-600 mb-8 leading-relaxed">
                                        Start by creating a new case to get legal guidance for your situation.
                                    </p>
                                    <button 
                                        onClick={handleNewCase}
                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#FFA70A] text-gray-900 font-medium px-3 py-2 rounded-lg transition-colors duration-200 shadow-sm cursor-pointer"
                                    >
                                        <Plus size={18} />
                                        <span className='text-sm font-semibold'>Create Your First Case</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Case Cards */
                            <div className="space-y-4">
                                {cases.map((caseItem) => (
                                    <div
                                        key={caseItem.id}
                                        onClick={() => handleCaseClick(caseItem.id)}
                                        className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200 group cursor-pointer"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* Main Content Area */}
                                            <div className="flex-1 min-w-0">
                                                
                                                {/* Badges Header */}
                                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(caseItem.issue_type)}`}>
                                                        {formatIssueType(caseItem.issue_type)}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                                                        {caseItem.status}
                                                    </span>
                                                    
                                                    {caseItem.status === 'active' && (
                                                        <button
                                                            onClick={(e) => handleMarkResolved(caseItem.id, e)}
                                                            disabled={updatingCaseId === caseItem.id}
                                                            className="px-3 py-1 bg-[#04174A] hover:bg-[#05215e] text-gray-50 rounded-full text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                                                        >
                                                            {updatingCaseId === caseItem.id ? 'Updating...' : 'Mark Resolved'}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Title / Description */}
                                                <h3 className="text-lg text-gray-900 mb-4 font-medium break-words line-clamp-2">
                                                    {truncateText(caseItem.situation_description, 100)}
                                                </h3>

                                                {/* Footer: Split Left/Right Columns */}
                                                <div className="flex justify-between items-start pt-2 border-t border-gray-50">
                                                    
                                                    {/* Left Column: Location & Date */}
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <MessageSquare size={15} className="text-gray-400 shrink-0" />
                                                            <span className="truncate max-w-[140px] sm:max-w-none">
                                                                {caseItem.location_city}, {caseItem.location_state}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                            <Clock size={15} className="text-gray-400 shrink-0" />
                                                            <span className="whitespace-nowrap">
                                                                {formatDate(caseItem.created_at)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Right Column: Links (Right Aligned) */}
                                                    <div className="flex flex-col items-end gap-2 pl-2">
                                                        <a 
                                                            href={`/feedback/${caseItem.id}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="text-sm text-gray-600 hover:text-blue-800 font-medium hover:underline text-right"
                                                        >
                                                            Response Feedback
                                                        </a>
                                                        
                                                        {caseItem.status === 'resolved' && (
                                                            <a 
                                                                href={`/case/${caseItem.id}/outcome`}
                                                                onClick={(e) => e.stopPropagation()}
                                                                className="text-sm text-gray-600 hover:text-green-800 font-medium hover:underline text-right"
                                                            >
                                                                Case Outcome
                                                            </a>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>

                                            {/* Arrow Icon */}
                                            <ChevronRight 
                                                size={20} 
                                                className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 mt-1"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && (pagination.nextPageUrl || pagination.prevPageUrl) && (
                            <div className="flex justify-center gap-4 mt-8 pb-8">
                                {pagination.prevPageUrl && (
                                    <button
                                        onClick={() => fetchCases(pagination.currentPage - 1)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Previous
                                    </button>
                                )}
                                {pagination.nextPageUrl && (
                                    <button
                                        onClick={() => fetchCases(pagination.currentPage + 1)}
                                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}