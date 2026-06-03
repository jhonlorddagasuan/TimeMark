import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';

async function getUser(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function PUT(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { full_name, email } = body;

    if (!full_name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existing = await query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, user.id]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Email is already in use by another account' }, { status: 400 });
    }

    const result = await query(
      `UPDATE users 
       SET full_name = $1, email = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING id, username, email, full_name, avatar_url`,
      [full_name, email, user.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('[API] PUT /user/profile error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
