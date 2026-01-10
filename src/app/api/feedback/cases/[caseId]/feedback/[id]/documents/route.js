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
    const formData = await req.formData();

    console.log('Uploading documents to feedback:', feedbackId);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/feedback/${feedbackId}/documents`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type for FormData - browser will set it with boundary
        },
        body: formData,
      }
    );

    const contentType = res.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text();
      console.error('Non-JSON response:', text.substring(0, 500));
      return NextResponse.json(
        { success: false, message: 'Server error occurred during upload' },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error('Upload documents error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
