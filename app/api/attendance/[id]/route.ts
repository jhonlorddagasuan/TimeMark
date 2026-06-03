import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { UpdateAttendanceInput } from '@/lib/types';

async function getUser(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return validateSession(token);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: UpdateAttendanceInput = await req.json();
    const fields = Object.entries(body).filter(([_, v]) => v !== undefined);
    if (fields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const setClause = fields.map(([k], i) => `${k} = $${i + 1}`).join(', ');
    const values = fields.map(([_, v]) => v);

    const result = await query(
      `UPDATE attendance_records SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Enrich with employee info
    const record = result.rows[0];
    const empResult = await query(
      'SELECT full_name, employee_code, department FROM employees WHERE id = $1',
      [record.employee_id]
    );
    if (empResult.rows.length > 0) {
      Object.assign(record, {
        employee_name: empResult.rows[0].full_name,
        employee_code: empResult.rows[0].employee_code,
        department: empResult.rows[0].department,
      });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const result = await query(
      'DELETE FROM attendance_records WHERE id = $1 RETURNING id',
      [params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Record deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
