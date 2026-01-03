import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get page parameter from URL
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page') || '1';

    console.log('Fetching cases from backend:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/case/user/all-cases?page=${page}`);

    // Call your Laravel backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/case/user/all-cases?page=${page}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );

    const data = await response.json();

    console.log('Backend response:', response.status, data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cases", error: error.message },
      { status: 500 }
    );
  }
}