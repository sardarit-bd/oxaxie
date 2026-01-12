import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    console.log('=== Documents Fetch Proxy ===');
    
    const resolvedParams = await params;
    const caseId = resolvedParams.caseId;
  
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    console.log('Has Token:', !!token);
    console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'none');

    if (!token) {
      console.error('No auth token found');
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized - No token' 
      }, { status: 401 });
    }

    if (!caseId) {
      console.error('No case ID provided');
      return NextResponse.json({ 
        success: false, 
        message: 'Case ID is required' 
      }, { status: 400 });
    }

    const backendUrl = `${process.env.API_BASE_URL}/cases/${caseId}/documents`;
    console.log('Calling backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    console.log('Backend response status:', response.status);
    
    const data = await response.json();
    console.log('Backend response data:', JSON.stringify(data, null, 2));
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Proxy error: ' + error.message 
    }, { status: 500 });
  }
}