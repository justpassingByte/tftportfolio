import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — TacticianClimb',
  description: 'Login to manage your booster page',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
