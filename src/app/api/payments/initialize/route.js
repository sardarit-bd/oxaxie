// app/api/payments/initialize/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    // Await cookies()
    const cookieStore = await cookies();

    // Read JWT from httpOnly cookie
    const token = cookieStore.get('authToken')?.value;
    if (!token) {
      console.error('❌ No authToken cookie found');
      return NextResponse.json({ message: 'Unauthenticated: No token' }, { status: 401 });
    }

    console.log('✅ authToken cookie:', token);

    // Get request body from frontend
    const body = await req.json();
    console.log('📤 Payment initialize request payload:', body);

    // Forward request to Laravel API
    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    // Read raw response text (debugging Laravel errors)
    const text = await apiRes.text();
    console.log('📥 Laravel raw response:', text);

    // Attempt to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('❌ Laravel did not return JSON');
      return NextResponse.json(
        { message: 'Laravel did not return JSON', raw: text },
        { status: apiRes.status }
      );
    }

    // If Laravel returned an error
    if (!apiRes.ok) {
      console.error('❌ Laravel error response:', data);
      return NextResponse.json(data, { status: apiRes.status });
    }

    console.log('✅ Payment initialize successful:', data);
    return NextResponse.json(data);

  } catch (error) {
    console.error('💥 Proxy fetch error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
