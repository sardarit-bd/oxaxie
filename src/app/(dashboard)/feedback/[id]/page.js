"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  XCircle, 
  Clock, 
  RotateCcw,
  FileText,
  X,
  ArrowRight
} from "lucide-react";

export default function ResponseFeedbackForm() {
  const params = useParams();
  const router = useRouter();
  const caseId = params.id; 

  const [formData, setFormData] = useState({
    response_type: "",           
    response_description: "",    
    response_date: "",          
    action_taken_date: "",      
  });

  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleTypeSelect = (typeValue) => {
    setFormData((prev) => ({ ...prev, response_type: typeValue }));
    setError("");
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      const totalFiles = files.length + selectedFiles.length;

      if (totalFiles > 5) {
        setError("Maximum 5 files allowed");
        return;
      }

      const invalidFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        setError("Some files exceed 10MB limit");
        return;
      }

      const filesWithId = selectedFiles.map(file => {
        file.id = Math.random().toString(36).substr(2, 9);
        return file;
      });

      setFiles(prev => [...prev, ...filesWithId]);
      setError("");
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const feedbackResponse = await fetch(`/api/feedback/cases/${caseId}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          response_type: formData.response_type,
          response_description: formData.response_description,
          response_date: formData.response_date,
          action_taken_date: formData.action_taken_date || null,
        }),
      });

      const feedbackData = await feedbackResponse.json();
      
      if (!feedbackResponse.ok) {
        throw new Error(feedbackData.message || "Failed to submit feedback");
      }

      const feedbackId = feedbackData.data.id;

      if (files.length > 0) {
        const formDataFiles = new FormData();
        files.forEach((file) => {
          formDataFiles.append("documents[]", file);
        });

        await fetch(`/api/feedback/${feedbackId}/documents`, {
          method: "POST",
          credentials: "include",
          body: formDataFiles,
        });
      }

      router.push(`/case/${caseId}`);

    } catch (err) {
      console.error("Submission error:", err);
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const responseTypes = [
    { id: 'complied', label: 'Complied', icon: CheckCircle2, desc: 'Agreed & followed through' },
    { id: 'partial_compliance', label: 'Partial', icon: HelpCircle, desc: 'Partially agreed' },
    { id: 'refused', label: 'Refused', icon: XCircle, desc: 'Declined or disagreed' },
    { id: 'no_response', label: 'No Response', icon: Clock, desc: 'Silence/Ignored' },
    { id: 'counter_offer', label: 'Counter-offer', icon: RotateCcw, desc: 'New proposal made' },
  ];

  const isFormValid = formData.response_type && formData.response_date && formData.response_description.length >= 10;

  return (
    <section className="py-10 bg-[#FBFAF9] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link href={`/dashboard`}>
          <button className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8 cursor-pointer font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </button>
        </Link>

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gray-900 mb-4">
            Response <span className="italic">Feedback</span>
          </h1>
          <p className="text-sm text-gray-600/80 font-inter">
            Track how the opposing party responded to your actions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Response Type (Replaced Select with Cards) */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                1
              </span>
              Response Type
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {responseTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.response_type === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      type="button"
                      className={`p-3 rounded-xl border-2 text-left transition-all duration-200 hover:border-yellow-500/80 cursor-pointer group flex flex-col justify-between h-full ${
                        isSelected ? 'border-2 border-[#F59F0A] bg-[#FAF5ED]' : 'border-2 border-gray-300/70 hover:border-gray-200 bg-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 transition-colors ${isSelected ? 'text-[#F59F0A]' : 'text-gray-500 group-hover:text-gray-500'}`} />
                      <div>
                        <div className="text-[13px] font-[600] text-slate-800 leading-tight">{type.label}</div>
                        <div className="text-[11px] text-gray-500 mt-1 leading-tight">{type.desc}</div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* Section 2 & 3: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Response Date */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                      2
                  </span>
                  Response Date
                </label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="date"
                        name="response_date"
                        value={formData.response_date}
                        onChange={handleInputChange}
                        max={getTodayDate()}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                        required
                    />
                </div>
            </div>

            {/* Action Taken Date (Optional) */}
            <div className="space-y-4">
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                      3
                  </span>
                  Original Action Date <span className="text-gray-400 font-normal ml-1">(Optional)</span>
                </label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="date"
                        name="action_taken_date"
                        value={formData.action_taken_date}
                        onChange={handleInputChange}
                        max={formData.response_date || getTodayDate()}
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                    />
                </div>
            </div>
          </div>

          {/* Section 4: Response Description */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                4
              </span>
              Response Details
            </label>
            <div className="relative">
              <textarea
                name="response_description"
                rows="6"
                value={formData.response_description}
                onChange={handleInputChange}
                className="w-full px-4 py-4 rounded-xl border-2 border-gray-300/70 text-gray-900 bg-white placeholder:text-gray-400 focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors resize-none"
                placeholder="Describe what they said or did. Include specific details like amounts offered, conditions mentioned, or reasons given..."
                required
                minLength={10}
              />
            </div>
            <p className="text-xs text-gray-500">
              Minimum 10 characters. Be specific - this helps the AI provide better guidance.
            </p>
          </div>

          {/* Section 5: Document Upload */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-xs flex items-center justify-center font-semibold shrink-0">
                5
              </span>
              Upload Documents <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            
            <div className="relative border-2 border-dashed border-gray-300/70 rounded-xl p-8 transition-all hover:border-[#F7BB57]/60 group cursor-pointer text-center bg-gray-50/30">
                <input
                  type="file"
                  id="documentUpload"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="font-semibold text-black leading-tight">Drop files here or click to upload</div>
                  <div className="text-[11px] text-gray-500 mt-1.5">
                    PDF, Images, Word docs (Max 10MB each)
                  </div>
                </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div 
                      key={file.id || file.name}
                      className="flex items-center gap-3 p-3 bg-[#F5F3F1] rounded-lg border border-gray-200/50"
                    >
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-slate-800 truncate flex-1 font-medium">{file.name}</span>
                      <span className="text-[12px] text-gray-400 uppercase">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      <button 
                        onClick={() => removeFile(file.id)}
                        type="button" 
                        className="p-1 transition-colors hover:bg-gray-200/40 rounded cursor-pointer"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            
            {/* Main Submit Button */}
            <button 
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`
                relative inline-flex items-center justify-center gap-2
                whitespace-nowrap transition-all duration-300
                bg-[#F7BB57] py-4 px-8 rounded-[14px] flex-1
                border-t border-white/25
                ${isFormValid && !isSubmitting
                  ? 'shadow-[0_8px_25px_-5px_rgba(247,187,87,0.5)] hover:brightness-[1.03] active:scale-[0.98] cursor-pointer' 
                  : 'shadow-md brightness-[0.98] cursor-not-allowed opacity-60'}
                ${isFormValid && !isSubmitting ? 'text-black' : 'text-black/40'}
                font-bold text-[17px] tracking-tight antialiased
              `}
              style={{ fontFamily: "'Google Sans', 'Outfit', sans-serif" }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Feedback
                    <ArrowRight className="w-5 h-5 stroke-[2.5px]" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}