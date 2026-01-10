import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req, context) {
  try {
    console.log("=== Fetch Single Case API Hit ===");
    
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    console.log("Token exists:", !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const caseId = params.id;
    
    console.log('Fetching case ID:', caseId);

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/case/${caseId}`;
    console.log('Calling backend:', backendUrl);

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend data:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error fetching case:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch case", error: error.message },
      { status: 500 }
    );
  }
}