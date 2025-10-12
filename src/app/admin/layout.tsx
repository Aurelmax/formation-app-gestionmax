import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
