'use client';

import { useState } from 'react';
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
    </main>
  );
}
