"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Scale, 
  Check, 
  ArrowRight,
  Trophy,
  XCircle,
  Handshake,
  Ban,
  Loader2
} from 'lucide-react';

export default function CaseOutcomeForm() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id;

  const [loading, setLoading] = useState(false);
  const [caseData, setCaseData] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    outcome_type: '',
    outcome_summary: '',
    date_resolved: '',
    money_saved: '',
    money_recovered: '',
    court_avoided: null,
    hired_attorney: null,
    ai_helpfulness_rating: null,
    feedback_text: '',
    would_recommend: null,
    testimonial_consent: false
  });

  // Fetch case data on mount
  useEffect(() => {
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  const fetchCaseData = async () => {
    try {
      const response = await fetch(`/api/case/${caseId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch case data');
      }

      const result = await response.json();
      setCaseData(result.data || result);
    } catch (err) {
      console.error('Error fetching case:', err);
      setError('Failed to load case data');
    }
  };

  const statusOptions = [
    { id: 'won', label: 'Won', icon: Trophy, desc: 'Judgment in favor' },
    { id: 'settled', label: 'Settled', icon: Handshake, desc: 'Mutual agreement' },
    { id: 'dropped', label: 'Dropped', icon: Ban, desc: 'Case withdrawn' },
    { id: 'lost', label: 'Lost', icon: XCircle, desc: 'Judgment against' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const isFormValid = formData.outcome_type && formData.outcome_summary && formData.date_resolved;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Calculate days to resolution
      const caseCreatedDate = new Date(caseData.created_at);
      const resolvedDate = new Date(formData.date_resolved);
      const daysToResolution = Math.floor((resolvedDate - caseCreatedDate) / (1000 * 60 * 60 * 24));

      const payload = {
        all_case_id: caseId,
        outcome_type: formData.outcome_type,
        outcome_summary: formData.outcome_summary,
        money_saved: formData.money_saved || null,
        money_recovered: formData.money_recovered || null,
        court_avoided: formData.court_avoided ?? false,
        hired_attorney: formData.hired_attorney ?? false,
        ai_helpfulness_rating: formData.ai_helpfulness_rating,
        feedback_text: formData.feedback_text || null,
        would_recommend: formData.would_recommend,
        testimonial_consent: formData.testimonial_consent,
        days_to_resolution: daysToResolution >= 0 ? daysToResolution : null
      };

      console.log('Submitting outcome:', payload);

      const response = await fetch(`/api/case/${caseId}/outcome`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit outcome');
      }

      if (data.success) {
        alert('Case outcome submitted successfully!');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error submitting outcome:', err);
      setError(err.message || 'Failed to submit outcome. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!caseData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBFAF9]">
        <div className="text-gray-500">Loading case data...</div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6" />
              <span className="font-semibold text-lg">Advocate</span>
            </div>
            {/* <span className="text-gray-500 text-sm hidden sm:inline">
              | {formatIssueType(caseData.issue_type)} • {caseData.location_city}
            </span> */}
          </div>
          <Link href="/dashboard">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </Link>
        </div>
      </div>

      <section className="py-10 bg-[#FBFAF9] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/dashboard">
          <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </button>
        </Link>

        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Case <span className="italic">Outcome</span>
          </h2>
          <p className="text-sm text-gray-600/80 font-inter mb-6">
            Share how your situation was resolved so we can improve our guidance
          </p>
          
          {/* Case Context Card */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-2xl mx-auto">
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {caseData.issue_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </p>
              <p className="text-xs text-gray-500 line-clamp-2">
                {caseData.situation_description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Started: {new Date(caseData.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Step 1: Resolution Details */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                1
              </span>
              Resolution Details
            </label>
            
            {/* Status Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.outcome_type === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('outcome_type', option.id)}
                    type="button"
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-yellow-500/80 cursor-pointer group ${
                      isSelected 
                        ? 'border-2 border-[#F59F0A] bg-[#FAF5ED]' 
                        : 'border-2 border-gray-300/70 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 transition-colors ${isSelected ? 'text-[#F59F0A]' : 'text-gray-500 group-hover:text-gray-500'}`} />
                    <div className="text-[13px] font-[600] text-slate-800">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Date and Summary - FIXED SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="col-span-1 space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Resolved</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date_resolved}
                    onChange={(e) => handleInputChange('date_resolved', e.target.value)}
                    min={caseData.created_at?.split('T')[0]}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outcome Summary</label>
                {/* 
                   FIXED: 
                   1. Changed rows from 1 to 3 to accommodate wrapping text on mobile.
                   2. Removed 'overflow-hidden' so placeholder doesn't get cut off.
                   3. Removed fixed minHeight style, used Tailwind class instead.
                */}
                <textarea
                  rows={3}
                  value={formData.outcome_summary}
                  onChange={(e) => handleInputChange('outcome_summary', e.target.value)}
                  placeholder="Describe how the case ended in your own words..."
                  className="w-full px-4 py-3 md:py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors resize-none min-h-[80px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Step 2: Impact & Financials */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                2
              </span>
              Impact & Financials <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.money_saved}
                  onChange={(e) => handleInputChange('money_saved', e.target.value)}
                  placeholder="Money Saved (e.g. attorney fees)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.money_recovered}
                  onChange={(e) => handleInputChange('money_recovered', e.target.value)}
                  placeholder="Money Recovered (e.g. deposit)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Boolean Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="p-4 rounded-xl border-2 border-gray-300/70 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scale className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-semibold text-slate-800">Did you avoid court?</span>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleInputChange('court_avoided', true)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.court_avoided === true ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('court_avoided', false)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.court_avoided === false ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border-2 border-gray-300/70 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-semibold text-slate-800">Hired an attorney?</span>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleInputChange('hired_attorney', true)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.hired_attorney === true ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('hired_attorney', false)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.hired_attorney === false ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Feedback */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                3
              </span>
              Feedback <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            
            <div className="p-6 rounded-xl border-2 border-gray-300/70 bg-white space-y-6">
              {/* AI Helpfulness Rating */}
              <div>
                <label className="block text-center text-sm font-semibold text-slate-800 mb-4">
                  How helpful was the AI guidance? (0 - Not helpful, 5 - Very helpful)
                </label>
                <div className="flex justify-between max-w-sm mx-auto">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleInputChange('ai_helpfulness_rating', num)}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 rounded-full text-xs sm:text-sm font-bold border-2 transition-all duration-200
                        ${formData.ai_helpfulness_rating === num 
                          ? 'bg-[#F59F0A] border-[#F59F0A] text-white scale-110 shadow-md' 
                          : 'border-gray-200 text-gray-400 hover:border-[#F59F0A] hover:text-[#F59F0A]'}
                      `}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback Text */}
              <textarea
                rows={3}
                value={formData.feedback_text}
                onChange={(e) => handleInputChange('feedback_text', e.target.value)}
                placeholder="What worked well? What could be improved?"
                className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F59F0A] focus:outline-none transition-colors text-sm resize-none"
              />

              {/* Would Recommend */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-sm font-semibold text-slate-800">Would you recommend Advocate to others?</span>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleInputChange('would_recommend', true)}
                    className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${formData.would_recommend === true ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('would_recommend', false)}
                    className={`px-4 py-2 rounded-md text-xs font-semibold transition-all ${formData.would_recommend === false ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Testimonial Consent */}
              <div className="flex items-start gap-3 pt-4 border-t border-gray-200">
                <input
                  type="checkbox"
                  id="testimonial"
                  checked={formData.testimonial_consent}
                  onChange={(e) => handleInputChange('testimonial_consent', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#F59F0A] focus:ring-[#F59F0A]"
                />
                <label htmlFor="testimonial" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                  I consent to having my outcome (anonymized) used as a testimonial to help other users understand how Advocate can help with their legal situations.
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={!isFormValid || loading}
            className={`
              relative inline-flex items-center justify-center gap-2
              whitespace-nowrap transition-all duration-300
              bg-[#F7BB57] h-[58px] px-8 rounded-[14px] w-full
              border-t border-white/25
              ${isFormValid && !loading
                ? 'shadow-[0_8px_25px_-5px_rgba(247,187,87,0.5)] hover:brightness-[1.03] active:scale-[0.98] cursor-pointer' 
                : 'shadow-md brightness-[0.98] cursor-not-allowed opacity-60'}
              ${isFormValid && !loading ? 'text-black' : 'text-black/40'}
              font-bold text-[17px] tracking-tight antialiased
            `}
            style={{
              fontFamily: "'Google Sans', 'Outfit', sans-serif"
            }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Case Outcome
                  <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                </>
              )}
            </span>
            
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
          </button>
          
          <p className='text-xs text-gray-500/80 text-center pt-4'>
            Your feedback helps us improve our AI guidance and demonstrate our value to other users facing similar situations.
          </p>
        </form>
      </div>
    </section>
    </>

    
  );
}