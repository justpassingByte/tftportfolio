// ============================================================
// Block Types — defines all available builder blocks
// ============================================================

export type BlockType =
  | 'hero'
  | 'text'
  | 'image'
  | 'gallery'
  | 'card'
  | 'cards_row'
  | 'reviews'
  | 'lead_form'
  | 'links'
  | 'divider'
  | 'spacer'
  | 'why_me'
  | 'personal'
  | 'stats'
  | 'banner'
  | 'faq'
  | 'about_avatar'
  | 'comparison'
  | 'proof'
  | 'community'
  | 'external';

// ---- Per-block style settings ----------------------------
export interface BlockStyle {
  width: 'full' | 'wide' | 'medium' | 'narrow';
  padding: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  marginY: 'none' | 'sm' | 'md' | 'lg';
  background: 'transparent' | 'subtle' | 'card' | 'accent' | 'custom';
  bgCustom?: string;         // custom bg color or gradient
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  border: 'none' | 'subtle' | 'normal' | 'accent';
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'glow';
  textAlign: 'left' | 'center' | 'right';
}

export const DEFAULT_BLOCK_STYLE: BlockStyle = {
  width: 'wide',
  padding: 'md',
  marginY: 'md',
  background: 'transparent',
  borderRadius: 'none',
  border: 'none',
  shadow: 'none',
  textAlign: 'left',
};

export interface Block {
  id: string;
  type: BlockType;
  content: Record<string, unknown>;
  style: BlockStyle;
}

export interface PageSettings {
  background: {
    type: 'solid' | 'gradient' | 'image';
    value: string;
  };
  accentColor: string;
  font: 'inter' | 'outfit' | 'space-grotesk';
  spacing: 'compact' | 'normal' | 'spacious';
}

// ---- Block metadata for the palette ----------------------
export interface BlockMeta {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
  defaultContent: Record<string, unknown>;
  defaultStyle?: Partial<BlockStyle>;
}

