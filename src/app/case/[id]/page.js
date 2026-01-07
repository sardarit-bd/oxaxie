'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scale, ArrowLeft, Send, Bot, FileText, Plus, User, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function CaseChat() {
  const params = useParams();
  const caseId = params.id;

  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [caseDocuments, setCaseDocuments] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch documents when switching to documents tab
  useEffect(() => {
    if (caseId && activeTab === 'documents') {
      console.log('Tab switched to documents, fetching...');
      fetchDocuments();
    }
  }, [caseId, activeTab]);

  const fetchDocuments = async () => {
  try {
    console.log('=== Fetching Documents ===');
    console.log('Case ID:', caseId);
    
    const response = await fetch(`/api/cases/${caseId}/documents`, {
      credentials: 'include'
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // Get raw text first to debug
    const text = await response.text();
    console.log('Raw response text:', text);
    
    // Parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse JSON:', e);
      console.error('Response was:', text);
      setDocuments([]);
      return;
    }
    
    console.log('Parsed data:', data);
    console.log('Data structure:', {
      success: data.success,
      hasData: !!data.data,
      hasDocuments: !!data.data?.documents,
      documentsType: typeof data.data?.documents,
      isArray: Array.isArray(data.data?.documents)
    });
    
    // Check different possible response structures
    if (response.ok && data.success) {
      let docs = [];
      
      // Try different paths where documents might be
      if (data.data?.documents) {
        docs = data.data.documents;
      } else if (data.documents) {
        docs = data.documents;
      } else if (Array.isArray(data.data)) {
        docs = data.data;
      }
      
      console.log('Extracted documents:', docs);
      console.log('Document count:', docs.length);
      
      if (docs.length > 0) {
        console.log('First document:', docs[0]);
      }
      
      setDocuments(docs);
    } else {
      console.error('Failed to fetch documents:', data);
      setDocuments([]);
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    console.error('Error stack:', error.stack);
    setDocuments([]);
  }
};


  const handleGenerateDocument = async (documentType) => {
  if (isGenerating) return;
  
  console.log('=== Document Generation Debug ===');
  console.log('Case ID:', caseId);
  console.log('Document Type:', documentType);
  
  setIsGenerating(true);

  try {
    const response = await fetch('/api/documents/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        all_case_id: caseId,
        document_type: documentType
      })
    });

    const data = await response.json();
    console.log('Generate document response:', data);

    if (!response.ok) {
      if (data.upgrade_required) {
        alert(`${data.message}\nPlease upgrade to ${data.upgrade_to} plan.`);
      } else {
        alert(data.message || 'Failed to generate document');
      }
      setIsGenerating(false);
      return;
    }

    if (data.success) {
      setActiveTab('documents');
      
      setTimeout(() => {
        fetchDocuments();
      }, 100);
      
      alert('Document generated successfully!');
    }
  } catch (error) {
    console.error('Error generating document:', error);
    alert('Failed to generate document. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};
  const handleDeleteDocument = async (documentId) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        await fetchDocuments();
        alert('Document deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDownloadDocument = (document) => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (caseId) {
      fetchCaseData();
    }
  }, [caseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCaseDocuments = async () => {
    try {
      console.log('=== Fetching Case Documents ===');
      console.log('Case ID:', caseId);
      
      const response = await fetch(`/api/case/${caseId}/case-documents`, {
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Case documents response:', data);
        
        if (data.success && data.data) {
          console.log('Case documents found:', data.data.length);
          console.log('Documents details:', data.data.map(d => ({
            id: d.id,
            name: d.original_name,
            mime_type: d.mime_type,
            size: d.file_size,
            isImage: d.mime_type?.startsWith('image/')
          })));
          setCaseDocuments(data.data);
        } else {
          console.log('No case documents in response');
          setCaseDocuments([]);
        }
      } else {
        console.error('Failed to fetch case documents, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching case documents:', error);
    }
  };

  const fetchCaseData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/case/${caseId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch case data');
      }

      const result = await response.json();
      const data = result.data || result;
      setCaseData(data);

      await fetchCaseDocuments();
      
      try {
        const messagesResponse = await fetch(`/api/cases/${caseId}/messages`, {
          method: 'GET',
          credentials: 'include',
        });

        console.log('Proxy response status:', messagesResponse.status);

        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          
          if (messagesData.success && messagesData.data && messagesData.data.length > 0) {
            const loadedMessages = messagesData.data.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.created_at
            }));
          
            
            // Add initial message at the beginning if it's not already there
            const hasInitialMessage = loadedMessages.some(msg => 
              msg.role === 'assistant' && msg.content.includes("I've reviewed your")
            );
            
            if (!hasInitialMessage) {
              setMessages([
                {
                  role: 'assistant',
                  content: generateInitialMessage(data),
                  timestamp: new Date(data.created_at).toISOString()
                },
                ...loadedMessages
              ]);
            } else {
              setMessages(loadedMessages);
            }
            
            setLoading(false);
            return;
          } else {
            console.log('No messages found in response');
          }
        } else {
          const errorData = await messagesResponse.json();
          console.error('Failed to fetch messages:', errorData);
          console.error('Full error details:', JSON.stringify(errorData, null, 2));
        }
      } catch (msgError) {
        console.error('Message fetch error:', msgError);
        console.error('Error stack:', msgError.stack);
      }
 
      console.log('Showing initial message');
      setMessages([{
        role: 'assistant',
        content: generateInitialMessage(data),
        timestamp: new Date().toISOString()
      }]);
      
    } catch (err) {
      console.error('Error fetching case:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateInitialMessage = (data) => {
    return `I've reviewed your ${formatIssueType(data.issue_type).toLowerCase()} situation in ${data.location_city}, ${data.location_state}. Here's my initial analysis:

**Understanding Your Situation:**
${data.situation_description}

**Key Legal Considerations:**
- Your rights are protected under local and state laws in ${data.location_state}
- Documentation is crucial - keep records of all communications
- Time limits may apply, so acting promptly is important

**Recommended Next Steps:**
1. Gather all relevant documents and evidence
2. Document the timeline of events
3. Consider sending a formal written notice
4. Research local legal aid resources if needed

**How I Can Help:**
- Answer specific questions about your rights
- Help you understand your legal options
- Generate formal documents like demand letters or notices
- Explain relevant laws and procedures

What would you like to explore first? You can ask me anything about your situation, or I can help you draft a formal document.`;
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

  const userMessage = message.trim();
  setMessage('');
  
  const newUserMessage = {
    role: 'user',
    content: userMessage,
    timestamp: new Date().toISOString()
  };
  
  setMessages(prev => [...prev, newUserMessage]);
  setIsSending(true);

  try {
    console.log('=== Sending Message to AI ===');
    console.log('Message:', userMessage);
    console.log('Case Documents:', caseDocuments);
    console.log('Number of documents:', caseDocuments?.length || 0);
    console.log('Image documents:', caseDocuments?.filter(d => d.mime_type?.startsWith('image/')));
    
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        all_case_id: caseId,
        message: userMessage,
        caseData: caseData,
        conversationHistory: messages,
        caseDocuments: caseDocuments
      }),
    });

    console.log('Chat API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      throw new Error(errorData.message || 'Failed to get AI response');
    }

    const data = await response.json();
    console.log('API Response:', data); 
    
    const aiContent = data.data?.ai_message?.content || data.message || 'No response received';
    const aiTimestamp = data.data?.ai_message?.created_at || new Date().toISOString();
    
    const aiMessage = {
      role: 'assistant',
      content: aiContent,  
      timestamp: aiTimestamp
    };
    
    setMessages(prev => [...prev, aiMessage]);
    
  } catch (err) {
    console.error('Error sending message:', err);
    
    const errorMessage = {
      role: 'assistant',
      content: 'I apologize, but I encountered an error processing your message. Please try again.',
      timestamp: new Date().toISOString(),
      isError: true
    };
    
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsSending(false);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading case...</div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Case not found'}</p>
          <Link href="/dashboard">
            <button className="text-blue-600 hover:underline">Back to Dashboard</button>
          </Link>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-500 text-sm">
              | {formatIssueType(caseData.issue_type)} • {caseData.location_city}
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
              onClick={() => setActiveTab('documents')}
              className={`px-3 md:px-4 py-3 text-xs md:text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'documents'
                  ? 'border-yellow-500 text-gray-900 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents ({documents.length})
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
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-7 h-7 md:w-8 md:h-8 ${msg.role === 'assistant' ? 'bg-[#F0EEEA]' : 'bg-[#FAE8C9]'} bg-[#F0EEEA] rounded-full flex items-center justify-center`}>
                        {msg.role === 'assistant' ? (
                          <Bot className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        ) : (
                          <User className="w-4 h-4 md:w-5 md:h-5 text-[#F59F0A]" />
                        )}
                      </div>
                    </div>
                    
                    {/* Message Content - Auto width based on content */}
                    <div className={`max-w-[75%] md:max-w-[70%] ${
                      msg.role === 'user' 
                        ? 'bg-[#F59F0A] text-black' 
                        : 'bg-[#F0EEEA] text-gray-900'
                    } rounded-lg px-3 py-2 text-xs md:text-sm leading-relaxed`}>
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
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
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
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
              // Documents Content
              <div className="px-4 md:px-6 py-4 md:py-6 h-full">
                <div className="mb-6">
                  <h2 className="text-sm md:text-base font-semibold mb-4">Generate a Document</h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleGenerateDocument('demand_letter')}
                      disabled={isGenerating}
                      className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#F59F0A] hover:text-white cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      {isGenerating ? 'Generating...' : 'Demand Letter'}
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('formal_notice')}
                      disabled={isGenerating}
                      className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#F59F0A] hover:text-white cursor-pointer disabled:opacity-50"
                    >
                      Formal Notice
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('response_letter')}
                      disabled={isGenerating}
                      className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#F59F0A] hover:text-white cursor-pointer disabled:opacity-50"
                    >
                      Response Letter
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('cease_desist')}
                      disabled={isGenerating}
                      className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#F59F0A] hover:text-white cursor-pointer disabled:opacity-50"
                    >
                      Cease & Desist
                    </button>
                  </div>
                  {isGenerating && (
                    <p className="mt-3 text-sm text-gray-600">Generating document...</p>
                  )}
                </div>

                <div className="border-t border-gray-200 py-6">
                  <h2 className="text-sm md:text-base font-semibold mb-4">Your Documents</h2>
                  {documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 md:py-20">
                      <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 text-xs md:text-sm">No documents yet</p>
                      <p className="text-gray-400 text-xs mt-1">Generate your first document above</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {documents.map(doc => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-600" />
                                <h3 className="font-semibold text-sm">{doc.name}</h3>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Created {new Date(doc.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="Download"
                              >
                                <Download className="w-4 h-4 text-gray-600" />
                              </button>
                              <button
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 cursor-pointer" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded text-xs font-mono overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap">
                            {doc.content.substring(0, 300)}...
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  disabled={isSending}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border-2 border-yellow-600/20 bg-[#FBFAF9] rounded-lg text-xs md:text-sm focus:outline-none focus:border-gray-400 disabled:opacity-50"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSending}
                  className="bg-yellow-400 hover:bg-yellow-500 w-10 h-10 md:w-11 md:h-11 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              <p className="font-medium">{formatIssueType(caseData.issue_type)}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Location</p>
              <p className="font-medium">{caseData.location_city}, {caseData.location_state}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <p className="font-medium capitalize">{caseData.status}</p>
            </div>
            
            <div>
              <p className="text-gray-600 mb-1">Situation</p>
              <p className="font-medium text-xs leading-relaxed">{caseData.situation_description}</p>
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