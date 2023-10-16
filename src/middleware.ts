import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logging/logger";

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  if (!request.nextUrl.pathname.startsWith('/api/heartbeat')) {
    logger.info({path: request.nextUrl.pathname, res: response.status, ip: request.ip})
  }

  return response;
}

export const config = {
  matcher: '/api/(.*)',
}
