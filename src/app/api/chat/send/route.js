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
    const { all_case_id, message, caseData, conversationHistory, caseDocuments } = body;

    console.log('=== Chat API Route Debug ===');
    console.log('Case ID:', all_case_id);
    console.log('Message:', message);
    console.log('Case Documents received:', caseDocuments?.length || 0);
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

    // Prepare content for Claude
    const content = [];
    let imagesAdded = 0;
    
    // Add case documents as images if they exist
    if (caseDocuments && caseDocuments.length > 0) {
      console.log('Processing documents for AI...');
      
      for (const doc of caseDocuments) {
        console.log(`Processing document: ${doc.original_name} (${doc.mime_type})`);
        
        // Only process images
        if (doc.mime_type && doc.mime_type.startsWith('image/')) {
          try {
            const imageUrl = `${backendUrl}/case/document/${doc.id}/content`;
            console.log(`Fetching image from: ${imageUrl}`);
            
            // Fetch the image from backend
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

    // Add the text message
    content.push({
      type: "text",
      text: message
    });

    console.log(`Content prepared: ${imagesAdded} images + 1 text message`);

    // Prepare system prompt with case context
    const systemPrompt = `You are a legal assistant helping with a ${caseData.issue_type} case in ${caseData.location_city}, ${caseData.location_state}.

Case Details:
${caseData.situation_description}

${imagesAdded > 0 ? `The user has uploaded ${imagesAdded} image(s) related to this case. Analyze them carefully and reference specific details you see in the images.` : ''}

Provide helpful, accurate legal information. Always remind users this is educational information, not legal advice, and they should consult a licensed attorney for specific legal matters.`;

    // Build conversation history for Claude
    const messages = conversationHistory.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add the new message with optional images
    messages.push({
      role: "user",
      content: content
    });

    console.log('Final message structure:', {
      messageCount: messages.length,
      lastMessageContentItems: content.length,
      hasImages: imagesAdded > 0
    });

    // Call backend
    const backendPayload = {
      all_case_id,
      message,
      system_prompt: systemPrompt,
      messages: messages
    };

    console.log('Sending to backend:', `${backendUrl}/chat/send`);
    console.log('Payload structure:', {
      all_case_id,
      messageLength: message.length,
      systemPromptLength: systemPrompt.length,
      messagesCount: messages.length,
      lastMessageHasImages: content.length > 1
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