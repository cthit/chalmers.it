import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest, ) {
  const response = NextResponse.next();

  console.log({url: request.url, status: response.status, remote: request.ip})

  return response;
}
