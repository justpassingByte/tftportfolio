import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for a Booster Page — TacticianClimb',
  description: 'Apply to get your own booster landing page',
};

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
