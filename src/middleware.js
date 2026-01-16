import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

async function verifyJWT(token) {
    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(token, secret, {
            clockTolerance: 30
        });
        return payload;
    } catch (err) {
        console.log("JWT Error:", err);
        return null;
    }
}

export default async function middleware(req) {
    const path = req.nextUrl.pathname;
    const token = req.cookies.get("authToken")?.value;
    const role = req.cookies.get("role")?.value;

    // Check token validity
    const decoded = token ? await verifyJWT(token) : null;

    if (path.startsWith("/case/demo")) {
        return NextResponse.next();
    }

    const protectedRoutes = ['/new-case', '/case/']; 
    const isProtected = protectedRoutes.some(route => path.startsWith(route));

    // If not logged in but trying to access PROTECTED routes (not dashboard)
    if (!decoded && isProtected) {
        const res = NextResponse.redirect(new URL("/login", req.nextUrl));
        
        // Clear cookies on redirect
        ["ID", "role", "authToken", "name"].forEach(cookieName => {
            res.cookies.set(cookieName, "", {
                path: "/",
                maxAge: 0,
            });
        });
        
        return res;
    }

    // Role-based access (If you have sub-routes like /dashboard/admin or /dashboard/user)
    if (decoded && role) {
        // If you have specific sub-routes that differ by role, keep this logic.
        // Otherwise, this won't affect the main /dashboard page.
        if (role === "admin" && path.startsWith("/dashboard/user")) {
            return NextResponse.redirect(new URL("/dashboard/admin", req.nextUrl));
        }
        
        if (role === "user" && path.startsWith("/dashboard/admin")) {
            return NextResponse.redirect(new URL("/dashboard/user", req.nextUrl));
        }
    }

    // If logged in but trying to visit login page
    if (decoded && (path === "/login" || path === "/signup")) {
        const redirects = {
            "admin": "/dashboard/admin",
            "user": "/dashboard/user",
        };
        
        // Default to /dashboard if role isn't strictly admin/user or we just want them on the main dash
        const redirectPath = redirects[role] || "/dashboard";
        return NextResponse.redirect(new URL(redirectPath, req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    // This regex keeps middleware running on all pages EXCEPT static files and API routes
    // This is fine, because we removed '/dashboard' from the protection logic above.
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};