import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { CreateLeaveInput } from '@/lib/types';

async function getUser(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function GET(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sql = `
      SELECT l.*, e.full_name AS employee_name, e.department
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      ORDER BY l.created_at DESC
    `;
    const result = await query(sql);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[API] GET /leaves error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: CreateLeaveInput = await req.json();
    const { employee_id, leave_type, start_date, end_date, reason } = body;

    if (!employee_id || !leave_type || !start_date || !end_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'pending')
       RETURNING *`,
      [employee_id, leave_type, start_date, end_date, reason || null]
    );

    // Fetch employee info to return a complete object
    const record = result.rows[0];
    const empResult = await query('SELECT full_name, department FROM employees WHERE id = $1', [employee_id]);
    if (empResult.rows.length > 0) {
      Object.assign(record, {
        employee_name: empResult.rows[0].full_name,
        department: empResult.rows[0].department,
      });
    }

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('[API] POST /leaves error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
