import TemplateRenderer from '@/components/builder/template-renderer';
import { getBoosterByUsername } from '@/lib/data';
import FAQ from '@/components/sections/faq';
import Footer from '@/components/sections/footer';

export default async function Home() {
  const data = await getBoosterByUsername('ngusitink');

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Admin profile not initialized.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#020202]">
      <main className="flex-1">
        <TemplateRenderer data={data} isAdmin={true} />
      </main>
      
      {/* Global sections outside of the builder */}
      <FAQ />
      <Footer />
    </div>
  );
}
