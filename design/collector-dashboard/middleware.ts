import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only redirect exact /dashboard and / paths, not subpaths
  if (request.nextUrl.pathname === "/dashboard" || request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/"]
};
