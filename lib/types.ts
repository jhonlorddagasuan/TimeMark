// ─── Employee ───────────────────────────────────────────────────────────────

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';

export interface Employee {
  id: number;
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status: EmployeeStatus;
  avatar_initials?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeInput {
  employee_code: string;
  full_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  status?: EmployeeStatus;
}

export interface UpdateEmployeeInput {
  employee_code?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  department?: string;
  position?: string;
  status?: EmployeeStatus;
}

// ─── Attendance ──────────────────────────────────────────────────────────────

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half-day' | 'holiday';

export interface AttendanceRecord {
  id: number;
  employee_id: number;
  employee_name?: string;
  employee_code?: string;
  department?: string;
  date: string;
  clock_in?: string;
  clock_out?: string;
  status: AttendanceStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAttendanceInput {
  employee_id: number;
  date: string;
  clock_in?: string;
  clock_out?: string;
  status: AttendanceStatus;
  notes?: string;
}

export interface UpdateAttendanceInput {
  clock_in?: string;
  clock_out?: string;
  status?: AttendanceStatus;
  notes?: string;
}

// ─── Leave ───────────────────────────────────────────────────────────────────

export type LeaveType = 'annual' | 'sick' | 'emergency' | 'maternity' | 'paternity' | 'unpaid';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface Leave {
  id: number;
  employee_id: number;
  employee_name?: string;
  department?: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason?: string;
  status: LeaveStatus;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLeaveInput {
  employee_id: number;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason?: string;
}

export interface UpdateLeaveInput {
  status: LeaveStatus;
  reviewed_by?: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface TodayStats {
  total_employees: number;
  present: number;
  absent: number;
  late: number;
  on_leave: number;
  attendance_rate: number;
}
