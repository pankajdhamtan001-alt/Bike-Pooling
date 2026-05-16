import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Public routes (no authentication required)
const publicRoutes = ["/", "/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files, api routes, and public routes
  if (
    pathname.includes('.') || // static files
    pathname.startsWith('/api/') || // API routes
    pathname.startsWith('/_next/') || // Next.js internal
    publicRoutes.includes(pathname) // Public routes
  ) {
    return NextResponse.next();
  }
  
  // Check for auth cookies
  const hasToken = request.cookies.has('next-auth.session-token') || 
                   request.cookies.has('__Secure-next-auth.session-token');
  
  // Redirect to login if no token
  if (!hasToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    "/((?!api/auth|_next|static|public|favicon.ico).*)",
  ],
}; 