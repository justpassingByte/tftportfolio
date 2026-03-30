// ============================================================
// Mock data layer — used when Supabase is not configured
// ============================================================

import { createBrowserClient } from '@supabase/ssr';
import type { BoosterPageData, SectionType, HeroContent, PersonalContent, WhyChooseContent, CommunityContent, ExternalContent, ReviewItem, ComparisonContent } from './types';
import {
  defaultHeroContent,
  defaultProofItems,
  defaultPersonalContent,
  defaultAboutAvatarContent,
  defaultComparisonContent,
  defaultGalleryContent,
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

// --- ngusitink custom content ---
// Exported earlier, but this needs to be removed from here if I added export below... Wait!
// Actually, `ngusitinkSectionOrder` is defined at line 33. I should replace it there.

const ngusitinkHeroContent: HeroContent = {
  headline: 'TFT Community & Tournaments.',
  headline_highlight: 'Học hỏi và thi đấu.',
  subheadline: 'Không chỉ là boosting. Tôi xây dựng một cộng đồng nơi người chơi giao lưu, tổ chức giải đấu và các booster có một nền tảng chuyên nghiệp.',
  trust_badges: ['Tournament Organizer', 'Booster Network', 'Custom Portfolios'],
  avatar_initial: 'N',
  avatar_url: '/ngusitink-avatar.png',
  cta_primary: 'Hợp tác & Tổ chức',
  cta_secondary: 'Join Testictour',
  cta_tertiary: 'Học hỏi & Uỷ thác Rank',
};

const ngusitinkPersonalContent: PersonalContent = {
  title: 'Tại Sao Tôi Làm Điều Này',
  paragraphs: [
    'Tôi là ngusitink — người đứng sau Tacticianclimb. Mục tiêu của tôi là tạo ra một trung tâm dành riêng cho cộng đồng TFT Việt Nam.',
    'Đây là nơi để mọi người giao lưu, học hỏi kinh nghiệm, và đặc biệt là sân chơi để tổ chức các giải đấu chuyên nghiệp cũng như phong trào cộng đồng.',
    'Quan trọng hơn, hệ thống này cung cấp cho mỗi booster một profile riêng biệt. Bạn có thể tuỳ chỉnh trang này hoàn toàn theo ý muốn, biến nó thành một portfolio cá nhân chuyên nghiệp để thu hút khách hàng.',
    'Nếu bạn là booster muốn xây dựng thương hiệu cá nhân, hay một người chơi muốn tham gia các giải đấu hấp dẫn, Tacticianclimb là nơi dành cho bạn.',
  ],
};

const ngusitinkAboutAvatarContent = {
  title: 'Tại Sao Tôi Làm Điều Này',
  paragraphs: ngusitinkPersonalContent.paragraphs,
  avatarUrl: '/ngusitink-avatar.png',
  avatarAlt: 'ngusitink — Founder of Tacticianclimb',
  highlights: [
    { icon: '🏆', label: 'Hoạt động', value: 'Tổ chức giải đấu' },
    { icon: '🎨', label: 'Hệ thống', value: 'Portfolio cá nhân tuỳ chỉnh' },
    { icon: '🤝', label: 'Network', value: '20+ Verified Boosters' },
    { icon: '🌏', label: 'Region', value: 'Global (TFT First, More Games Coming)' },
  ],
  secondaryImageUrl: '/community-dashboard.png',
};

const ngusitinkComparisonContent: ComparisonContent = {
  title: 'Khác Biệt Của Chúng Tôi',
  subtitle: 'Đã qua rồi cái thời dịch vụ chỉ lấy tiền và ẩn danh. Tacticianclimb mang sức mạnh lại cho bạn.',
  items: [
    {
      feature: 'MỤC ĐÍCH',
      oldWay: 'Chỉ bào tiền người chơi, không quan tâm bạn tiến bộ hay học hỏi được gì.',
      newWay: 'Kết nối cộng đồng, chia sẻ tips, tổ chức giải đấu, và cùng nhau đạt hiệu suất tốt nhất.',
    },
    {
      feature: 'DỊCH VỤ',
      oldWay: 'Cơ bản, gò bó 1 công việc boost rank duy nhất.',
      newWay: 'Đa dạng từ Boosting, Coaching, đến Tournaments hấp dẫn gắn kết mọi người.',
    },
    {
      feature: 'BẢO MẬT & MINH BẠCH',
      oldWay: 'Giao tài khoản qua trung gian mờ ám, tỷ lệ ban acc cao hoặc xài account giả.',
      newWay: 'Bảo mật danh tính 100%, tuy nhiên vẫn hoàn toàn minh bạch giữa client và booster bằng hệ thống Portfolio.',
    },
  ],
};

const ngusitinkGalleryContent = {
  title: 'Thành Tích & Hoạt Động',
  subtitle: 'Screenshots thực tế từ gameplay, community, và quá trình phát triển',
  images: [
    { id: 'g1', src: '/gallery-1.png', caption: 'Winning board — Master lobby', category: 'Gameplay' },
    { id: 'g2', src: '/gallery-2.png', caption: 'Diamond → Master promotion', category: 'Rank Climb' },
    { id: 'g3', src: '/gallery-3.png', caption: 'Community Discord hoạt động', category: 'Community' },
    { id: 'g4', src: '/gallery-4.png', caption: 'LP winstreak liên tục', category: 'Gameplay' },
    { id: 'g5', src: '/gallery-5.png', caption: 'Coaching session cho member', category: 'Community' },
  ],
};

const ngusitinkWhyChooseContent: WhyChooseContent = {
  title: 'Tại Sao Chọn Tacticianclimb',
  subtitle: 'Không chỉ là boosting — đây là một hệ sinh thái',
  reasons: [
    {
      title: 'Booster Được Verify',
      description: 'Mọi booster trong network đều được kiểm tra kỹ lưỡng. Skill, thái độ, và track record — tất cả đều phải đạt chuẩn.',
    },
    {
      title: 'Hệ Thống Minh Bạch',
      description: 'Client biết ai đang chơi account của mình. Booster có profile riêng, review thật, và reputation công khai.',
    },
    {
      title: 'Cộng Đồng Hỗ Trợ',
      description: 'Không chỉ nhận đơn rồi biến mất. Booster ở đây thuộc một community, giúp đỡ lẫn nhau và cùng phát triển.',
    },
    {
      title: 'Nền Tảng Chuyên Nghiệp',
      description: 'Landing page cá nhân, hệ thống review, lead management — mọi thứ một booster chuyên nghiệp cần.',
    },
  ],
};

const ngusitinkCommunityContent: CommunityContent = {
  title: 'Giao Lưu & Giải Đấu',
  description:
    'Discord server là tâm điểm cộng đồng. Nơi mọi người thảo luận meta, học hỏi từ high elo, và đăng ký tham gia các giải đấu thường xuyên. Tham gia ngay để không bỏ lỡ!',
  link_text: 'Join Discord Server',
  link_url: '#',
};

const ngusitinkExternalContent: ExternalContent = {
  title: 'Tạo Portfolio Của Riêng Bạn',
  description:
    'Mỗi booster partner được cấp một trang profile (như trang bạn đang xem). Bạn có thể toàn quyền tuỳ chỉnh giao diện, layout, hiển thị thư viện ảnh, review để tạo thành 1 portfolio xịn xò.',
  link_text: 'Đăng ký nhận Portfolio',
  link_url: '#',
};

const ngusitinkReviews: ReviewItem[] = [
  {
    id: 'n1',
    username: 'TFTViệtNam',
    rank_before: 'D2',
    rank_after: 'Master',
    days: '4 ngày',
    content: 'Service rất chuyên nghiệp. Được update liên tục, chơi sạch sẽ không có vấn đề gì. Recommend 100%.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: 'n2',
    username: 'LêoRankPro',
    rank_before: 'P3',
    rank_after: 'Diamond 1',
    days: '1 tuần',
    content: 'Anh ngusitink rất nhiệt tình. Không chỉ boost mà còn giải thích gameplay. Sẽ quay lại lần sau.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: 'n3',
    username: 'SilverToGold',
    rank_before: 'Silver 2',
    rank_after: 'Gold 1',
    days: '5 ngày',
    content: 'Giá hợp lý, service nhanh. Account an toàn tuyệt đối. Không phải lo lắng gì cả.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: 'n4',
    username: 'MetaHunter',
    rank_before: 'Diamond 4',
    rank_after: 'Master',
    days: '6 ngày',
    content: 'Cách chơi rất solid, không coinflip. Xem replay mà học được rất nhiều. Top tier booster.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: 'n5',
    username: 'TFTNewbie',
    rank_before: 'Gold 3',
    rank_after: 'Platinum 1',
    days: '10 ngày',
    content: 'Lần đầu dùng dịch vụ boosting, rất hài lòng. Communication tốt, progress rõ ràng mỗi ngày.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: 'n6',
    username: 'RankGrinder',
    rank_before: 'P1',
    rank_after: 'Diamond 2',
    days: '3 ngày',
    content: 'Fast and clean. Nhận account sáng, chiều đã lên rank. Sẽ giới thiệu cho bạn bè.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
];

export const ngusitinkSectionOrder: SectionType[] = [
  'hero',
  'about_avatar',
  'comparison',
  'proof',
  'gallery',
  'why_me',
  'reviews',
  'lead_form',
  'community',
];

export function getNgusitinkSectionContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return ngusitinkHeroContent as unknown as Record<string, unknown>;
    case 'about_avatar':
      return ngusitinkAboutAvatarContent as unknown as Record<string, unknown>;
    case 'comparison':
      return ngusitinkComparisonContent as unknown as Record<string, unknown>;
    case 'proof':
      return { items: defaultProofItems } as unknown as Record<string, unknown>;
    case 'gallery':
      return ngusitinkGalleryContent as unknown as Record<string, unknown>;
    case 'why_me':
      return ngusitinkWhyChooseContent as unknown as Record<string, unknown>;
    case 'reviews':
      return { reviews: ngusitinkReviews } as unknown as Record<string, unknown>;
    case 'community':
      return ngusitinkCommunityContent as unknown as Record<string, unknown>;
    case 'external':
      return ngusitinkExternalContent as unknown as Record<string, unknown>;
    default:
      return {};
  }
}


