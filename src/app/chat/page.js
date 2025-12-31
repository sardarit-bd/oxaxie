'use client';

import React, { useState } from 'react';
import { Scale, ArrowLeft, Send, Bot, FileText, Plus } from 'lucide-react';
import Link from 'next/link';

export default function LegalAdvocateChat() {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6" />
              <span className="font-semibold text-lg">Advocate</span>
            </div>
            <span className="text-gray-500 text-sm">| Landlord/Tenant • ghg</span>
          </div>
          <Link href="/">
            <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
              Back
          </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Chat Section */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-4 md:px-6">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 md:px-4 py-3 text-xs md:text-sm border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-yellow-500 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat with AI
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 md:px-4 py-3 text-xs md:text-sm border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-yellow-500 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents (0)
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-[#FBFAF9]">
            {activeTab === 'chat' ? (
              // Chat Content
              <div className="px-4 md:px-6 py-4 md:py-6">
                <div className="flex gap-2 md:gap-3">
                  {/* Bot Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-[#F0EEEA] rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                    </div>
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex-1 bg-[#F0EEEA] rounded-lg p-4 md:p-5 text-xs md:text-sm leading-relaxed">
                    <p className="mb-3 md:mb-4">I've reviewed your landlord/tenant situation in ghg. Here's my initial analysis:</p>
                    
                    <div className="mb-3 md:mb-4">
                      <p className="font-semibold mb-2">**Understanding Your Situation:**</p>
                      <p>fghfgh</p>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <p className="font-semibold mb-2">**Key Legal Considerations:**</p>
                      <ul className="space-y-1">
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Your rights are protected under local and state laws in your jurisdiction
                        </li>
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Documentation is crucial - keep records of all communications
                        </li>
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Time limits may apply, so acting promptly is important
                        </li>
                      </ul>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <p className="font-semibold mb-2">**Recommended Next Steps:**</p>
                      <ol className="space-y-1">
                        <li className="pl-3 relative before:content-['1.'] before:absolute before:left-0">
                          Gather all relevant documents and evidence
                        </li>
                        <li className="pl-3 relative before:content-['2.'] before:absolute before:left-0">
                          Document the timeline of events
                        </li>
                        <li className="pl-3 relative before:content-['3.'] before:absolute before:left-0">
                          Consider sending a formal written notice
                        </li>
                        <li className="pl-3 relative before:content-['4.'] before:absolute before:left-0">
                          Research local legal aid resources if needed
                        </li>
                      </ol>
                    </div>

                    <div className="mb-3 md:mb-4">
                      <p className="font-semibold mb-2">**How I Can Help:**</p>
                      <ul className="space-y-1">
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Answer specific questions about your rights
                        </li>
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Help you understand your legal options
                        </li>
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Generate formal documents like demand letters or notices
                        </li>
                        <li className="pl-3 relative before:content-['•'] before:absolute before:left-0">
                          Explain relevant laws and procedures
                        </li>
                      </ul>
                    </div>

                    <p>What would you like to explore first? You can ask me anything about your situation, or I can help you draft a formal document.</p>
                  </div>
                </div>
              </div>
            ) : (
              // Documents Content
              <div className="px-4 md:px-6 py-4 md:py-6 h-full">
                <div className="mb-6">
                  <h2 className="text-sm md:text-base font-semibold mb-4">Generate a Document</h2>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      Demand Letter
                    </button>
                    <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                      Formal Notice
                    </button>
                    <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                      Response Letter
                    </button>
                    <button className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm hover:bg-gray-50 transition-colors">
                      Cease & Desist
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-sm md:text-base font-semibold mb-4">Your Documents</h2>
                  <div className="flex flex-col items-center justify-center py-12 md:py-20">
                    <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-3" />
                    <p className="text-gray-500 text-xs md:text-sm">No documents yet</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Section - Only show for chat tab */}
          {activeTab === 'chat' && (
            <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 bg-white">
              <div className="flex gap-2 md:gap-3 items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about your legal situation..."
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-yellow-600/20 bg-[#FBFAF9] rounded-lg text-xs md:text-sm focus:outline-none focus:border-gray-400"
                />
                <button className="bg-yellow-400 hover:bg-yellow-500 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center transition-colors flex-shrink-0">
                  <Send className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 p-6">
          <h2 className="font-semibold text-lg mb-4">Case Summary</h2>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Issue Type</p>
              <p className="font-medium">Landlord/Tenant</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Location</p>
              <p className="font-medium">ghg</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Situation</p>
              <p className="font-medium">fghfgh</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Disclaimer:</span> This is educational legal information, not legal advice. For specific legal matters, consult a licensed attorney in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}