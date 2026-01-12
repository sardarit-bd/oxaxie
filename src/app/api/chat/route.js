import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ai = new GoogleGenAI({});

export async function POST(request) {
  try {
    const { message, caseData, conversationHistory } = await request.json();

    console.log('=== Chat API Hit ===');

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get auth token
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      console.log('No auth token found');
    }

    // 1. Save user message to database
    if (token) {
      const userMessageData = {
        all_case_id: caseData.id,
        role: 'user',
        content: message,
        metadata: {
          timestamp: new Date().toISOString(),
        }
      };

      try {
        const saveUserMsg = await fetch(`${process.env.API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userMessageData),
        });
        
        if (saveUserMsg.ok) {
          console.log('User message saved to database');
        }
      } catch (err) {
        console.error('Failed to save user message:', err);
        // Continue anyway - we'll still respond to the user
      }
    }

    // Build conversation context
    const systemContext = `You are a helpful legal information assistant. You provide educational legal information to help users understand their rights and options. You are NOT providing legal advice, but rather helping users understand general legal concepts and procedures.

Case Information:
- Issue Type: ${caseData.issue_type}
- Location: ${caseData.location_city}, ${caseData.location_state}, ${caseData.location_country}
- Situation: ${caseData.situation_description}

Important Guidelines:
- Provide clear, educational information about legal concepts
- Help users understand their general rights and options
- Suggest documentation and record-keeping practices
- Recommend when they should consult with a licensed attorney
- Always remind them this is educational information, not legal advice
- Be supportive and understanding of their situation
- Use simple, clear language
- Keep responses concise but comprehensive

Always conclude responses by asking if they have any questions or if there's anything specific they'd like to explore further.`;

    let conversationText = systemContext + '\n\n';
    
    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n\n`;
      });
    }
    
    conversationText += `User: ${message}\n\nAssistant:`;

    console.log('Sending to Google AI...');

    // 2. Get AI response
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: conversationText,
    });

    console.log('AI Response received');

    const aiResponseText = response.text;

    // 3. Save AI response to database
    if (token) {
      const assistantMessageData = {
        all_case_id: caseData.id,
        role: 'assistant',
        content: aiResponseText,
        ai_model_used: 'gemini-2.5-flash',
        metadata: {
          timestamp: new Date().toISOString(),
        }
      };

      try {
        const saveAiMsg = await fetch(`${process.env.API_BASE_URL}/chat/send`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(assistantMessageData),
        });
        
        if (saveAiMsg.ok) {
          console.log('AI message saved to database');
        }
      } catch (err) {
        console.error('Failed to save AI message:', err);
        // Continue anyway - user still sees the response
      }
    }

    return NextResponse.json({
      success: true,
      message: aiResponseText,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('=== ERROR in Chat API ===');
    console.error('Error message:', error.message);
    
    return NextResponse.json(
      { 
        error: 'Failed to generate response',
        details: error.message,
      },
      { status: 500 }
    );
  }
}