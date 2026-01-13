'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Scale, ArrowLeft, Send, Bot, FileText, Plus, User, Download, Trash2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/custom/ConfirmDialog';
import UpgradeModal from '@/components/UpgradeModal';

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


  const feedbackProcessed = useRef(false);

  const [userPlan, setUserPlan] = useState(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    message: '',
    upgradeTo: 'pro'
  })

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

      
      const text = await response.text();
      
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
      
      if (response.ok && data.success) {
        let docs = [];
        
        if (data.data?.documents) {
          docs = data.data.documents;
        } else if (data.documents) {
          docs = data.documents;
        } else if (Array.isArray(data.data)) {
          docs = data.data;
        }
        
        console.log('Extracted documents:', docs);
        console.log('Document count:', docs.length);
        
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

    if (!response.ok || !data.success) {
      if (data.errors?.upgrade_required) {
        // Show upgrade modal instead of toast
        setUpgradeModal({
          isOpen: true,
          message: data.message,
          upgradeTo: data.errors.upgrade_to || 'pro'
        });
      } else {
        toast.error(data.message || 'Failed to generate document.');
      }
      setIsGenerating(false);
      return;
    }

    if (data.success) {
      setActiveTab('documents');
      
      setTimeout(() => {
        fetchDocuments();
      }, 100);
      
      toast.success('Document generated successfully!');
    }
  } catch (error) {
    console.error('Error generating document:', error);
    toast.error('Error generating document. Please try again.');
  } finally {
    setIsGenerating(false);
  }
};

  

  // Fetch user plan on mount
  useEffect(() => {
    fetchUserPlan();
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
      setUserPlan('free'); // Default to free on error
    } finally {
      setIsLoadingPlan(false);
    }
  };

  // Check if user can download
  const canDownload = () => {
    return userPlan !== 'free';
  };

  // Handle download with plan check
  // Handle download with plan check
