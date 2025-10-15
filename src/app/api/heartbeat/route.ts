import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _request: NextRequest,
  _ctx: { params: Promise<any> }
) {
  return NextResponse.json({ status: 'ok' });
}
