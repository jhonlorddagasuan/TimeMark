import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { CreateAttendanceInput } from '@/lib/types';

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

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date') || '';
    const employee_id = searchParams.get('employee_id') || '';
    const status = searchParams.get('status') || '';
    const date_from = searchParams.get('date_from') || '';
    const date_to = searchParams.get('date_to') || '';
    const department = searchParams.get('department') || '';

    let sql = `
      SELECT ar.*, e.full_name AS employee_name, e.employee_code, e.department
      FROM attendance_records ar
      JOIN employees e ON ar.employee_id = e.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let i = 1;

    if (date) {
      sql += ` AND ar.date = $${i}`;
      params.push(date);
      i++;
    }
    if (date_from) {
      sql += ` AND ar.date >= $${i}`;
      params.push(date_from);
      i++;
    }
    if (date_to) {
      sql += ` AND ar.date <= $${i}`;
      params.push(date_to);
      i++;
    }
    if (employee_id) {
      sql += ` AND ar.employee_id = $${i}`;
      params.push(parseInt(employee_id));
      i++;
    }
    if (status) {
      sql += ` AND ar.status = $${i}`;
      params.push(status);
      i++;
    }
    if (department) {
      sql += ` AND e.department = $${i}`;
      params.push(department);
      i++;
    }

    sql += ` ORDER BY ar.date DESC, e.full_name ASC`;

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[API] GET /attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: CreateAttendanceInput = await req.json();
    const { employee_id, date, clock_in, clock_out, status, notes } = body;

    if (!employee_id || !date || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO attendance_records (employee_id, date, clock_in, clock_out, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (employee_id, date) DO UPDATE
         SET clock_in = EXCLUDED.clock_in,
             clock_out = EXCLUDED.clock_out,
             status = EXCLUDED.status,
             notes = EXCLUDED.notes,
             updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [employee_id, date, clock_in || null, clock_out || null, status, notes || null]
    );

    // Return with employee info
    const record = result.rows[0];
    const empResult = await query('SELECT full_name, employee_code, department FROM employees WHERE id = $1', [employee_id]);
    if (empResult.rows.length > 0) {
      Object.assign(record, {
        employee_name: empResult.rows[0].full_name,
        employee_code: empResult.rows[0].employee_code,
        department: empResult.rows[0].department,
      });
    }

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error('[API] POST /attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
