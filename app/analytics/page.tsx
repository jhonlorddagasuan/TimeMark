import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Analytics } from '@/components/Analytics';

export const metadata = {
  title: 'Analytics - AttendEase',
  description: 'View attendance analytics and workforce insights',
};

export default function AnalyticsPage() {
  return (
    <ProtectedLayout>
      <Analytics />
    </ProtectedLayout>
  );
}
