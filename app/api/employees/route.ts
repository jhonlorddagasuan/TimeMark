import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';
import { CreateEmployeeInput } from '@/lib/types';

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
    const search = searchParams.get('search') || '';
    const department = searchParams.get('department') || '';
    const status = searchParams.get('status') || '';

    let sql = `SELECT * FROM employees WHERE 1=1`;
    const params: any[] = [];
    let i = 1;

    if (search) {
      sql += ` AND (full_name ILIKE $${i} OR email ILIKE $${i} OR employee_code ILIKE $${i})`;
      params.push(`%${search}%`);
      i++;
    }
    if (department) {
      sql += ` AND department = $${i}`;
      params.push(department);
      i++;
    }
    if (status) {
      sql += ` AND status = $${i}`;
      params.push(status);
      i++;
    }

    sql += ` ORDER BY full_name ASC`;

    const result = await query(sql, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('[API] GET /employees error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDatabase();
    const user = await getUser(req);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body: CreateEmployeeInput = await req.json();
    const { employee_code, full_name, email, phone, department, position, status = 'active' } = body;

    if (!employee_code || !full_name || !email || !department || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Auto-generate initials
    const initials = full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    const result = await query(
      `INSERT INTO employees (employee_code, full_name, email, phone, department, position, status, avatar_initials)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [employee_code, full_name, email, phone || null, department, position, status, initials]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('[API] POST /employees error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Employee code or email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
