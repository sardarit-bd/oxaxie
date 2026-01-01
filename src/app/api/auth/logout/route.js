import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    ["authToken", "ID", "role", "name"].forEach(cookieName => {
      cookieStore.set(cookieName, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
      });
    });

    return NextResponse.json({ 
      message: "Logged out successfully" 
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Logout failed" },
      { status: 500 }
    );
  }
}