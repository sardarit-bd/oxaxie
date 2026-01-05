import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    console.log("=== Chat Send API Hit ===");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Chat request:', body);

    // Call Laravel backend - NEW ENDPOINT
    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/send`;
    console.log('Calling backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response:', data);

    // Return the exact response from backend
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("Error in chat send:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to send message", 
        error: error.message 
      },
      { status: 500 }
    );
  }
}