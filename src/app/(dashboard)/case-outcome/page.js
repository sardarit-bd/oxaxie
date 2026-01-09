"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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
  Ban
} from 'lucide-react';

export default function CaseOutcomeForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    dateResolved: '',
    summary: '',
    moneySaved: '',
    moneyRecovered: '',
    courtAvoided: null,
    legalHelpNeeded: null,
    npsScore: null,
    feedback: ''
  });

  // Mock status options for the grid
  const statusOptions = [
    { id: 'won', label: 'Won', icon: Trophy, desc: 'Judgment in favor' },
    { id: 'settled', label: 'Settled', icon: Handshake, desc: 'Mutual agreement' },
    { id: 'withdrawn', label: 'Withdrawn', icon: Ban, desc: 'Case dropped' },
    { id: 'lost', label: 'Lost', icon: XCircle, desc: 'Judgment against' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.status && formData.summary; // Basic validation check

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <section className="py-10 bg-[#FBFAF9] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
        </Link>

        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Case <span className="italic">Outcome</span>
          </h2>
          <p className="text-[18px] text-gray-600/80 font-inter">
            Share how your situation was resolved so we can improve our guidance
          </p>
        </div>

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
                const isSelected = formData.status === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleInputChange('status', option.id)}
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

            {/* Date and Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="col-span-1 space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date Resolved</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            onChange={(e) => handleInputChange('dateResolved', e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                        />
                    </div>
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Outcome Summary</label>
                    <textarea
                        rows={1}
                        onChange={(e) => handleInputChange('summary', e.target.value)}
                        placeholder="Describe how the case ended in your own words..."
                        className="w-full px-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors resize-none overflow-hidden min-h-[60px]"
                        style={{ minHeight: '60px' }}
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
              Impact & Financials
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  onChange={(e) => handleInputChange('moneySaved', e.target.value)}
                  placeholder="Money Saved (e.g. Avoided attorney fees)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  onChange={(e) => handleInputChange('moneyRecovered', e.target.value)}
                  placeholder="Money Recovered (e.g. Deposit returned)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                />
              </div>
            </div>

            {/* Boolean Toggles styled as Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                 {/* Court Avoided Toggle */}
                 <div className="p-4 rounded-xl border-2 border-gray-300/70 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Scale className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-semibold text-slate-800">Did you avoid court?</span>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => handleInputChange('courtAvoided', true)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.courtAvoided === true ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('courtAvoided', false)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.courtAvoided === false ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            No
                        </button>
                    </div>
                 </div>

                 {/* Professional Help Toggle */}
                 <div className="p-4 rounded-xl border-2 border-gray-300/70 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-semibold text-slate-800">Professional help needed?</span>
                    </div>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            type="button"
                            onClick={() => handleInputChange('legalHelpNeeded', true)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.legalHelpNeeded === true ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Yes
                        </button>
                        <button
                            type="button"
                            onClick={() => handleInputChange('legalHelpNeeded', false)}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${formData.legalHelpNeeded === false ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
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
              Feedback
            </label>
            
            <div className="p-6 rounded-xl border-2 border-gray-300/70 bg-white">
                <label className="block text-center text-sm font-semibold text-slate-800 mb-6">
                    How helpful was the AI guidance? (0 - Not helpful, 5 - Very helpful)
                </label>
                <div className="flex justify-between max-w-sm mx-auto mb-6">
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                        <button
                            key={num}
                            type="button"
                            onClick={() => handleInputChange('npsScore', num)}
                            className={`
                                w-10 h-10 rounded-full text-sm font-bold border-2 transition-all duration-200
                                ${formData.npsScore === num 
                                    ? 'bg-[#F59F0A] border-[#F59F0A] text-white scale-110 shadow-md' 
                                    : 'border-gray-200 text-gray-400 hover:border-[#F59F0A] hover:text-[#F59F0A]'}
                            `}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                <textarea
                    rows={3}
                    onChange={(e) => handleInputChange('feedback', e.target.value)}
                    placeholder="What worked well? What could be improved?"
                    className="w-full p-4 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#F59F0A] focus:outline-none transition-colors text-sm resize-none"
                />
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
            <span className="relative z-10">
              {loading ? 'Submitting...' : 'Submit Case Outcome'}
            </span>
            
            <ArrowRight 
              className={`
                w-5 h-5 stroke-[2.5px] transition-colors duration-300 relative z-10
                ${isFormValid && !loading ? 'text-black' : 'text-black/40'}
              `} 
            />
            
            <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
          </button>
          
        </form>
      </div>
    </section>
  );
}