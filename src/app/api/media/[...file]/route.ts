import MediaService from '@/services/mediaService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  ctx: { params: { file: string[] } }
) {
  const res = await MediaService.load(ctx.params.file.join('/'));

  const headers = new Headers();
  headers.set('Content-Type', res.extension);
  headers.set('Content-Disposition', 'inline; filename=' + res.filename);

  return new NextResponse(res.data, { status: 200, statusText: 'OK', headers });
}
