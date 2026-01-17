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
    const { amount } = body;

    console.log('=== Credit Purchase API ===');
    console.log('Amount requested:', amount);

    // Validate amount
    if (![5, 10, 20].includes(amount)) {
      return NextResponse.json(
        { success: false, message: "Invalid credit amount. Choose $5, $10, or $20." },
        { status: 400 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
    console.log('Backend URL:', backendUrl);

    // Call Laravel backend to create Stripe checkout session
    const response = await fetch(`${backendUrl}/credit-purchases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok || !data.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: data.message || 'Failed to initialize credit purchase' 
        },
        { status: response.status }
      );
    }

    // Return checkout URL to frontend
    return NextResponse.json({
      success: true,
      message: 'Checkout session created',
      data: {
        checkout_url: data.data.checkout_url,
        session_id: data.data.session_id,
      }
    });

  } catch (error) {
    console.error("Credit purchase API error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to process credit purchase request" },
      { status: 500 }
    );
  }
}