export const MOCK_USERS: Record<string, BoosterPageData> = {
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
        background_color: '#0f172a',
        font_family: 'inter',
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
  ngusitink: {
    profile: {
      user_id: 'mock-2',
      username: 'ngusitink',
      display_name: 'ngusitink',
      avatar_url: '/ngusitink-avatar.png',
      banner_url: undefined,
      bio: 'Founder of Tacticianclimb — Building a Vietnamese TFT boosting community.',
      contact_links: {
        discord: 'ngusitink',
        telegram: undefined,
        discord_server: '#',
        custom: undefined,
      },
      created_at: new Date().toISOString(),
    },
    page: {
      id: 'page-2',
      user_id: 'mock-2',
      template_id: 'default',
      theme_config: {
        accent_color: '#fbbf24',
        background_color: '#0f172a',
        font_family: 'inter',
        spacing: 'normal',
        mode: 'dark',
      },
      section_order: ngusitinkSectionOrder,
      is_published: true,
    },
    sections: ngusitinkSectionOrder.map((type, index) => ({
      id: `ngusitink-section-${index}`,
      page_id: 'page-2',
      type,
      content: getNgusitinkSectionContent(type),
      is_enabled: true,
      order_index: index,
    })),
    proof_items: defaultProofItems,
    reviews: ngusitinkReviews,
  },
};

function getSectionContent(type: string): Record<string, unknown> {
  switch (type) {
    case 'hero':
      return defaultHeroContent as unknown as Record<string, unknown>;
    case 'about_avatar':
      return defaultAboutAvatarContent as unknown as Record<string, unknown>;
    case 'comparison':
      return defaultComparisonContent as unknown as Record<string, unknown>;
    case 'proof':
      return { items: defaultProofItems } as unknown as Record<string, unknown>;
    case 'gallery':
      return defaultGalleryContent as unknown as Record<string, unknown>;
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

    if (profile) {
      const { data: page } = await supabase
        .from('booster_pages')
        .select('*')
        .eq('user_id', profile.user_id)
        .single();

      const pageData = page ?? {
        id: 'default',
        user_id: profile.user_id,
        blocks: [],
        theme_config: {},
        is_published: false,
      };

      const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('booster_id', profile.user_id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      return {
        profile,
        page: pageData,
        sections: [],
        proof_items: [],
        reviews: reviews ?? [],
      };
    }
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
    const usernames = data?.map((p) => p.username) ?? [];
    if (!usernames.includes('ngusitink')) {
      usernames.push('ngusitink');
    }
    return usernames;
  }

  return Object.keys(MOCK_USERS);
}
