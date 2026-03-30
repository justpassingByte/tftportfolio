import TemplateRenderer from '@/components/builder/template-renderer';
import { getBoosterByUsername } from '@/lib/data';

export default async function Home() {
  const data = await getBoosterByUsername('ngusitink');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Admin profile not initialized.
      </div>
    );
  }

  return <TemplateRenderer data={data} isAdmin={true} />;
}
