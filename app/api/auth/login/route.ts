import { NextRequest, NextResponse } from 'next/server';
import { loginUser, createSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { LoginInput } from '@/lib/types';

// Demo user for testing without database
const DEMO_USER = {
  id: 999,
  username: 'demo',
  email: 'demo@example.com',
  password: 'demo123',
  full_name: 'Demo User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_SESSION_TOKEN = 'demo_session_token_12345';

export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Try database login first
    try {
      const user = await loginUser({ username, password });

      if (user) {
        const token = await createSession(user.id);

        const response = NextResponse.json(
          { user, message: 'Login successful' },
          { status: 200 }
        );

        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60,
          path: '/',
        });

        return response;
      }
    } catch (dbError) {
      console.log('[API] Database login failed, checking demo credentials');
    }

    // Demo mode fallback - allow demo user login
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      console.log('[API] Demo mode: logging in demo user');

      const response = NextResponse.json(
        {
          user: {
            id: DEMO_USER.id,
            username: DEMO_USER.username,
            email: DEMO_USER.email,
            full_name: DEMO_USER.full_name,
            created_at: DEMO_USER.created_at,
            updated_at: DEMO_USER.updated_at,
          },
          message: 'Login successful (demo mode)',
        },
        { status: 200 }
      );

      response.cookies.set(AUTH_COOKIE_NAME, DEMO_SESSION_TOKEN, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API] POST /api/auth/login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

