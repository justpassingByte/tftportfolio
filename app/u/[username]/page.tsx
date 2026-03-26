import { notFound } from 'next/navigation';
import { getBoosterByUsername, getAllUsernames } from '@/lib/data';
import TemplateRenderer from '@/components/builder/template-renderer';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const data = await getBoosterByUsername(username);

  if (!data) {
    return { title: 'Booster Not Found' };
  }

  return {
    title: `${data.profile.display_name} — TFT Booster`,
    description: data.profile.bio ?? `Check out ${data.profile.display_name}'s TFT boosting profile`,
  };
}

export async function generateStaticParams() {
  const usernames = await getAllUsernames();
  return usernames.map((username) => ({ username }));
}

export default async function BoosterPage({ params }: PageProps) {
  const { username } = await params;
  const data = await getBoosterByUsername(username);

  if (!data) {
    notFound();
  }

  return <TemplateRenderer data={data} />;
}
