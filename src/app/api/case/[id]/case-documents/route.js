import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Await params in Next.js 15
    const { id } = await params;
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

    console.log('=== Fetching Case Documents ===');
    console.log('Case ID:', id);
    console.log('Backend URL:', backendUrl);

    const response = await fetch(
      `${backendUrl}/case/${id}/case-documents`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching case documents:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case documents", error: error.message },
      { status: 500 }
    );
  }
}