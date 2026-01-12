
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthenticated: No token' }, { status: 401 });
    }


    // Get request body from frontend
    const body = await req.json();


    // Forward request to Laravel API
    const apiRes = await fetch(`${process.env.API_BASE_URL}/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });


    const text = await apiRes.text();



    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {

      return NextResponse.json(
        { message: 'Laravel did not return JSON', raw: text },
        { status: apiRes.status }
      );
    }

    // If Laravel returned an error
    if (!apiRes.ok) {

      return NextResponse.json(data, { status: apiRes.status });
    }

    return NextResponse.json(data);

  } catch (error) {

    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
