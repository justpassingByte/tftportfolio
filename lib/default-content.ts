import type {
  HeroContent,
  ProofItem,
  PersonalContent,
  WhyChooseContent,
  CommunityContent,
  ExternalContent,
  ReviewItem,
  SectionType,
  ComparisonContent,
} from './types';

// ============================================================
// Default content — the "ngusitink template" for all new pages
// Boosters can customize any of these via the page builder
// ============================================================

export const defaultHeroContent: HeroContent = {
  headline: 'Consistent LP.',
  headline_highlight: 'No middleman.',
  subheadline: 'Every game is played by me — no outsourcing, no randomness. Part of the Tacticianclimb ecosystem.',
  trust_badges: ['Verified Booster', 'Clean Gameplay', 'Fast Response'],
  avatar_initial: 'B',
  cta_primary: 'Check availability',
  cta_secondary: 'Message me',
};

export const defaultProofItems: ProofItem[] = [
  {
    id: '1',
    title: 'Diamond 2 → Master',
    description: 'Consistent climb in 2 days with stable LP gains',
    tags: ['Fast 8 meta'],
    size: 'large',
  },
  {
    id: '2',
    title: '+180 LP Winstreak',
    description: 'No losing streaks, pure adaptation',
    tags: ['Flex playstyle'],
    size: 'medium',
  },
  {
    id: '3',
    title: 'Top 0.5% Lobby',
    description: 'Consistent high-level gameplay',
    tags: ['Adaptation focus'],
    size: 'medium',
  },
  {
    id: '4',
    title: 'Platinum 1 → Master',
    description: 'Clean 3-day run with zero account risks',
    tags: ['Economy management'],
    size: 'large',
  },
  {
    id: '5',
    title: 'Diamond 4 → Diamond 1',
    description: 'Fast progression through Diamond',
    tags: ['Flex playstyle'],
    size: 'small',
  },
  {
    id: '6',
    title: 'Master Tier Lock',
    description: 'Maintained rank with consistent performance',
    tags: ['Stability'],
    size: 'medium',
  },
];

export const defaultPersonalContent: PersonalContent = {
  title: "What's Different",
  paragraphs: [
    "I don't run a boosting team. There's no rotating pool of accounts, no outsourcing, no randomness.",
    "Every game you climb is played by me. That means consistent playstyle, same decision-making, and full accountability for your account's progress.",
    "My focus is on clean climbs. I play careful TFT — proper economy, flex comps, and adaptation to whatever lobby throws at me. No forcing meta, no coinflip plays.",
    "You get a high-level player who understands the game deeply and treats your account with the same care I'd treat my own.",
  ],
};

// ---- About with Avatar (new default) --------------------
export const defaultAboutAvatarContent = {
  title: "What's Different",
  paragraphs: [
    "I don't run a boosting team. There's no rotating pool of accounts, no outsourcing, no randomness.",
    "Every game you climb is played by me. Consistent playstyle, same decision-making, and full accountability.",
    "My focus is on clean climbs — proper economy, flex comps, and adaptation. No forcing meta, no coinflip plays.",
    "You get a high-level player who treats your account with the same care I'd treat my own.",
  ],
  avatarUrl: '/placeholder-user.jpg',
  avatarAlt: 'Booster avatar',
  highlights: [
    { icon: '🎯', label: 'Role', value: 'TFT Booster' },
    { icon: '🏆', label: 'Peak Rank', value: 'Master+' },
    { icon: '🎮', label: 'Games', value: '500+ completed' },
    { icon: '⚡', label: 'Response', value: 'Under 2 hours' },
  ],
};

// ---- Comparison (new default) ----------------------------
export const defaultComparisonContent: ComparisonContent = {
  title: 'Why Tacticianclimb',
  subtitle: 'Outdated boosting sites only take your money. We build something better.',
  items: [
    {
      feature: 'PURPOSE',
      oldWay: 'Extract money from players. No care about improvement or community.',
      newWay: 'Build community, share knowledge, organize tournaments, and grow together.',
    },
    {
      feature: 'SERVICES',
      oldWay: 'One-dimensional rank boosting only. Same old model since 2012.',
      newWay: 'Diverse ecosystem: Boosting, Coaching, Tournaments, and custom portfolio pages.',
    },
    {
      feature: 'SECURITY & TRUST',
      oldWay: 'Anonymous middlemen, high ban risk, fake accounts.',
      newWay: '100% identity protection with full transparency between client and booster via Portfolio system.',
    },
  ],
};

