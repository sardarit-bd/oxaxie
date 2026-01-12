import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000/api";

// GET - Retrieve outcome
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    
    console.log('=== Next.js Proxy - GET Outcome ===');
    console.log('Case ID:', caseId);
    console.log('API Base URL:', API_BASE_URL);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      console.log('No auth token found');
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const backendUrl = `${API_BASE_URL}/case/${caseId}/outcome`;
    console.log('Calling backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response data:', data);
    
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Outcome retrieval error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create outcome
export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.id;
    
    console.log('=== Next.js Proxy - POST Outcome ===');
    console.log('Case ID:', caseId);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log('Request body:', body);

    const backendUrl = `${API_BASE_URL}/case/${caseId}/outcome`;
    console.log('Calling backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response data:', data);

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Outcome creation error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}