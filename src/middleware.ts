import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  if (!request.nextUrl.pathname.startsWith('/api/heartbeat')) {
    console.log("API", response.status, request.nextUrl.pathname.substring(4))
  }

  return response;
}

export const config = {
  matcher: '/api/(.*)',
}
