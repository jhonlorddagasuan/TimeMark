import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Help } from '@/components/Help';

export const metadata = {
  title: 'Help & Support - Task Manager',
  description: 'Get help and support',
};

export default function HelpPage() {
  return (
    <ProtectedLayout>
      <Help />
    </ProtectedLayout>
  );
}
