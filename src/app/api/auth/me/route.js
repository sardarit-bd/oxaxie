
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('authToken')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'Unauthenticated' },
        { status: 401 }
      );
    }

    const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!apiRes.ok) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const data = await apiRes.json();

    return NextResponse.json({
      success: true,
      user: data,
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { message: 'Authentication check failed' },
      { status: 500 }
    );
  }
}