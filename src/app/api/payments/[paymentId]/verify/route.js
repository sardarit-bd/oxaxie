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

    const { paymentId } = params;
    const body = await req.json();

    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/${paymentId}/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await apiRes.json();
    return NextResponse.json(data, { status: apiRes.status });

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}