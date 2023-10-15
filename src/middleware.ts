import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest, ) {
  const response = NextResponse.next();

  console.log(request.url, response.status, request.ip)

  return response;
}
