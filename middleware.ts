
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/verify");

  const isDashboard = pathname.startsWith("/dashboard");

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  // Redirect unauthenticated users away from protected pages
  if (!token && isDashboard) {
    return NextResponse.redirect(
      new URL("/sign-in", request.url)
    );
  }

  // Redirect the root page
  if (pathname === "/") {
    return NextResponse.redirect(
      new URL("/home", request.url)
    );
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/dashboard/:path*",
    "/verify/:path*",
  ],
};
