import { NextResponse, type NextRequest } from "next/server";

// Define user roles
type UserRole = "admin" | "manager" | "employee" | "guest";

// Get user role from cookie or header (in real app, decode from JWT)
function getUserRole(request: NextRequest): UserRole {
  const roleCookie = request.cookies.get("user_role")?.value;
  
  // For demo purposes, return role from cookie or default to guest
  if (roleCookie === "admin" || roleCookie === "manager" || roleCookie === "employee") {
    return roleCookie as UserRole;
  }
  
  return "guest";
}

// Role-based dashboard mapping
const ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: "/dashboard/admin/home",
  manager: "/dashboard/manager/home",
  employee: "/dashboard/employee/home",
  guest: "/dashboard/login/v2"
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Handle root and dashboard root paths
  if (pathname === "/" || pathname === "/dashboard") {
    const userRole = getUserRole(request);
    const targetDashboard = ROLE_DASHBOARDS[userRole];
    return NextResponse.redirect(new URL(targetDashboard, request.url));
  }

  // Role-based access control (optional - enforce role permissions)
  const userRole = getUserRole(request);
  
  // Protect admin routes
  if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
  }
  
  // Protect manager routes
  if (pathname.startsWith("/dashboard/manager") && userRole !== "manager" && userRole !== "admin") {
    return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
  }
  
  // Protect employee routes
  if (pathname.startsWith("/dashboard/employee") && userRole === "guest") {
    return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
  }

  // Protect authenticated routes
  if (pathname.startsWith("/dashboard/(auth)") && userRole === "guest") {
    return NextResponse.redirect(new URL("/dashboard/login/v2", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/admin/:path*",
    "/dashboard/manager/:path*",
    "/dashboard/employee/:path*",
    "/dashboard/(auth)/:path*"
  ]
};
