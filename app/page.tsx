'use client';

import { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/sections/hero';
import ProofSection from '@/components/sections/proof';
import PersonalSection from '@/components/sections/personal';
import WhyChooseMe from '@/components/sections/why-choose';
import Reviews from '@/components/sections/reviews';
import LeadForm from '@/components/sections/lead-form';
import Community from '@/components/sections/community';
import ExternalPlatform from '@/components/sections/external-platform';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950">
      <Hero onContactClick={() => setIsFormOpen(true)} />
      <ProofSection />
      <PersonalSection />
      <WhyChooseMe />
      <Reviews />
      <LeadForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <Community />
      <ExternalPlatform />

      {/* CTA: Want a page? */}
      <section className="py-16 text-center border-t border-slate-800/50">
        <p className="text-slate-400 text-sm mb-3">Are you a booster?</p>
        <Link
          href="/apply"
          className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Get your own page →
        </Link>
      </section>
    </main>
  );
}
