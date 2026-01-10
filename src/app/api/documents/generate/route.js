import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    console.log('Generating document:', body);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/documents/generate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    console.log('Document generation response:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { success: false, message: data },
      { status: 500 }
    );
  }
}