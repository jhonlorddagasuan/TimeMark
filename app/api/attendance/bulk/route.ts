import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';

async function getUser(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { employee_ids, date, status, notes, clock_in, clock_out } = body;

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0 || !date || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Insert multiple records using a transaction or multiple values
    const valueStrings = [];
    const params = [];
    let i = 1;

    for (const empId of employee_ids) {
      valueStrings.push(`($${i++}, $${i++}, $${i++}, $${i++}, $${i++}, $${i++})`);
      params.push(empId, date, clock_in || null, clock_out || null, status, notes || null);
    }

    const sql = `
      INSERT INTO attendance_records (employee_id, date, clock_in, clock_out, status, notes)
      VALUES ${valueStrings.join(', ')}
      ON CONFLICT (employee_id, date) DO UPDATE
        SET clock_in = EXCLUDED.clock_in,
            clock_out = EXCLUDED.clock_out,
            status = EXCLUDED.status,
            notes = EXCLUDED.notes,
            updated_at = CURRENT_TIMESTAMP
    `;

    await query(sql, params);

    return NextResponse.json({ success: true, count: employee_ids.length }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /attendance/bulk error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