// ---- Gallery (new default) ==============================
export const defaultGalleryContent = {
  title: 'Gallery',
  subtitle: 'Real proof from real games — screenshots, ranks, results.',
  images: [
    { id: 'g1', src: '/gallery-1.png', caption: 'Winning board — Master lobby', category: 'Gameplay' },
    { id: 'g2', src: '/gallery-2.png', caption: 'Diamond → Master promotion', category: 'Rank Climb' },
    { id: 'g3', src: '/gallery-3.png', caption: 'Community Discord', category: 'Community' },
    { id: 'g4', src: '/gallery-4.png', caption: 'LP winstreak', category: 'Gameplay' },
    { id: 'g5', src: '/gallery-5.png', caption: 'Coaching session', category: 'Community' },
  ],
};

export const defaultWhyChooseContent: WhyChooseContent = {
  title: 'Why Choose Me',
  subtitle: 'TFT-specific focus on what actually matters',
  reasons: [
    {
      title: 'Same Player Every Game',
      description:
        'No variance. You get consistent playstyle and decision-making from start to finish.',
    },
    {
      title: 'Strong Macro & Economy',
      description:
        'Core TFT skills that separate high-level from middling play. Proper resource management every lobby.',
    },
    {
      title: 'Flexible Comps',
      description:
        "Not forced to one meta. I adapt to lobby and play whatever wins — fast 8, hyperroll, slow roll.",
    },
    {
      title: 'Stable LP Climb',
      description:
        "Consistent progression without risky coinflips. You know what you're getting.",
    },
  ],
};

export const defaultReviews: ReviewItem[] = [
  {
    id: '1',
    username: 'SoloQGrinder',
    rank_before: 'D3',
    rank_after: 'Master',
    days: '3 days',
    content:
      'Super smooth climb, no sketchy gameplay. Actually feels like watching a high-level player.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: '2',
    username: 'TacticsMain',
    rank_before: 'P1',
    rank_after: 'Diamond 1',
    days: '2 weeks',
    content:
      "Fast progression. The guy knows what he's doing. Consistent LP gains every single day.",
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: '3',
    username: 'NewbieClimber',
    rank_before: 'Gold 1',
    rank_after: 'Plat 2',
    days: '10 days',
    content:
      'Clean gameplay. Zero account risks. Would recommend to anyone wanting legit boost.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: '4',
    username: 'CompNoob',
    rank_before: 'Diamond 1',
    rank_after: 'Master',
    days: '4 days',
    content:
      'The adaptability is unmatched. Never forces a comp, always plays what the lobby needs.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: '5',
    username: 'RankedWarrior',
    rank_before: 'Plat 3',
    rank_after: 'Diamond 2',
    days: '16 days',
    content:
      'Fast response to messages, professional, no issues. Exactly what I was looking for.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
  {
    id: '6',
    username: 'MetaChaser',
    rank_before: 'Diamond 4',
    rank_after: 'Master',
    days: '5 days',
    content:
      'Incredible macro decisions. Watched some games and learned a lot just from observation.',
    rating: 5,
    is_approved: true,
    created_at: '',
  },
];

export const defaultCommunityContent: CommunityContent = {
  title: 'Community',
  description:
    'If you want to learn, discuss TFT, or just hang out, feel free to join. Active community focused on high-level gameplay and tournaments.',
  link_text: 'Join Discord',
  link_url: '#',
};

export const defaultExternalContent: ExternalContent = {
  title: 'Create Your Own Portfolio',
  description:
    'Every booster partner gets their own customizable profile page — showcase your results, gallery, reviews and build your personal brand on Tacticianclimb.',
  link_text: 'Get Your Portfolio',
  link_url: '#',
};

// Default section order for new pages — full layout with all sections
export const defaultSectionOrder: SectionType[] = [
  'hero',
  'about_avatar',
  'comparison',
  'proof',
  'gallery',
  'why_me',
  'reviews',
  'lead_form',
  'community',
  'external',
];
