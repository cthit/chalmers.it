import MediaService from '@/services/mediaService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: { params: { file: string[] } }
) {
  const res = await MediaService.load(ctx.params.file.join('/'));

  const headers = new Headers();
  headers.set('Content-Type', 'image/*');
  headers.set('Content-Disposition', 'inline; filename=' + res[1]);

  return new NextResponse(res[0], { status: 200, statusText: 'OK', headers });
}
