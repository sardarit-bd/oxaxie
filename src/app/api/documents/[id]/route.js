import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;
    const { id } = await params;

    if (!token) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/documents/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}