'use client';

import type {
  BoosterPageData,
  SectionType,
  HeroContent,
  ProofItem,
  PersonalContent,
  WhyChooseContent,
  ReviewItem,
  CommunityContent,
  ExternalContent,
} from '@/lib/types';
import Hero from '@/components/sections/hero';
import ProofSection from '@/components/sections/proof';
import PersonalSection from '@/components/sections/personal';
import WhyChooseMe from '@/components/sections/why-choose';
import Reviews from '@/components/sections/reviews';
import LeadForm from '@/components/sections/lead-form';
import Community from '@/components/sections/community';
import ExternalPlatform from '@/components/sections/external-platform';
import { useState } from 'react';

interface TemplateRendererProps {
  data: BoosterPageData;
}

export default function TemplateRenderer({ data }: TemplateRendererProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { page, sections } = data;

  // Build a map of section type → content for quick lookup
  const sectionMap = new Map(
    (sections ?? [])
      .filter((s) => s.is_enabled)
      .map((s) => [s.type, s.content])
  );

  // Get section order safely — may not exist in new block-based pages
  const sectionOrder: SectionType[] = (page as { section_order?: SectionType[] }).section_order ?? [];

  // Render sections in the order defined by page.section_order
  const renderSection = (type: SectionType) => {
    if (!sectionMap.has(type)) return null;
    const content = sectionMap.get(type)!;

    switch (type) {
      case 'hero':
        return (
          <Hero
            key="hero"
            content={content as unknown as HeroContent}
            onContactClick={() => setIsFormOpen(true)}
          />
        );
      case 'proof':
        return (
          <ProofSection
            key="proof"
            items={(content as { items?: ProofItem[] }).items ?? data.proof_items}
          />
        );
      case 'personal':
        return (
          <PersonalSection
            key="personal"
            content={content as unknown as PersonalContent}
          />
        );
      case 'why_me':
        return (
          <WhyChooseMe
            key="why_me"
            content={content as unknown as WhyChooseContent}
          />
        );
      case 'reviews':
        return (
          <Reviews
            key="reviews"
            reviews={data.reviews as ReviewItem[]}
          />
        );
      case 'lead_form':
        return (
          <LeadForm
            key="lead_form"
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            boosterId={data.profile.user_id}
          />
        );
      case 'community':
        return (
          <Community
            key="community"
            content={content as unknown as CommunityContent}
          />
        );
      case 'external':
        return (
          <ExternalPlatform
            key="external"
            content={content as unknown as ExternalContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-slate-950">
      {sectionOrder.length > 0 ? (
        <>
          {sectionOrder.map((type) => renderSection(type))}
          {!sectionOrder.includes('lead_form') && (
            <LeadForm
              isOpen={isFormOpen}
              onClose={() => setIsFormOpen(false)}
              boosterId={data.profile.user_id}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-2xl font-bold text-white mb-2">{data.profile.display_name}</p>
            <p className="text-slate-400">This page is being set up. Check back soon!</p>
          </div>
        </div>
      )}
    </main>
  );
}

