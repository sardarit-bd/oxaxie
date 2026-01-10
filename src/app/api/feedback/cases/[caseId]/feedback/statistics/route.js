import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function GET(request, { params }) {
  try {
    const { caseId } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/feedback/cases/${caseId}/feedback/statistics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    console.error("Feedback statistics error:", error);
    return Response.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}