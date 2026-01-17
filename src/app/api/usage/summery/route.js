import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Not authenticated' 
        },
        { status: 401 }
      );
    }

    console.log('=== Usage Summary Proxy ===');
    console.log('Token:', token ? 'Present' : 'Missing');

    // Call your Laravel backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usage/summary`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Laravel API response status:', response.status);

    const data = await response.json();
    console.log('Laravel API response data:', data);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.message || 'Failed to fetch usage summary',
          errors: data.errors || null
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data || data
    });

  } catch (error) {
    console.error('Usage summary proxy error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message
      },
      { status: 500 }
    );
  }
}