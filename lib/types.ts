// ============================================================
// Landing Page Builder — Shared Types
// ============================================================

// ---- Section type enum -----------------------------------
export type SectionType =
  | 'hero'
  | 'proof'
  | 'personal'
  | 'why_me'
  | 'reviews'
  | 'lead_form'
  | 'community'
  | 'external';

// ---- Theme / Layout --------------------------------------
export interface ThemeConfig {
  accent_color: string;       // hex, e.g. "#6d28d9"
  spacing: 'compact' | 'normal' | 'spacious';
  mode: 'dark' | 'light';
}

// ---- Contact links ---------------------------------------
export interface ContactLinks {
  discord?: string;
  telegram?: string;
  discord_server?: string;
  custom?: string;
}

// ---- Booster profile -------------------------------------
export interface BoosterProfile {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  contact_links: ContactLinks;
  created_at: string;
}

// ---- Booster page ----------------------------------------
export interface BoosterPage {
  id: string;
  user_id: string;
  template_id: 'default' | 'modern' | 'minimal';
  theme_config: ThemeConfig;
  section_order: SectionType[];
  is_published: boolean;
}

// ---- Per-section content shapes --------------------------
export interface HeroContent {
  headline: string;
  headline_highlight?: string;
  subheadline: string;
  trust_badges: string[];
  avatar_initial?: string;
  cta_primary?: string;
  cta_secondary?: string;
}

export interface ProofItem {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  caption?: string;
  tags: string[];
  size: 'small' | 'medium' | 'large';
}

export interface PersonalContent {
  title: string;
  paragraphs: string[];
}

export interface WhyChooseItem {
  title: string;
  description: string;
}

export interface WhyChooseContent {
  title: string;
  subtitle: string;
  reasons: WhyChooseItem[];
}

export interface ReviewItem {
  id: string;
  username: string;
  rank_before: string;
  rank_after: string;
  days?: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export interface CommunityContent {
  title: string;
  description: string;
  link_text: string;
  link_url: string;
}

export interface ExternalContent {
  title: string;
  description: string;
  link_text: string;
  link_url: string;
}

// ---- Lead ------------------------------------------------
export interface Lead {
  id: string;
  booster_id: string;
  contact_info: string;
  current_rank: string;
  desired_rank: string;
  message: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}

// ---- Booster section (DB row) ----------------------------
export interface BoosterSection {
  id: string;
  page_id: string;
  type: SectionType;
  content: Record<string, unknown>;
  is_enabled: boolean;
  order_index: number;
}

// ---- Full page data (aggregated for rendering) -----------
export interface BoosterPageData {
  profile: BoosterProfile;
  page: BoosterPage;
  sections: BoosterSection[];
  proof_items: ProofItem[];
  reviews: ReviewItem[];
}
