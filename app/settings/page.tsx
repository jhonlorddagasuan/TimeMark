import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Settings } from '@/components/Settings';

export const metadata = {
  title: 'Settings - Task Manager',
  description: 'Manage your application settings',
};

export default function SettingsPage() {
  return (
    <ProtectedLayout>
      <Settings />
    </ProtectedLayout>
  );
}