export const BLOCK_PALETTE: BlockMeta[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: '🎯',
    description: 'Header with avatar, headline, CTA',
    defaultContent: {
      headline: 'Your Headline',
      headline_highlight: 'Highlight text',
      subheadline: 'Describe what you do in one sentence',
      trust_badges: ['Badge 1', 'Badge 2'],
      avatar_initial: 'V',
      cta_primary: 'Get Started',
      cta_secondary: 'Message me',
    },
    defaultStyle: { width: 'full', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'text',
    label: 'Text Block',
    icon: '📝',
    description: 'Paragraph text with title',
    defaultContent: {
      title: 'Section Title',
      paragraphs: ['Write your content here. Click to edit.'],
    },
    defaultStyle: { width: 'medium', padding: 'md' },
  },
  {
    type: 'image',
    label: 'Image',
    icon: '🖼️',
    description: 'Single image with caption',
    defaultContent: {
      src: '',
      caption: '',
      size: 'full',
      rounded: 'lg',
    },
    defaultStyle: { width: 'wide', padding: 'sm', textAlign: 'center' },
  },
  {
    type: 'gallery',
    label: 'Image Gallery',
    icon: '📸',
    description: 'Grid of images / proof',
    defaultContent: {
      images: [],
      columns: 3,
    },
    defaultStyle: { width: 'wide', padding: 'md' },
  },
  {
    type: 'card',
    label: 'Card',
    icon: '🃏',
    description: 'Styled content card',
    defaultContent: {
      title: 'Card Title',
      body: 'Card description goes here.',
      icon: '⚡',
      accentColor: '#6d28d9',
    },
    defaultStyle: { width: 'narrow', padding: 'lg', background: 'card', borderRadius: 'lg', border: 'subtle', textAlign: 'center' },
  },
  {
    type: 'cards_row',
    label: 'Cards Row',
    icon: '🎴',
    description: '2-4 cards side by side',
    defaultContent: {
      cards: [
        { icon: '⚡', title: 'Fast Climb', body: 'Consistent LP gains every day' },
        { icon: '🛡️', title: 'Safe', body: 'Zero account risks, guaranteed' },
        { icon: '🎮', title: 'Solo Player', body: 'Every game played by me' },
      ],
    },
    defaultStyle: { width: 'wide', padding: 'md' },
  },
  {
    type: 'stats',
    label: 'Stats',
    icon: '📊',
    description: 'Number stats row',
    defaultContent: {
      items: [
        { value: '500+', label: 'Games Played' },
        { value: '98%', label: 'Win Rate' },
        { value: '24h', label: 'Response Time' },
      ],
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'banner',
    label: 'Banner',
    icon: '🏷️',
    description: 'Full-width announcement banner',
    defaultContent: {
      text: '🔥 Currently accepting new orders — limited slots available',
      link_text: 'Get Started',
      link_url: '#',
    },
    defaultStyle: { width: 'full', padding: 'md', background: 'accent', textAlign: 'center' },
  },
  {
    type: 'why_me',
    label: 'Why Choose Me',
    icon: '✅',
    description: 'List of value propositions',
    defaultContent: {
      title: 'Why Choose Me',
      subtitle: 'What makes me different',
      reasons: [
        { title: 'Reason 1', description: 'Explain why.' },
        { title: 'Reason 2', description: 'Another reason.' },
      ],
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'reviews',
    label: 'Reviews',
    icon: '⭐',
    description: 'Customer review cards',
    defaultContent: {},
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'lead_form',
    label: 'Lead Form',
    icon: '📩',
    description: 'Contact / inquiry form',
    defaultContent: {
      button_text: 'Send message',
    },
    defaultStyle: { width: 'narrow', padding: 'lg', background: 'card', borderRadius: 'lg', border: 'subtle', textAlign: 'center' },
  },
  {
    type: 'links',
    label: 'Links',
    icon: '🔗',
    description: 'Social and contact links',
    defaultContent: {
      items: [
        { label: 'Discord', url: '#', icon: '💬' },
        { label: 'Telegram', url: '#', icon: '✈️' },
      ],
    },
    defaultStyle: { width: 'medium', padding: 'md', textAlign: 'center' },
  },
  {
    type: 'personal',
    label: 'About',
    icon: '👤',
    description: 'Bio and personal info',
    defaultContent: {
      title: "What's Different",
      paragraphs: ['Tell visitors about yourself...'],
    },
    defaultStyle: { width: 'medium', padding: 'md' },
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: '❓',
    description: 'Frequently asked questions',
    defaultContent: {
      title: 'FAQ',
      items: [
        { question: 'How does it work?', answer: 'Explain your process here.' },
        { question: 'How long does it take?', answer: 'Explain timelines here.' },
      ],
    },
    defaultStyle: { width: 'medium', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'divider',
    label: 'Divider',
    icon: '➖',
    description: 'Visual separator',
    defaultContent: { style: 'gradient' },
    defaultStyle: { width: 'wide', padding: 'none', marginY: 'sm' },
  },
  {
    type: 'spacer',
    label: 'Spacer',
    icon: '↕️',
    description: 'Vertical spacing',
    defaultContent: { height: 'md' },
    defaultStyle: { width: 'full', padding: 'none', marginY: 'none' },
  },
  {
    type: 'about_avatar',
    label: 'About & Avatar',
    icon: '👤',
    description: 'Personal bio with 3D avatar',
    defaultContent: {
      headline: 'Who am I?',
      paragraphs: ['Top challenger player...'],
      avatar_image: '',
    },
    defaultStyle: { width: 'wide', padding: 'lg' },
  },
  {
    type: 'comparison',
    label: 'Comparison',
    icon: '⚖️',
    description: 'Old way vs New way',
    defaultContent: {
      title: 'Current vs Past',
      subtitle: '',
      items: [
        { feature: 'Speed', oldWay: 'Slow', newWay: 'Fast' }
      ]
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'proof',
    label: 'Proof (TFT)',
    icon: '🏆',
    description: 'Verified match history elements',
    defaultContent: {
      title: 'Results',
      subtitle: 'Recent games',
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'community',
    label: 'Community',
    icon: '🌐',
    description: 'Discord/Community spotlight',
    defaultContent: {
      title: 'Join Community',
      subtitle: 'Talk with others',
      image_src: '',
      stats: [{ label: 'Members', value: '1K+' }],
      cta_text: 'Join Discord',
      cta_url: '#'
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
  {
    type: 'external',
    label: 'External Links',
    icon: '🔗',
    description: 'Partner platforms',
    defaultContent: {
      title: 'Also found on',
      subtitle: '',
      platforms: [{ name: 'Twitch', url: '#', icon_url: '' }]
    },
    defaultStyle: { width: 'wide', padding: 'lg', textAlign: 'center' },
  },
];

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  background: {
    type: 'gradient',
    value: 'from-slate-950 via-purple-950/20 to-slate-950',
  },
  accentColor: '#6d28d9',
  font: 'inter',
  spacing: 'normal',
};

let idCounter = 0;
export function generateBlockId(): string {
  return `block-${Date.now()}-${idCounter++}`;
}

// ---- Style utility maps ---------------------------------
export const WIDTH_MAP: Record<BlockStyle['width'], string> = {
  full: 'max-w-full',
  wide: 'max-w-6xl',
  medium: 'max-w-3xl',
  narrow: 'max-w-md',
};

export const PADDING_MAP: Record<BlockStyle['padding'], string> = {
  none: 'p-0',
  sm: 'px-4 py-4',
  md: 'px-6 py-8',
  lg: 'px-8 py-12',
  xl: 'px-8 py-20',
};

export const MARGIN_Y_MAP: Record<BlockStyle['marginY'], string> = {
  none: 'my-0',
  sm: 'my-2',
  md: 'my-4',
  lg: 'my-8',
};

export const RADIUS_MAP: Record<BlockStyle['borderRadius'], string> = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  xl: 'rounded-2xl',
  full: 'rounded-3xl',
};

export const SHADOW_MAP: Record<BlockStyle['shadow'], string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-xl',
  glow: 'shadow-lg shadow-purple-600/20',
};
