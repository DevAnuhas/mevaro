import { type NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    if (sessionCookie && pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/account", request.url));
    }

    const protectedRoutes = ["/account", "/admin", "/material", "/upload"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (!sessionCookie && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/account/:path*", "/admin/:path*", "/login", "/material/:path*", "/upload"],
};