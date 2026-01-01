
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 422 }
      );
    }

    // Call your backend API
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await apiRes.json();

    // If backend returns an error, forward it to the frontend
    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    // Extract token and user from response
    const token = data?.data?.authorization?.token;
    const user = data?.data?.user;

    if (!token) {
      return NextResponse.json(
        { message: "Token missing from API response" },
        { status: 500 }
      );
    }

    // Set the auth token cookie
    const cookieStore = await cookies();
    cookieStore.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Optionally set user info cookies (if needed by your middleware)
    if (user?.id) {
      cookieStore.set("ID", user.id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (user?.role) {
      cookieStore.set("role", user.role, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    if (user?.name) {
      cookieStore.set("name", user.name, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}