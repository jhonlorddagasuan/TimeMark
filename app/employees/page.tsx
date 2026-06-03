import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Employees } from '@/components/Employees';

export const metadata = {
  title: 'Employees - AttendEase',
  description: 'Manage company employees and workforce directories',
};

export default function EmployeesPage() {
  return (
    <ProtectedLayout>
      <Employees />
    </ProtectedLayout>
  );
}
