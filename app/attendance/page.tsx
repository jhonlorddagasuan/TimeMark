import { ProtectedLayout } from '@/components/ProtectedLayout';
import { AttendancePage } from '@/components/AttendancePage';

export const metadata = {
  title: 'Attendance Logs - AttendEase',
  description: 'View and manage employee attendance records',
};

export default function AttendanceLogsPage() {
  return (
    <ProtectedLayout>
      <AttendancePage />
    </ProtectedLayout>
  );
}
