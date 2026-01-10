import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value; 

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/subscriptions/store-or-update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
  
      const text = await res.text();
      console.error('Laravel returned HTML instead of JSON:', text.substring(0, 500));
      
      return NextResponse.json(
        { 
          success: false, 
          message: 'Server error occurred. Check Laravel logs for details.',
          error: 'Non-JSON response from server'
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (err) {
    console.error('Subscription store/update error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}