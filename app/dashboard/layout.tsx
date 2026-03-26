import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — Page Builder',
  description: 'Manage your booster landing page',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {children}
    </div>
  );
}
