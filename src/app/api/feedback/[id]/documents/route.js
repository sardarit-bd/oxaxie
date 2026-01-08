import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function POST(request, { params }) {
  try {
    const { id: feedbackId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    console.log("=== Document Upload API Route ===");
    console.log("Feedback ID:", feedbackId);

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the FormData from the request
    const formData = await request.formData();
    
    // Forward the FormData to Laravel backend
    const response = await fetch(`${API_BASE_URL}/feedback/${feedbackId}/documents`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
        // Don't set Content-Type - let fetch set it with boundary for FormData
      },
      body: formData,
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Document upload error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}