import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: feedbackId } = params;

    console.log('Starting AI analysis for feedback:', feedbackId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/${feedbackId}/analyze`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    const contentType = res.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { success: false, message: 'AI analysis failed' },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log('AI analysis completed:', data.success ? 'Success' : 'Failed');
    
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error('AI analysis error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


