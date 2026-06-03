import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Dashboard } from '@/components/Dashboard';

export const metadata = {
  title: 'Dashboard - AttendEase',
  description: 'Monitor today\'s attendance and workforce status',
};

export default function DashboardPage() {
  return (
    <ProtectedLayout>
      <Dashboard />
    </ProtectedLayout>
  );
}
