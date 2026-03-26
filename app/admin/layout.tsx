import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — TacticianClimb',
  description: 'Admin panel',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-slate-950 flex flex-col">
      {children}
    </div>
  );
}
