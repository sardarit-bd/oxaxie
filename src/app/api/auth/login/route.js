import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const BASE_URL = process.env.API_BASE_URL;
    if (!BASE_URL) {
      console.error("API_BASE_URL not defined!");
      return NextResponse.json(
        { message: "Server misconfigured: API_BASE_URL missing" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Validate input
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 422 }
      );
    }

    // Call backend login API
    let apiRes;
    try {
      apiRes = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error("Failed to fetch backend login:", err);
      return NextResponse.json(
        { message: "Failed to reach backend login API" },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    if (!apiRes.ok) {
      console.error("Backend login returned error:", data);
      return NextResponse.json(data, { status: apiRes.status });
    }

    const token = data?.data?.authorization?.token;
    const user = data?.data?.user;

    if (!token) {
      console.error("Token missing in backend response:", data);
      return NextResponse.json(
        { message: "Token missing from API response" },
        { status: 500 }
      );
    }

    // Set cookies
    const cookieStore = await cookies();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    cookieStore.set("authToken", token, cookieOptions);

    if (user?.id) cookieStore.set("ID", user.id.toString(), cookieOptions);
    if (user?.role) cookieStore.set("role", user.role, cookieOptions);
    if (user?.name) cookieStore.set("name", user.name, cookieOptions);

    // Success response
    return NextResponse.json({
      message: "Login successful",
      user,
    });

  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
