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

    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'startDate and endDate are required' }, { status: 400 });
    }

    // Total active employees
    const totalResult = await query(`SELECT COUNT(*) FROM employees WHERE status = 'active'`);
    const total_employees = parseInt(totalResult.rows[0].count);

    // Aggregate attendance breakdown over the date range
    const statsResult = await query(
      `SELECT status, COUNT(*) AS count
       FROM attendance_records
       WHERE date >= $1 AND date <= $2
       GROUP BY status`,
      [startDate, endDate]
    );

    const breakdown: Record<string, number> = {};
    for (const row of statsResult.rows) {
      breakdown[row.status] = parseInt(row.count);
    }

    const present = breakdown['present'] || 0;
    const late = breakdown['late'] || 0;
    const half_day = breakdown['half-day'] || 0;
    const marked = present + late + half_day + (breakdown['absent'] || 0);
    const absent = breakdown['absent'] || 0; 

    // Aggregate on leave
    const leaveResult = await query(
      `SELECT COUNT(*) FROM leaves
       WHERE status = 'approved' AND start_date <= $2 AND end_date >= $1`,
      [startDate, endDate]
    );
    const on_leave = parseInt(leaveResult.rows[0].count);

    // Calculate approximate attendance rate
    const total_attended = present + late + half_day;
    const total_records = marked; // Or we could use work days * employees, but this is simpler
    const attendance_rate =
      total_records > 0
        ? Math.round((total_attended / total_records) * 100)
        : 0;

    return NextResponse.json({
      total_employees,
      present,
      absent,
      late,
      half_day,
      on_leave,
      attendance_rate,
      startDate,
      endDate
    });
  } catch (error) {
    console.error('[API] GET /attendance/summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
