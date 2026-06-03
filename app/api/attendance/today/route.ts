import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { initializeDatabase } from '@/lib/db-init';
import { validateSession, AUTH_COOKIE_NAME } from '@/lib/auth';

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

    const today = new Date().toISOString().split('T')[0];

    // Total active employees
    const totalResult = await query(
      `SELECT COUNT(*) FROM employees WHERE status = 'active'`
    );
    const total_employees = parseInt(totalResult.rows[0].count);

    // Today's attendance breakdown
    const statsResult = await query(
      `SELECT status, COUNT(*) AS count
       FROM attendance_records
       WHERE date = $1
       GROUP BY status`,
      [today]
    );

    const breakdown: Record<string, number> = {};
    for (const row of statsResult.rows) {
      breakdown[row.status] = parseInt(row.count);
    }

    const present = breakdown['present'] || 0;
    const late = breakdown['late'] || 0;
    const half_day = breakdown['half-day'] || 0;
    const marked = present + late + half_day + (breakdown['absent'] || 0);
    const absent = total_employees - marked + (breakdown['absent'] || 0);

    // On leave today
    const leaveResult = await query(
      `SELECT COUNT(DISTINCT employee_id) FROM leaves
       WHERE status = 'approved' AND start_date <= $1 AND end_date >= $1`,
      [today]
    );
    const on_leave = parseInt(leaveResult.rows[0].count);

    const attendance_rate =
      total_employees > 0
        ? Math.round(((present + late + half_day) / total_employees) * 100)
        : 0;

    return NextResponse.json({
      total_employees,
      present,
      absent,
      late,
      half_day,
      on_leave,
      attendance_rate,
      date: today,
    });
  } catch (error) {
    console.error('[API] GET /attendance/today error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
