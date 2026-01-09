import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { all_case_id, message, caseData, conversationHistory, caseDocuments, feedback_id } = body;

    console.log('=== Chat API Route Debug ===');
    console.log('Case ID:', all_case_id);
    console.log('Message:', message);
    console.log('Feedback ID:', feedback_id);
    console.log('Has caseData:', !!caseData);
    console.log('Case Documents received:', caseDocuments?.length || 0);

    let effectiveCaseData = caseData;
    if (!effectiveCaseData && all_case_id) {
      console.log('Case data not provided, fetching from backend...');
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000/api';
      
      try {
        const caseResponse = await fetch(`${backendUrl}/case/${all_case_id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          }
        });

        if (caseResponse.ok) {
          const caseResult = await caseResponse.json();
          effectiveCaseData = caseResult.data || caseResult;
          console.log('Case data fetched successfully');
        } else {
          console.error('Failed to fetch case data:', caseResponse.status);
        }
      } catch (err) {
        console.error('Error fetching case data:', err);
      }
    }

    if (!effectiveCaseData) {
      return NextResponse.json(
        { success: false, message: "Case data not available" },
        { status: 400 }
      );
    }

    if (caseDocuments && caseDocuments.length > 0) {
      console.log('Document details:', caseDocuments.map(d => ({
        id: d.id,
        name: d.original_name,
        mime_type: d.mime_type,
        isImage: d.mime_type?.startsWith('image/')
      })));
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000/api';
    console.log('Backend URL:', backendUrl);

    const content = [];
    let imagesAdded = 0;
    
    if (caseDocuments && caseDocuments.length > 0) {
      console.log('Processing documents for AI...');
      
      for (const doc of caseDocuments) {
        console.log(`Processing document: ${doc.original_name} (${doc.mime_type})`);
        
        if (doc.mime_type && doc.mime_type.startsWith('image/')) {
          try {
            const imageUrl = `${backendUrl}/case/document/${doc.id}/content`;
            console.log(`Fetching image from: ${imageUrl}`);

            const imageResponse = await fetch(imageUrl, {
              headers: {
                "Authorization": `Bearer ${token}`,
              }
            });

            console.log(`Image fetch response status: ${imageResponse.status}`);

            if (imageResponse.ok) {
              const arrayBuffer = await imageResponse.arrayBuffer();
              const base64 = Buffer.from(arrayBuffer).toString('base64');
              
              console.log(`Image converted to base64, length: ${base64.length}`);
              
              content.push({
                type: "image",
                source: {
                  type: "base64",
                  media_type: doc.mime_type,
                  data: base64
                }
              });
              
              imagesAdded++;
              console.log(`✓ Added image ${doc.original_name} to AI content`);
            } else {
              console.error(`Failed to fetch image: ${imageResponse.status}`);
            }
          } catch (err) {
            console.error(`Error fetching image ${doc.id}:`, err);
          }
        } else {
          console.log(`Skipping non-image document: ${doc.mime_type}`);
        }
      }
    } else {
      console.log('No case documents to process');
    }

    content.push({
      type: "text",
      text: message
    });

    console.log(`Content prepared: ${imagesAdded} images + 1 text message`);

    let systemPrompt;
    if (feedback_id) {
      systemPrompt = `You are a legal assistant helping with a ${effectiveCaseData.issue_type} case in ${effectiveCaseData.location_city}, ${effectiveCaseData.location_state}.

Case Details:
${effectiveCaseData.situation_description}

The user has just provided feedback about how the opposing party responded to their previous action. Analyze this response carefully and provide specific, actionable next steps based on:
1. The type of response received
2. The legal context and jurisdiction
3. Timeline considerations
4. Potential outcomes and strategies

${imagesAdded > 0 ? `The user has uploaded ${imagesAdded} image(s) related to this feedback. Analyze them carefully and reference specific details you see in the images.` : ''}

Provide clear, practical guidance about what the user should do next. Always remind users this is educational information, not legal advice, and they should consult a licensed attorney for specific legal matters.`;
    } else {
      systemPrompt = `You are a legal assistant helping with a ${effectiveCaseData.issue_type} case in ${effectiveCaseData.location_city}, ${effectiveCaseData.location_state}.

Case Details:
${effectiveCaseData.situation_description}

${imagesAdded > 0 ? `The user has uploaded ${imagesAdded} image(s) related to this case. Analyze them carefully and reference specific details you see in the images.` : ''}

Provide helpful, accurate legal information. Always remind users this is educational information, not legal advice, and they should consult a licensed attorney for specific legal matters.`;
    }

    const messages = (conversationHistory || []).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    messages.push({
      role: "user",
      content: content
    });

    console.log('Final message structure:', {
      messageCount: messages.length,
      lastMessageContentItems: content.length,
      hasImages: imagesAdded > 0,
      isFeedback: !!feedback_id
    });

    const backendPayload = {
      all_case_id,
      message,
      system_prompt: systemPrompt,
      messages: messages,
      feedback_id: feedback_id || undefined,
    };

    console.log('Sending to backend:', `${backendUrl}/chat/send`);
    console.log('Payload structure:', {
      all_case_id,
      messageLength: message.length,
      systemPromptLength: systemPrompt.length,
      messagesCount: messages.length,
      lastMessageHasImages: content.length > 1,
      hasFeedbackId: !!feedback_id
    });

    const response = await fetch(
      `${backendUrl}/chat/send`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(backendPayload),
      }
    );

    const data = await response.json();
    console.log('Backend response status:', response.status);
    console.log('Backend response:', data);

    if (!response.ok) {
      console.error('Backend error response:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("=== Error in chat API route ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { success: false, message: "Failed to send message", error: error.message },
      { status: 500 }
    );
  }
}