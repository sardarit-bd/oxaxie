import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const caseId = resolvedParams.caseId;
    
    console.log('=== Pending Feedback Request ===');
    console.log('Case ID from params:', caseId);
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!caseId) {
      console.error('No case ID provided');
      return Response.json(
        { success: false, message: "Case ID is required" },
        { status: 400 }
      );
    }

    console.log('Fetching pending feedback for case:', caseId);

    const backendUrl = `${API_BASE_URL}/feedback/cases/${caseId}/pending-feedback`;
    console.log('Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response data:', data);

    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Pending feedback error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}