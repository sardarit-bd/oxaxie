// // File: src/app/auth/signup/route.js
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     // Validate required fields
//     if (!body.email || !body.password) {
//       return NextResponse.json(
//         { message: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     console.log("Calling backend API:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`);

//     const apiRes = await fetch(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       }
//     );

//     // Check if response is JSON before parsing
//     const contentType = apiRes.headers.get("content-type");
    
//     if (!contentType || !contentType.includes("application/json")) {
//       console.error("Backend returned non-JSON response:", {
//         status: apiRes.status,
//         statusText: apiRes.statusText,
//         contentType
//       });
      
//       return NextResponse.json(
//         { message: "Backend server error. Please try again later." },
//         { status: 500 }
//       );
//     }

//     const data = await apiRes.json();

//     if (!apiRes.ok) {
//       return NextResponse.json(data, { status: apiRes.status });
//     }

//     const token = data?.data?.authorization?.token;
//     const user = data?.data?.user;

//     if (!token) {
//       console.error("Token missing from API response:", data);
//       return NextResponse.json(
//         { message: "Token missing from API" },
//         { status: 500 }
//       );
//     }

//     // Create response with cookie
//     const response = NextResponse.json({
//       message: "Registration successful",
//       user,
//     });

//     // Set cookie on the response object
//     response.cookies.set("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return response;

//   } catch (error) {
//     console.error("Signup API route error:", error);
    
//     if (error.name === "FetchError" || error.message.includes("fetch")) {
//       return NextResponse.json(
//         { message: "Unable to connect to backend server" },
//         { status: 503 }
//       );
//     }
    
//     return NextResponse.json(
//       { message: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    console.log("Calling backend API:", `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`);

    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: body.name,
          email: body.email,
          password: body.password,
        }),
      }
    );

    // Check if response is JSON before parsing
    const contentType = apiRes.headers.get("content-type");
    
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Backend returned non-JSON response:", {
        status: apiRes.status,
        statusText: apiRes.statusText,
        contentType
      });
      
      return NextResponse.json(
        { message: "Backend server error. Please try again later." },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return NextResponse.json(data, { status: apiRes.status });
    }

    const token = data?.data?.authorization?.token;
    const user = data?.data?.user;
    const setup = data?.data?.setup;

    if (!token) {
      console.error("Token missing from API response:", data);
      return NextResponse.json(
        { message: "Token missing from API" },
        { status: 500 }
      );
    }

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      message: data.message || "Registration successful",
      user,
      setup, // Include setup data (subscription, credits, usage tracking)
    }, { status: 201 });

    // Set cookie on the response object
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;

  } catch (error) {
    console.error("Signup API route error:", error);
    
    if (error.name === "FetchError" || error.message.includes("fetch")) {
      return NextResponse.json(
        { message: "Unable to connect to backend server" },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}