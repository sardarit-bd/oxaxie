'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, MessageSquare, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState(null);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FBFAF9] px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-gray-500">Loading cases...</div>
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
                        className="flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#ffa70a] text-gray-900 font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        <Plus size={18} />
                        <span>New Case</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Cases List or Empty State */}
                {cases.length === 0 ? (
                    /* Empty State Card */
                    <div className="bg-[#FFFFFF] rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 md:p-16">
                        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <FileText size={36} className="text-gray-400" />
                            </div>

                            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                                No cases yet
                            </h2>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                Start by creating a new case to get legal guidance for your situation.
                            </p>

                            <button 
                                onClick={handleNewCase}
                                className="flex items-center justify-center gap-2 bg-[#FF9500] hover:bg-[#FFA70A] text-gray-900 font-medium px-4 py-2.5 rounded-lg transition-colors duration-200 shadow-sm"
                            >
                                <Plus size={18} />
                                <span>Create Your First Case</span>
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
                                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Category and Status Badges */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(caseItem.issue_type)}`}>
                                                {formatIssueType(caseItem.issue_type)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                                                {caseItem.status}
                                            </span>
                                        </div>

                                        {/* Case Description (as title) */}
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {truncateText(caseItem.situation_description, 100)}
                                        </h3>

                                        {/* Case Meta Info */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <MessageSquare size={16} className="text-gray-400" />
                                                <span>{caseItem.location_city}, {caseItem.location_state}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={16} className="text-gray-400" />
                                                <span>{formatDate(caseItem.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow Icon */}
                                    <ChevronRight 
                                        size={20} 
                                        className="text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0 mt-1"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination (if needed) */}
                {pagination && (pagination.nextPageUrl || pagination.prevPageUrl) && (
                    <div className="flex justify-center gap-4 mt-8">
                        {pagination.prevPageUrl && (
                            <button
                                onClick={() => fetchCases(pagination.currentPage - 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        {pagination.nextPageUrl && (
                            <button
                                onClick={() => fetchCases(pagination.currentPage + 1)}
                                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}