const handleDownloadClick = (document, format = 'txt') => {
  if (!canDownload()) {
    setUpgradeModal({
      isOpen: true,
      message: 'Document downloads are not available on the Free plan. Upgrade to Pro to download your documents.',
      upgradeTo: 'pro'
    });
    return;
  }

  if (format === 'txt') {
    handleDownloadDocument(document);
  } else {
    handleDownloadMarkdown(document);
  }
};

  // Navigate to upgrade page
  const handleUpgrade = () => {
    router.push('/pricing');
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
        toast.success('Document deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDownloadDocument = (document) => {
    let plainText = document.content;
    
    plainText = plainText.replace(/\*\*\*(.+?)\*\*\*/g, '$1');
    plainText = plainText.replace(/\*\*(.+?)\*\*/g, '$1');
    plainText = plainText.replace(/\*(.+?)\*/g, '$1');
    plainText = plainText.replace(/__(.+?)__/g, '$1');
    plainText = plainText.replace(/_(.+?)_/g, '$1');
    plainText = plainText.replace(/^#{1,6}\s+(.+)$/gm, '$1');
    plainText = plainText.replace(/^\s*[-*+]\s+/gm, '• ');
    plainText = plainText.replace(/^\s*(\d+)\.\s+/gm, '$1. ');
    plainText = plainText.replace(/^\s*>\s+/gm, '');
    plainText = plainText.replace(/^[-*_]{3,}$/gm, '');
    plainText = plainText.replace(/```[\s\S]*?```/g, '');
    plainText = plainText.replace(/`(.+?)`/g, '$1');
    plainText = plainText.replace(/\n{3,}/g, '\n\n');
    
    const blob = new Blob([plainText], { 
      type: 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/ /g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = (document) => {
    const blob = new Blob([document.content], { 
      type: 'text/markdown;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.name.replace(/ /g, '_')}.md`;
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
            
          } else {
            console.log('No messages found in response');
          }
        } else {
          const errorData = await messagesResponse.json();
          console.error('Failed to fetch messages:', errorData);
        }
      } catch (msgError) {
        console.error('Message fetch error:', msgError);
      }

      // If no messages were loaded, show initial message
      if (messages.length === 0) {
        console.log('Showing initial message');
        setMessages([{
          role: 'assistant',
          content: generateInitialMessage(data),
          timestamp: new Date().toISOString()
        }]);
      }
      
    } catch (err) {
      console.error('Error fetching case:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      checkAndSendPendingFeedback();
    }
  };


  const checkAndSendPendingFeedback = async () => {
    if (feedbackProcessed.current) {
      console.log('⚠️ Feedback already processed, skipping...');
      return;
    }

    console.log('🔍 Checking for pending feedback at:', new Date().toISOString());

    try {
      const response = await fetch(`/api/feedback/cases/${caseId}/pending-feedback`, {
        credentials: 'include',
      });
      
      const data = await response.json();
      console.log('📥 Pending feedback API response:', data);
      
      if (data.success && data.data) {
        console.log('✅ Found feedback ID:', data.data.id, 'sent_to_chat:', data.data.sent_to_chat);
        
        const feedback = data.data;
        
        // ✅ Mark as processed IMMEDIATELY to block duplicate
        feedbackProcessed.current = true;
        
        const feedbackMessage = buildFeedbackMessage(feedback);
        console.log('Built feedback message:', feedbackMessage);
        
        const messagesArray = await buildMessagesWithDocuments(feedback, feedbackMessage);
        console.log('Messages array prepared:', messagesArray.length, 'messages');
        
        await sendFeedbackToChat(feedbackMessage, feedback.id, messagesArray);
      } else {
        console.log('No pending feedback found');
      }
    } catch (error) {
      console.error('Error checking pending feedback:', error);
    }
  };


  const buildFeedbackMessage = (feedback) => {
    const typeLabels = {
      'complied': 'Complied',
      'partial_compliance': 'Partial Compliance',
      'refused': 'Refused',
      'no_response': 'No Response',
      'counter_offer': 'Counter-offer'
    };

    let message = `📋 **Response Feedback Update**\n\n`;
    message += `**Response Type:** ${typeLabels[feedback.response_type]}\n`;
    message += `**Response Date:** ${new Date(feedback.response_date).toLocaleDateString()}\n`;
    
    if (feedback.action_taken_date) {
      message += `**Original Action Date:** ${new Date(feedback.action_taken_date).toLocaleDateString()}\n`;
    }
    
    message += `\n**Details:**\n${feedback.response_description}\n`;

    if (feedback.documents && feedback.documents.length > 0) {
      message += `\n**Attached Documents:** ${feedback.documents.length} file(s)\n`;
    }

    message += `\nBased on this response, what should be my next steps?`;

    return message;
  };

 
  const buildMessagesWithDocuments = async (feedback, feedbackMessage) => {

    const existingMessages = (messages || []).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    console.log('Building messages array, existing count:', existingMessages.length);

    if (feedback.documents && feedback.documents.length > 0) {
      const contentArray = [
        { type: 'text', text: feedbackMessage }
      ];

      for (const doc of feedback.documents) {
        try {
          console.log('Fetching document:', doc.id);
          const docResponse = await fetch(`/api/case/document/${doc.id}/content`, {
            credentials: 'include',
          });
          
          const docData = await docResponse.json();
          console.log('Document data received:', docData.success);
          
          if (docData.success && docData.data.base64) {
            contentArray.push({
              type: doc.media_type.startsWith('image/') ? 'image' : 'document',
              source: {
                type: 'base64',
                media_type: doc.media_type,
                data: docData.data.base64
              }
            });
            console.log('Added document to content array');
          }
        } catch (error) {
          console.error('Error loading document:', error);
        }
      }

      return [
        ...existingMessages,
        { role: 'user', content: contentArray }
      ];
    }

    return [
      ...existingMessages,
      { role: 'user', content: feedbackMessage }
    ];
  };


  const sendFeedbackToChat = async (message, feedbackId, messagesArray) => {
    try {

      setIsSending(true);

      const userMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          all_case_id: caseId,
          message: message,
          feedback_id: feedbackId,
          messages: messagesArray,
          conversationHistory: messagesArray,
          caseData: caseData,
          caseDocuments: caseDocuments,
        }),
      });

      console.log('Chat API response status:', response.status);
      const data = await response.json();
      console.log('Chat API response data:', data);
      
      if (data.success) {
        const aiMessage = {
          role: 'assistant',
          content: data.data?.ai_message?.content || 'No response received',
          timestamp: data.data?.ai_message?.created_at || new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiMessage]);
        console.log('Feedback successfully sent to chat and AI responded');
      } else {
        console.error('Failed to send feedback to chat:', data);
        const errorMessage = {
          role: 'assistant',
          content: 'I apologize, but I encountered an error processing your feedback. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending feedback to chat:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your feedback. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const generateInitialMessage = (data) => {
    const message = `
        I've reviewed your ${formatIssueType(data.issue_type).toLowerCase()} situation in ${data.location_city}, ${data.location_state}. Here's my initial analysis:

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

        What would you like to explore first? You can ask me anything about your situation, or I can help you draft a formal document.
    `;
    
    return message.split('\n').map(line => line.trim()).join('\n').trim();
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
            <span className="text-gray-500 text-sm hidden sm:inline">
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
              <div className="px-4 md:px-6 py-4 md:py-6 h-full">
                <div className="mb-6">
                  <h2 className="text-sm md:text-base font-semibold mb-4">Generate a Document</h2>
                  
                  {/* UPDATED: 2 Columns on Mobile, Flex Row on Desktop */}
                  <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-2">
                    <button
                      onClick={() => handleGenerateDocument('demand_letter')}
                      disabled={isGenerating}
                      className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#FF9500] hover:text-black cursor-pointer disabled:opacity-50 w-full md:w-auto"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      {isGenerating ? 'Generating...' : 'Demand Letter'}
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('formal_notice')}
                      disabled={isGenerating}
                      className="flex items-center justify-center px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#FF9500] hover:text-black cursor-pointer disabled:opacity-50 w-full md:w-auto"
                    >
                      Formal Notice
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('response_letter')}
                      disabled={isGenerating}
                      className="flex items-center justify-center px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#FF9500] hover:text-black cursor-pointer disabled:opacity-50 w-full md:w-auto"
                    >
                      Response Letter
                    </button>
                    <button 
                      onClick={() => handleGenerateDocument('cease_desist')}
                      disabled={isGenerating}
                      className="flex items-center justify-center px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm transition-colors font-semibold hover:bg-[#FF9500] hover:text-black cursor-pointer disabled:opacity-50 w-full md:w-auto"
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
                          <div className="flex items-start justify-between mb-3">
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
                              {/* Download Dropdown */}
                              <div className="relative group">
                                <button
                                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative"
                                  title={!canDownload() ? "Upgrade to download" : "Download"}
                                >
                                  <Download className="w-4 h-4 text-gray-600" />
                                  {!canDownload() && (
                                    <Lock className="w-3 h-3 text-yellow-600 absolute -top-1 -right-1" />
                                  )}
                                </button>
                                
                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                  <button
                                    onClick={() => handleDownloadClick(doc, 'txt')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 rounded-t-lg transition-colors flex items-center justify-between"
                                  >
                                    <span>📄 Download as Text (.txt)</span>
                                    {!canDownload() && <Lock className="w-3 h-3 text-yellow-600" />}
                                  </button>
                                  <button
                                    onClick={() => handleDownloadClick(doc, 'md')}
                                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 rounded-b-lg transition-colors border-t border-gray-100 flex items-center justify-between"
                                  >
                                    <span>📝 Download as Markdown (.md)</span>
                                    {!canDownload() && <Lock className="w-3 h-3 text-yellow-600" />}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-gray-50 rounded text-xs max-h-80 overflow-y-auto">
                            <ReactMarkdown
                              components={{
                                h1: ({node, ...props}) => <h1 className="text-base font-bold mb-2 text-gray-900" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-sm font-bold mb-2 text-gray-900" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-xs font-bold mb-1 text-gray-900" {...props} />,
                                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                em: ({node, ...props}) => <em className="italic text-gray-800" {...props} />,
                                p: ({node, ...props}) => <p className="mb-2 text-gray-700 leading-relaxed" {...props} />,
                                ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                                li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                                blockquote: ({node, ...props}) => (
                                  <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-600 my-2" {...props} />
                                ),
                                hr: ({node, ...props}) => <hr className="my-3 border-gray-300" {...props} />,
                                code: ({node, inline, ...props}) => 
                                  inline ? (
                                    <code className="bg-gray-200 px-1 py-0.5 rounded text-xs" {...props} />
                                  ) : (
                                    <code className="block bg-gray-200 p-2 rounded text-xs my-2 overflow-x-auto" {...props} />
                                  ),
                              }}
                            >
                              {doc.content.length > 1000 ? doc.content.substring(0, 1000) + '...' : doc.content}
                            </ReactMarkdown>
                            
                            {doc.content.length > 1000 && (
                              <p className="text-xs text-gray-500 mt-3 italic text-center">
                                Preview truncated • Download to view full document
                              </p>
                            )}
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
        <div className="hidden lg:flex flex-col w-80 bg-white border-l border-gray-200">
          {/* Header: Fixed */}
          <div className="p-6 pb-4">
            <h2 className="font-semibold text-lg">Case Summary</h2>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 space-y-4 text-sm min-h-0">
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
              {/* This text will expand the container and trigger the scrollbar */}
              <p className="font-medium text-xs leading-relaxed">
                {caseData.situation_description}
              </p>
            </div>
          </div>

          {/* Disclaimer: Fixed at bottom */}
          <div className="p-4 mt-auto border-t border-gray-200 bg-white">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Disclaimer:</span> This is educational legal information, not legal advice. For specific legal matters, consult a licensed attorney in your jurisdiction.
            </p>
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ ...upgradeModal, isOpen: false })}
        currentPlan={userPlan || 'free'}
        upgradeTo={upgradeModal.upgradeTo}
        message={upgradeModal.message}
      />

    </div>
  );
}