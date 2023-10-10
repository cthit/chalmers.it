import { NextRequest, NextResponse } from "next/server";
import { logger } from "./logger";

export default async function middleware(request: NextRequest, ) {
  const response = NextResponse.next();

  logger.info({"level":30,"time":1522431328992,"msg":"hello world","pid":42,"hostname":"foo","v":1})

  return response;
}
