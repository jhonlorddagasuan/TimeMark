import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { SignupInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: SignupInput = await request.json();
    const { username, email, password, full_name } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const user = await createUser({ username, email, password, full_name });
    const token = await createSession(user.id);

    const response = NextResponse.json(
      { user, message: 'Account created successfully' },
      { status: 201 }
    );

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('[API] POST /api/auth/signup error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Signup failed' },
      { status: 400 }
    );
  }
}
