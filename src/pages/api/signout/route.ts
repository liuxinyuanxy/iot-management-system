import { NextResponse } from 'next/server';

export async function GET() {
  // clear cookie
  const response = NextResponse.json({});

  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return response;
}
