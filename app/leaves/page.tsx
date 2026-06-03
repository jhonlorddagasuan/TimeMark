import { ProtectedLayout } from '@/components/ProtectedLayout';
import { LeavePage } from '@/components/LeavePage';

export const metadata = {
  title: 'Leaves - AttendEase',
};

export default function Leaves() {
  return (
    <ProtectedLayout>
      <LeavePage />
    </ProtectedLayout>
  );
}
