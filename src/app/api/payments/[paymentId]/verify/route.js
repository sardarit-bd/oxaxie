import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req, context) {
  try {

    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }


    const params = await context.params;
    const paymentId = params.paymentId; 

    const body = await req.json();


    const apiRes = await fetch(
      `${process.env.API_BASE_URL}/payments/${paymentId}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const text = await apiRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { message: 'Laravel did not return JSON', raw: text },
        { status: apiRes.status }
      );
    }

    return NextResponse.json(data, { status: apiRes.status });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
