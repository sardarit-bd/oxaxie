import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request, context) {

  const params = await context.params;
  const { caseId } = params;
  
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('authToken');
    
    console.log('=== Proxy Debug ===');
    console.log('Case ID from params:', caseId);
    console.log('Auth token found:', authToken ? 'Yes' : 'No');
    
    if (!caseId) {
      console.log('No case ID provided');
      return NextResponse.json(
        { success: false, error: 'Case ID is required' },
        { status: 400 }
      );
    }
    
    if (!authToken) {
      console.log('No auth token found');
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/cases/${caseId}/messages`;
    console.log('Calling Laravel backend:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken.value}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Laravel response status:', response.status);

    const responseText = await response.text();
    console.log('Laravel raw response:', responseText.substring(0, 500));
    
    if (!response.ok) {
      console.error('Laravel returned error status:', response.status);
      
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch {
        errorData = { message: responseText };
      }
      
      return NextResponse.json(
        { success: false, error: 'Failed to fetch messages', details: errorData },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Success - Message count:', data.data?.length || 0);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}