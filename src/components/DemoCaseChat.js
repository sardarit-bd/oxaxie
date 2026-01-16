'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scale, ArrowLeft, Send, Bot, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function DemoCaseChat() {
  const params = useParams();

  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Mock Case Data
  const mockCaseData = {
    id: 'demo-123',
    issue_type: 'landlord_tenant',
    location_city: 'Austin',
    location_state: 'Texas',
    situation_description: 'My landlord has refused to return my security deposit of $1,500, citing damages that were already present when I moved in.',
    status: 'active'
  };

  // Initialize with a welcome message
  useEffect(() => {
    const welcomeMsg = generateInitialMessage(mockCaseData);
    setMessages([{ role: 'assistant', content: welcomeMsg, timestamp: new Date().toISOString() }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // The Dummy AI Generator
  const generateDummyResponse = (userInput) => {
    // Extract dynamic parts if possible, otherwise fallback to defaults
    const issueType = formatIssueType(mockCaseData.issue_type);
    const location = `${mockCaseData.location_city}, ${mockCaseData.location_state}, USA`;

    const responses = [
      `Thank you for that additional information. Based on your ${issueType.toLowerCase()} situation in ${location}, here's what I recommend:\n\n1. **Document everything** - Keep copies of all communications\n2. **Know your deadlines** - Check local statutes of limitations\n3. **Consider formal notice** - A well-written demand letter often resolves disputes\n\nWould you like me to generate a formal demand letter based on your situation?`,
      
      `That's a valid point. In ${location}, ${issueType} laws are specific about this. You generally have the right to dispute these claims in writing within 30 days.\n\nI can help you draft a dispute letter if you'd like to proceed.`,
      
      `I understand. This can be stressful. Since this is a ${issueType} matter, keeping a paper trail is your best defense. Have you checked your lease agreement for the specific clause regarding security deposits?`
    ];

    // Pick a random response or cycle through them
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return randomResponse + `\n\n*Note: This is demo mode. ${10 - (messageCount + 1)} free messages remaining.*`;
  };

  const generateInitialMessage = (data) => {
    return `I've reviewed your ${formatIssueType(data.issue_type).toLowerCase()} situation in ${data.location_city}, ${data.location_state}. Here's my initial analysis:\n\n**Understanding Your Situation:**\n${data.situation_description}\n\n**Key Legal Considerations:**\n- Your rights are protected under local and state laws in ${data.location_state}\n- Documentation is crucial - keep records of all communications\n- Time limits may apply, so acting promptly is important\n\n**Recommended Next Steps:**\n1. Gather all relevant documents and evidence\n2. Document the timeline of events\n3. Consider sending a formal written notice\n\n*Note: This is a demo. 10 free messages remaining.*`;
  };

  const formatIssueType = (issueType) => {
    const types = {
      'landlord_tenant': 'Landlord/Tenant',
      'employment': 'Employment',
      'family': 'Family',
      'business': 'Business',
      'criminal': 'Criminal',
      'consumer': 'Consumer Rights',
      'contracts': 'Contracts',
    };
    return types[issueType] || issueType.replace(/_/g, ' ');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || isSending) return;

    // Check Limit
    if (messageCount >= 10) {
      alert("You have reached the limit of 10 free messages in this demo. Please sign up to continue!");
      return;
    }

    const userMessage = message.trim();
    setMessage('');
    
    // Add User Message
    const newUserMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    // Increment Count
    setMessageCount(prev => prev + 1);
    setIsSending(true);

    // Simulate Network Delay for Dummy Response
    setTimeout(() => {
      const aiResponseContent = generateDummyResponse(userMessage);
      
      const aiMessage = {
        role: 'assistant',
        content: aiResponseContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsSending(false);
    }, 1500); // 1.5 second delay to feel real
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <Scale className="w-6 h-6" />
              <span className="font-semibold text-lg">Advocate</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium ml-2">DEMO</span>
            </div>
            <span className="text-gray-500 text-sm hidden sm:inline">
              | {formatIssueType(mockCaseData.issue_type)} • {mockCaseData.location_city}
            </span>
          </div>
          <Link href="/dashboard">
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
              className={`px-3 md:px-4 py-3 text-xs md:text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'border-yellow-500 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Chat with AI
            </button>
            <button
              onClick={() => {
                alert("In this demo, document generation is simulated. Sign up to try the real feature!");
                setActiveTab('documents');
              }}
              className={`px-3 md:px-4 py-3 text-xs md:text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-yellow-500 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto bg-[#FBFAF9]">
            {activeTab === 'chat' ? (
              // Chat Content
              <div className="px-4 md:px-6 py-4 md:py-6 max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex gap-2 md:gap-3 mb-6 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className="flex-shrink-0">
                      <div className={`w-7 h-7 md:w-8 md:h-8 ${msg.role === 'assistant' ? 'bg-[#F0EEEA]' : 'bg-[#FAE8C9]'} rounded-full flex items-center justify-center`}>
                        {msg.role === 'assistant' ? (
                          <Bot className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        ) : (
                          <User className="w-4 h-4 md:w-5 md:h-5 text-[#F59F0A]" />
                        )}
                      </div>
                    </div>
                    
                    <div className={`max-w-[75%] md:max-w-[70%] ${
                      msg.role === 'user' 
                        ? 'bg-[#F59F0A] text-black' 
                        : 'bg-[#F0EEEA] text-gray-900'
                    } rounded-lg px-3 py-2 text-xs md:text-sm leading-relaxed`}>
                      <ReactMarkdown
                        components={{
                          strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex gap-2 md:gap-3 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-[#F0EEEA] rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                      </div>
                    </div>
                    <div className="bg-[#F0EEEA] rounded-lg p-3 md:p-4 text-xs md:text-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            ) : (
              // Mock Documents Tab
              <div className="px-4 md:px-6 py-4 md:py-6 h-full flex flex-col items-center justify-center text-center">
                 <div className="p-6 bg-gray-50 rounded-lg max-w-md">
                    <h2 className="text-lg font-semibold mb-2">Document Generation</h2>
                    <p className="text-gray-600 text-sm mb-4">This feature is locked in the demo. Sign up to generate Demand Letters, Notices, and more.</p>
                    <Link href="/signup">
                        <button className="bg-[#FF9500] text-white px-4 py-2 rounded-lg font-semibold text-sm">Sign Up to Unlock</button>
                    </Link>
                 </div>
              </div>
            )}
          </div>

          {/* Input Section - Only show for chat tab */}
          {activeTab === 'chat' && (
            <div className="border-t border-gray-200 px-4 md:px-6 py-3 md:py-4 bg-white">
              <div className="flex gap-2 md:gap-3 items-center max-w-4xl mx-auto">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your legal situation..."
                  disabled={isSending || messageCount >= 10}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-yellow-600/20 bg-[#FBFAF9] rounded-lg text-xs md:text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending || messageCount >= 10}
                  className="bg-yellow-400 hover:bg-yellow-500 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5 text-gray-900" />
                </button>
              </div>
              {messageCount >= 10 && (
                <div className="text-center mt-2 text-xs text-red-600 font-medium">
                  Demo limit reached. Please sign up to continue chatting.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200">
          <div className="p-6 pb-4">
            <h2 className="font-semibold text-lg">Case Summary</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto px-6 space-y-4 text-sm min-h-0">
            <div>
              <p className="text-gray-600 mb-1">Issue Type</p>
              <p className="font-medium">{formatIssueType(mockCaseData.issue_type)}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Location</p>
              <p className="font-medium">{mockCaseData.location_city}, {mockCaseData.location_state}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <p className="font-medium capitalize">{mockCaseData.status}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Situation</p>
              <p className="font-medium text-xs leading-relaxed">
                {mockCaseData.situation_description}
              </p>
            </div>
          </div>

          <div className="p-4 mt-auto border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Disclaimer:</span> This is a demo environment. No real legal advice is being provided here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}