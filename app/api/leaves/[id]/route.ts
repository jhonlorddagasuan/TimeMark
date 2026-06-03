import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';

async function getUser(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    const result = await query(
      `UPDATE leaves
       SET status = $1, reviewed_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, user.username, parseInt(params.id)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    // Return with employee info
    const record = result.rows[0];
    const empResult = await query('SELECT full_name, department FROM employees WHERE id = $1', [record.employee_id]);
    if (empResult.rows.length > 0) {
      Object.assign(record, {
        employee_name: empResult.rows[0].full_name,
        department: empResult.rows[0].department,
      });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error('[API] PUT /leaves/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
