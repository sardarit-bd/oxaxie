// File: src/app/api/signup/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req) {
  const body = await req.json();

  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json(data, { status: apiRes.status });
  }

  const token = data?.data?.authorization?.token;
  const user = data?.data?.user;

  if (!token) {
    return NextResponse.json(
      { message: "Token missing from API" },
      { status: 500 }
    );
  }

  cookies().set("authToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    message: "Registration successful",
    user,
  });
}
