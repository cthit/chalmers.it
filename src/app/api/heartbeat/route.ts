import { NextRequest, NextResponse } from 'next/server';

export async function GET(_request: NextRequest, _ctx: { params?: Promise<unknown> }) {
  return NextResponse.json({ status: 'ok' });
}
