import { NextResponse } from 'next/server';

export default class ApiService {
  static jsonError(message: string, status: number = 400): NextResponse {
    return NextResponse.json(
      {
        error: {
          status,
          message
        }
      },
      { status }
    );
  }
}
