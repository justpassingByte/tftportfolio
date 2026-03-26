// ============================================================
// Mock data layer — used when Supabase is not configured
// ============================================================

import { createBrowserClient } from '@supabase/ssr';
import type { BoosterPageData } from './types';
import {
  defaultHeroContent,
  defaultProofItems,
  defaultPersonalContent,
  defaultWhyChooseContent,
  defaultReviews,
  defaultCommunityContent,
  defaultExternalContent,
  defaultSectionOrder,
} from './default-content';

/**
 * Create a cookieless Supabase client — safe for use in generateStaticParams
 * and other build-time contexts where cookies() is not available.
 */
function createStaticClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const MOCK_USERS: Record<string, BoosterPageData> = {
  villiant: {
    profile: {
      user_id: 'mock-1',
      username: 'villiant',
      display_name: 'Villiant',
      avatar_url: undefined,
      banner_url: undefined,
      bio: undefined,
      contact_links: {
        discord: 'Villiant#0001',
        telegram: undefined,
        discord_server: '#',
        custom: undefined,
      },
      created_at: new Date().toISOString(),
    },
    page: {
      id: 'page-1',
      user_id: 'mock-1',
      template_id: 'default',
      theme_config: {
        accent_color: '#6d28d9',
        spacing: 'normal',
        mode: 'dark',
      },
      section_order: defaultSectionOrder,
      is_published: true,
    },
    sections: defaultSectionOrder.map((type, index) => ({
      id: `section-${index}`,
      page_id: 'page-1',
      type,
      content: getSectionContent(type),
      is_enabled: true,
      order_index: index,
    })),
    proof_items: defaultProofItems,
    reviews: defaultReviews,
  },
};

function getSectionContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return defaultHeroContent as unknown as Record<string, unknown>;
    case 'proof':
      return { items: defaultProofItems } as unknown as Record<string, unknown>;
    case 'personal':
      return defaultPersonalContent as unknown as Record<string, unknown>;
    case 'why_me':
      return defaultWhyChooseContent as unknown as Record<string, unknown>;
    case 'reviews':
      return { reviews: defaultReviews } as unknown as Record<string, unknown>;
    case 'community':
      return defaultCommunityContent as unknown as Record<string, unknown>;
    case 'external':
      return defaultExternalContent as unknown as Record<string, unknown>;
    default:
      return {};
  }
}

/**
 * Fetch booster data by username.
 * Uses a cookieless Supabase client (safe for build-time / generateStaticParams).
 */
export async function getBoosterByUsername(
  username: string
): Promise<BoosterPageData | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_PROJECT')) {
    const supabase = createStaticClient();

    const { data: profile } = await supabase
      .from('booster_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (!profile) return null;

    const { data: page } = await supabase
      .from('booster_pages')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_published', true)
      .single();

    if (!page) return null;

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('booster_id', profile.user_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    return {
      profile,
      page,
      sections: [],
      proof_items: [],
      reviews: reviews ?? [],
    };
  }

  // Fallback to mock data
  return MOCK_USERS[username.toLowerCase()] ?? null;
}

/**
 * Get all available usernames (for static generation).
 * Uses cookieless client — safe for generateStaticParams.
 */
export async function getAllUsernames(): Promise<string[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey && !supabaseUrl.includes('YOUR_PROJECT')) {
    const supabase = createStaticClient();
    const { data } = await supabase
      .from('booster_profiles')
      .select('username');
    return data?.map((p) => p.username) ?? [];
  }

  return Object.keys(MOCK_USERS);
}
