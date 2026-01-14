
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token, email, password, password_confirmation } = body;

    // Validation
    if (!token || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== password_confirmation) {
      return NextResponse.json(
        { message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { 
          message: data.message || 'Failed to reset password',
          errors: data.errors || {}
        },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: data.message || 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password API error:', error);
    return NextResponse.json(
      { message: 'An error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}