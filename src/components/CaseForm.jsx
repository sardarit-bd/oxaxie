'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import UpgradeModal from './UpgradeModal';
import { 
  Home, 
  Briefcase, 
  FileText, 
  ShoppingBag, 
  Users, 
  HelpCircle, 
  Upload, 
  MapPin, 
  ArrowRight,
  X
} from "lucide-react";

const issueTypes = [
  { id: "landlord_tenant", icon: Home, label: "Landlord/Tenant", description: "Leases, deposits, evictions" },
  { id: "employment", icon: Briefcase, label: "Employment", description: "Wages, wrongful termination" },
  { id: "contracts", icon: FileText, label: "Contracts", description: "Disputes, breaches, claims" },
  { id: "consumer_rights", icon: ShoppingBag, label: "Consumer Rights", description: "Products, services, refunds" },
  { id: "family", icon: Users, label: "Family", description: "Custody, divorce, support" },
  { id: "other", icon: HelpCircle, label: "Other", description: "Something else" },
];

const CaseForm = () => {
  const router = useRouter();
  
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [locationCity, setLocationCity] = useState("");
  const [locationState, setLocationState] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [situation, setSituation] = useState("");
  const [files, setFiles] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeData, setUpgradeData] = useState(null);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map(file => ({
      file: file,
      name: file.name,
      size: (file.size / 1024).toFixed(0) + ' KB',
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const parseLocation = (locationString) => {
    const parts = locationString.split(',').map(s => s.trim());
    return {
      city: parts[0] || '',
      state: parts[1] || '',
      country: parts[2] || 'US'
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedIssue) {
      setError('Please select an issue type');
      return;
    }

    if (!locationCity || !locationState) {
      setError('Please enter your location in the format: City, State, Country');
      return;
    }

    if (!situation.trim()) {
      setError('Please describe your situation');
      return;
    }

    // Validate files before upload
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 20;
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    for (const fileObj of files) {
      if (fileObj.file.size > maxFileSize) {
        setError(`File "${fileObj.name}" exceeds 10MB limit`);
        return;
      }
      
      if (!allowedTypes.includes(fileObj.file.type)) {
        setError(`File "${fileObj.name}" has unsupported format. Only PDF, images, Word docs, and text files are allowed.`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('issue_type', selectedIssue);
      formData.append('location_city', locationCity);
      formData.append('location_state', locationState);
      formData.append('location_country', locationCountry || 'US');
      formData.append('situation_description', situation);
      formData.append('status', 'active');

      // Append files
      files.forEach((fileObj, index) => {
        formData.append(`documents[${index}]`, fileObj.file);
      });

      const response = await fetch('/api/case', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();


      if (!response.ok) {

        if (data.data?.upgrade_required) {
          setUpgradeData({
            message: data.message,
            currentPlan: data.data.current_plan,
            upgradeTo: data.data.upgrade_to,
          });
          setShowUpgradeModal(true);
          return;
        }

        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join('\n');
          setError(errorMessages);
          return;
        }
        
        throw new Error(data.message || 'Failed to create case');
      }

      if (data.success) {
        const caseId = data.data?.case?.id;
        

        if (!caseId) {
         
          throw new Error('Case created but ID not found in response');
        }

        if (data.data?.upload_info?.errors?.length > 0) {
          console.warn('Some files failed to upload:', data.data.upload_info.errors);
        }

        router.push(`/case/${caseId}`);
      } else {
        throw new Error(data.message || 'Failed to create case');
      }
      
    } catch (err) {
      setError(err.message || 'Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const value = e.target.value;
    const parsed = parseLocation(value);
    setLocationCity(parsed.city);
    setLocationState(parsed.state);
    setLocationCountry(parsed.country);
  };

  const isFormValid = selectedIssue && locationCity && locationState && situation.trim();

  return (
    <>
      <section id='case-form' className="md:scroll-mt-12 lg:scroll-mt-12 py-12 bg-[#FBFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
              Tell Us What's <span className="italic">Happening</span>
            </h2>
            <p className="text-[18px] text-gray-600/80 font-inter">
              Share the details of your situation and we'll provide personalized guidance
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Step 1: Issue Type */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                  1
                </span>
                What type of issue are you facing?
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {issueTypes.map((issue) => {
                  const Icon = issue.icon;
                  const isSelected = selectedIssue === issue.id;
                  return (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue.id)}
                      type="button"
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-yellow-500/80 cursor-pointer group ${
                        isSelected ? 'border-2 border-[#F59F0A] bg-[#FAF5ED]' : 'border-2 border-gray-300/70 hover:border-gray-200'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 transition-colors ${isSelected ? 'text-[#F59F0A]' : 'text-gray-500 group-hover:text-gray-500'}`} />
                      <div className="text-[12.5px] font-[560] text-slate-800">{issue.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{issue.description}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Location */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                  2
                </span>
                Where are you located?
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  onChange={handleLocationChange}
                  placeholder="City, State/Province, Country"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-300/70 text-foreground placeholder:text-muted-foreground focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">This helps us provide jurisdiction-specific legal guidance</p>
            </div>

            {/* Step 3: Describe Situation */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                  3
                </span>
                Describe your situation
              </label>
              <div className="relative">
                <textarea
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  rows={5}
                  placeholder="Tell us what happened in your own words. Include relevant dates, people involved, what was said or done, and what outcome you're hoping for..."
                  className="w-full px-4 py-4 rounded-xl border-2 border-gray-300/70 text-foreground placeholder:text-muted-foreground focus:border-[#F59F0A] focus:outline-none focus:ring-0 transition-colors resize-none"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">The more detail you provide, the better guidance we can give</p>
            </div>

            {/* Step 4: Upload Documents */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-semibold shrink-0">
                  4
                </span>
                Upload relevant documents (optional)
              </label>
              
              <div className="relative border-2 border-dashed border-gray-300/70 rounded-xl p-8 transition-all hover:border-[#F7BB57]/60 group cursor-pointer text-center bg-gray-50/30">
                <input
                  type="file"
                  name="documents[]"
                  multiple
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.doc,.docx,.txt"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="font-semibold text-black leading-tight">Drop files here or click to upload</div>
                  <div className="text-[11px] text-gray-500 mt-1.5">
                    PDF, Images, Word docs (Max 10MB each, up to 20 files)
                  </div>
                </div>
              </div>

              {/* Uploaded Files List */}
              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file) => (
                    <div 
                      key={file.id} 
                      className="flex items-center gap-3 p-3 bg-[#F5F3F1] rounded-lg border border-gray-200/50"
                    >
                      <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-slate-800 truncate flex-1 font-medium">{file.name}</span>
                      <span className="text-[12px] text-gray-400 uppercase">{file.size}</span>
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
                {loading ? 'Creating Case...' : 'Get Legal Guidance'}
              </span>
              
              <ArrowRight 
                className={`
                  w-5 h-5 stroke-[2.5px] transition-colors duration-300 relative z-10
                  ${isFormValid && !loading ? 'text-black' : 'text-black/40'}
                `} 
              />
              
              <div className="absolute inset-0 rounded-[14px] bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            </button>
            
            <p className='text-xs text-gray-500/80 text-center pt-4'>
              Your information is encrypted and never shared. This is not legal advice — it's educational guidance to help you understand your options.
            </p>
          </form>
        </div>
      </section>

      <UpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={upgradeData?.currentPlan}
        upgradeTo={upgradeData?.upgradeTo}
        message={upgradeData?.message}
      />
    </>
  );
};

export default CaseForm;