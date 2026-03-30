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
import Comparison from '@/components/sections/comparison';
import Testimonials from '@/components/sections/testimonials';
import LeadForm from '@/components/sections/lead-form';
import PartnerForm from '@/components/sections/partner-form';
import Community from '@/components/sections/community';
import ExternalPlatform from '@/components/sections/external-platform';
import ImageGallery from '@/components/sections/image-gallery';
import type { GalleryImage } from '@/components/sections/image-gallery';
import BlockRenderer from '@/components/builder/block-renderer';
import type { Block } from '@/lib/block-types';
import AboutWithAvatar from '@/components/sections/about-with-avatar';
import Navbar from '@/components/layout/navbar';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { defaultCommunityContent } from '@/lib/default-content';

interface TemplateRendererProps {
  data: BoosterPageData;
  isAdmin?: boolean;
}

export default function TemplateRenderer({ data, isAdmin = false }: TemplateRendererProps) {
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isPartnerFormOpen, setIsPartnerFormOpen] = useState(false);
  const { page, sections } = data;
  const { locale } = useI18n();

  // Resolve which blocks to use based on locale
  let activeBlocks: Block[] = [];
  if (page.blocks && Array.isArray(page.blocks)) {
    activeBlocks = page.blocks as Block[];
  }
  if (locale === 'en' && page.blocks_en && Array.isArray(page.blocks_en) && page.blocks_en.length > 0) {
    activeBlocks = page.blocks_en as Block[];
  }

  // Build a map of section type → content for quick lookup (legacy)
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
            isBoosterProfile={!isAdmin}
            onPrimaryClick={() => setIsCustomerFormOpen(true)}
            onSecondaryClick={() => setIsPartnerFormOpen(true)}
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
      case 'about_avatar':
        return (
          <AboutWithAvatar
            key="about_avatar"
            title={(content as { title: string }).title}
            paragraphs={(content as { paragraphs: string[] }).paragraphs}
            avatarUrl={(content as { avatarUrl: string }).avatarUrl}
            avatarAlt={(content as { avatarAlt?: string }).avatarAlt}
            highlights={(content as { highlights?: { icon: string; label: string; value: string }[] }).highlights}
            secondaryImageUrl={(content as { secondaryImageUrl?: string }).secondaryImageUrl}
            missionStatement={(content as { missionStatement?: string }).missionStatement}
            missionAuthor={(content as { missionAuthor?: string }).missionAuthor}
          />
        );
      case 'why_me':
        return (
          <WhyChooseMe
            key="why_me"
            content={content as unknown as WhyChooseContent}
          />
        );
      case 'comparison':
        return (
          <Comparison
            key="comparison"
            content={content as unknown as any}
          />
        );
      case 'reviews':
        return (
          <Testimonials
            key="reviews"
            reviews={data.reviews && (data.reviews as ReviewItem[]).length > 0 ? (data.reviews as ReviewItem[]) : undefined}
          />
        );
      case 'gallery':
        return (
          <ImageGallery
            key="gallery"
            title={(content as { title?: string }).title}
            subtitle={(content as { subtitle?: string }).subtitle}
            images={(content as { images: GalleryImage[] }).images ?? []}
          />
        );
      case 'lead_form':
        return (
          <LeadForm
            key="lead_form"
            isOpen={isCustomerFormOpen}
            onClose={() => setIsCustomerFormOpen(false)}
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

  const renderLiveBlock = (block: Block) => {
    const { type, content } = block;

    // Use full interactive components for known section types
    switch (type) {
      case 'hero':
        return (
          <Hero
            key={block.id}
            content={content as unknown as HeroContent}
            isBoosterProfile={!isAdmin}
            onPrimaryClick={() => setIsCustomerFormOpen(true)}
            onSecondaryClick={() => setIsPartnerFormOpen(true)}
          />
        );
      case 'proof': {
        const blockItems = (content as { items?: ProofItem[] }).items;
        const finalItems = blockItems && blockItems.length > 0 
          ? blockItems 
          : (data.proof_items && data.proof_items.length > 0 ? data.proof_items : blockItems);
        return (
          <ProofSection
            key={block.id}
            items={finalItems}
          />
        );
      }
      case 'personal':
        return (
          <PersonalSection
            key={block.id}
            content={content as unknown as PersonalContent}
          />
        );
      case 'about_avatar':
        return (
          <AboutWithAvatar
            key={block.id}
            title={(content as { title: string }).title}
            paragraphs={(content as { paragraphs: string[] }).paragraphs}
            avatarUrl={(content as { avatarUrl: string }).avatarUrl}
            avatarAlt={(content as { avatarAlt?: string }).avatarAlt}
            highlights={(content as { highlights?: { icon: string; label: string; value: string }[] }).highlights}
            secondaryImageUrl={(content as { secondaryImageUrl?: string }).secondaryImageUrl}
            missionStatement={(content as { missionStatement?: string }).missionStatement}
            missionAuthor={(content as { missionAuthor?: string }).missionAuthor}
          />
        );
      case 'why_me':
        return (
          <WhyChooseMe
            key={block.id}
            content={content as unknown as WhyChooseContent}
          />
        );
      case 'comparison':
        return (
          <Comparison
            key={block.id}
            content={content as unknown as any}
          />
        );
      case 'reviews': {
        const resolvedReviews = data.reviews && (data.reviews as ReviewItem[]).length > 0
            ? (data.reviews as ReviewItem[])
            : [];
        return (
          <Testimonials
            key={block.id}
            reviews={resolvedReviews}
            title={(content as { title?: string }).title}
            subtitle={(content as { subtitle?: string }).subtitle}
            boosterId={data.profile.user_id}
          />
        );
      }
      case 'gallery': {
        const rawImages = (content as { images: unknown[] }).images ?? [];
        const formattedImages = rawImages.map((img, i) => {
          if (typeof img === 'string') return { id: `img-${i}`, src: img, caption: `Screenshot ${i+1}` };
          return img;
        });
        return (
          <ImageGallery
            key={block.id}
            title={(content as { title?: string }).title}
            subtitle={(content as { subtitle?: string }).subtitle}
            images={formattedImages as GalleryImage[]}
          />
        );
      }
      case 'lead_form':
        return (
          <LeadForm
            key={block.id}
            isOpen={isCustomerFormOpen}
            onClose={() => setIsCustomerFormOpen(false)}
            boosterId={data.profile.user_id}
          />
        );
      case 'community':
        return (
          <Community
            key={block.id}
            content={content as unknown as CommunityContent}
          />
        );
      case 'external':
        return (
          <ExternalPlatform
            key={block.id}
            content={content as unknown as ExternalContent}
          />
        );
      default:
        // Generic or primitive blocks get wrapped with their respective styling via BlockRenderer
        return (
          <div className="relative z-10 w-full py-4">
            <BlockRenderer block={block} accentColor={data.page.theme_config?.accentColor ?? data.page.theme_config?.accent_color ?? '#6d28d9'} />
          </div>
        );
    }
  };

  const currentActiveSections = sectionOrder.length > 0 
    ? sectionOrder 
    : activeBlocks.map(b => b.type as string);

  return (
    <>
      <Navbar displayName={data.profile.display_name} activeSections={currentActiveSections} contactLinks={data.profile.contact_links} />
      <main className="min-h-screen bg-slate-950 pt-16">
        {sectionOrder.length > 0 ? (
          <>
            {sectionOrder.filter(t => t !== 'community' && t !== 'external').map((type) => (
              <div key={type} id={type} className="scroll-mt-16">
                {renderSection(type)}
              </div>
            ))}
            {!sectionOrder.includes('lead_form') && (
              <div id="lead_form" className="scroll-mt-16">
                <LeadForm
                  isOpen={isCustomerFormOpen}
                  onClose={() => setIsCustomerFormOpen(false)}
                  boosterId={data.profile.user_id}
                />
              </div>
            )}
          </>
        ) : activeBlocks.length > 0 ? (
          <div className="space-y-0">
            {activeBlocks.map((block) => (
              <div key={block.id} id={block.type} className="scroll-mt-16">
                {renderLiveBlock(block)}
              </div>
            ))}
            <LeadForm
              isOpen={isCustomerFormOpen}
              onClose={() => setIsCustomerFormOpen(false)}
              boosterId={data.profile.user_id}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh] text-slate-500">
            This profile has no content yet.
          </div>
        )}



        <PartnerForm 
          isOpen={isPartnerFormOpen}
          onClose={() => setIsPartnerFormOpen(false)}
        />
      </main>
    </>
  );
}
