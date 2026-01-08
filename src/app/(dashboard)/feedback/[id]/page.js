
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

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

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      if (selectedFiles.length > 5) {
        setError("Maximum 5 files allowed");
        return;
      }

      const invalidFiles = selectedFiles.filter(file => file.size > 10 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        setError("Some files exceed 10MB limit");
        return;
      }

      setFiles(selectedFiles);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log("Feedback response:", feedbackData);

      if (!feedbackResponse.ok) {
        throw new Error(feedbackData.message || "Failed to submit feedback");
      }

      const feedbackId = feedbackData.data.id;
      console.log("Feedback created with ID:", feedbackId);

      if (files.length > 0) {
        console.log("Uploading", files.length, "documents...");
        
        const formDataFiles = new FormData();
        files.forEach((file) => {
          formDataFiles.append("documents[]", file);
        });

        const uploadResponse = await fetch(`/api/feedback/${feedbackId}/documents`, {
          method: "POST",
          credentials: "include",
          body: formDataFiles,
        });

        if (!uploadResponse.ok) {
          console.error("Document upload failed, but feedback created");
        } else {
          console.log("Documents uploaded successfully");
        }
      }

      console.log("Triggering AI analysis...");
      fetch(`/api/feedback/${feedbackId}/analyze`, {
        method: "POST",
        credentials: "include",
      }).catch(err => console.error("AI analysis failed:", err));

      alert("Feedback submitted successfully!");
      router.push(`/cases/${caseId}`);

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

  return (
    <div className="min-h-screen bg-white flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl w-full space-y-12">
        <Link href={`/case/${caseId}`}>
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors mb-8 cursor-pointer">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </button>
        </Link>

        <div>
          <h1 className="text-3xl sm:text-4xl text-gray-900 mb-2 font-serif">
            Response Feedback
          </h1>
          <p className="text-gray-600 text-sm">
            Track how the opposing party responded to your actions
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Response Type */}
          <div className="group">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              <label htmlFor="response_type" className="text-lg font-medium text-gray-900">
                Response Type
              </label>
            </div>

            <select
              id="response_type"
              name="response_type"
              value={formData.response_type}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-300 rounded-xl py-4 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer"
              required
            >
              <option value="" disabled>
                Select response type...
              </option>
              <option value="complied">✓ Complied - They agreed and followed through</option>
              <option value="partial_compliance">◐ Partial Compliance - They partially agreed</option>
              <option value="refused">✗ Refused - They declined or disagreed</option>
              <option value="no_response">⊘ No Response - They haven't replied</option>
              <option value="counter_offer">⇄ Counter-offer - They made a different proposal</option>
            </select>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              How did they respond to your demand or action?
            </p>
          </div>

          {/* Section 2: Response Date */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              <label htmlFor="response_date" className="text-lg font-medium text-gray-900">
                Response Date
              </label>
            </div>

            <input
              type="date"
              id="response_date"
              name="response_date"
              value={formData.response_date}
              onChange={handleInputChange}
              max={getTodayDate()}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              required
            />
            <p className="text-sm text-gray-500 mt-2 ml-1">
              When did you receive their response?
            </p>
          </div>

          {/* Section 3: Action Taken Date (Optional) */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              <label htmlFor="action_taken_date" className="text-lg font-medium text-gray-900">
                Original Action Date <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
            </div>

            <input
              type="date"
              id="action_taken_date"
              name="action_taken_date"
              value={formData.action_taken_date}
              onChange={handleInputChange}
              max={formData.response_date || getTodayDate()}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
            />
            <p className="text-sm text-gray-500 mt-2 ml-1">
              When did you send your demand letter or take action? (helps calculate response time)
            </p>
          </div>

          {/* Section 4: Response Description */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </div>
              <label htmlFor="response_description" className="text-lg font-medium text-gray-900">
                Response Details
              </label>
            </div>

            <textarea
              id="response_description"
              name="response_description"
              rows="6"
              value={formData.response_description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black resize-none"
              placeholder="Describe what they said or did in response. Include specific details like amounts offered, conditions mentioned, or reasons given..."
              required
              minLength={10}
            />
            <p className="text-sm text-gray-500 mt-2 ml-1">
              Minimum 10 characters. Be specific - this helps the AI provide better guidance.
            </p>
          </div>

          {/* Section 5: Document Upload */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold">
                5
              </div>
              <label className="text-lg font-medium text-gray-900">
                Upload Documents <span className="text-gray-500 text-sm">(Optional)</span>
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="file"
                id="documentUpload"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              
              <div className="w-full bg-gray-50/30 border-2 border-dashed border-gray-300/70 rounded-xl py-12 px-6 flex flex-col items-center justify-center text-center transition-colors hover:border-[#F7BB57]/60">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {files.length > 0 ? `${files.length} file(s) selected` : "Drop files here or click to upload"}
                </h3>

                {files.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <p key={index} className="text-sm text-gray-700 font-medium">
                        {file.name}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    PDF, Images, Word docs • Max 10MB each • Up to 5 files
                  </p>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2 ml-1">
              Upload response letters, emails, or any relevant documents you received
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none sm:px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
            
            <Link href={`/cases/${caseId}`}>
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}




