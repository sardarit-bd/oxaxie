import { NextResponse } from "next/server";

export function middleware(req) {
    const auth = req.cookies.get("auth")?.value;
    const url = req.nextUrl;

    const protectedPaths = ["/dashboard"];

    const isProtected = protectedPaths.some((path) =>
        url.pathname.startsWith(path)
    );

    if (isProtected && !auth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (auth && url.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/login",
    ],
};
