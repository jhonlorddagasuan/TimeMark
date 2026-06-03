import { NextRequest, NextResponse } from 'next/server';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';

// Demo user
const DEMO_USER = {
  id: 999,
  username: 'demo',
  email: 'demo@example.com',
  full_name: 'Demo User',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_SESSION_TOKEN = 'demo_session_token_12345';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Demo mode check
    if (token === DEMO_SESSION_TOKEN) {
      return NextResponse.json(DEMO_USER);
    }

    // Try database validation
    try {
      const user = await validateSession(token);

      if (user) {
        return NextResponse.json(user);
      }
    } catch (dbError) {
      console.log('[API] Database validation failed, checking demo token');
    }

    return NextResponse.json(
      { error: 'Session expired' },
      { status: 401 }
    );
  } catch (error) {
    console.error('[API] GET /api/auth/me error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

