# Feature Design: Landing Page Builder

## Architecture Overview
The system will follow a multi-tenant pattern where each booster's content is identified by their `user_id` in Supabase. A dynamic route `app/u/[username]/page.tsx` will fetch data for the given username and render the selected template.

## Data Models (Supabase)

### `booster_profiles`
- `user_id` (UUID, PK, FK to auth.users)
- `username` (text, unique, for vanity URL /u/{username})
- `display_name` (text)
- `avatar_url` (text)
- `banner_url` (text)
- `bio` (text)
- `contact_links` (jsonb: { discord, telegram, discord_server, custom })
- `created_at` (timestamptz)

### `booster_pages`
- `id` (UUID, PK)
- `user_id` (UUID, FK to booster_profiles)
- `template_id` (text: 'default', 'modern', 'minimal')
- `theme_config` (jsonb: { accent_color, spacing: 'compact'|'normal'|'spacious', mode: 'dark'|'light' })
- `section_order` (text array: identifiers of sections)
- `is_published` (boolean)

### `booster_sections`
- `id` (UUID, PK)
- `page_id` (UUID, FK to booster_pages)
- `type` (text: 'hero', 'proof', 'why_me', 'reviews', 'lead_form', 'community')
- `content` (jsonb: specific to section type)
- `is_enabled` (boolean)
- `order_index` (integer)

### `proof_gallery`
- `id` (UUID, PK)
- `user_id` (UUID, FK to booster_profiles)
- `image_url` (text)
- `caption` (text)
- `order_index` (integer)

### `leads`
- `id` (UUID, PK)
- `booster_id` (UUID, FK to booster_profiles)
- `contact_info` (text)
- `current_rank` (text)
- `desired_rank` (text)
- `message` (text)
- `status` (text: 'new', 'contacted', 'completed')
- `created_at` (timestamptz)

### `reviews`
- `id` (UUID, PK)
- `booster_id` (UUID, FK to booster_profiles)
- `username` (text)
- `rank_before` (text)
- `rank_after` (text)
- `content` (text)
- `is_approved` (boolean, default false)
- `created_at` (timestamptz)

## API / Interfaces
- **GET** `/api/u/{username}`: Public endpoint to fetch page data for rendering.
- **POST** `/api/leads`: Public endpoint for submitting leads.
- **POST** `/api/reviews`: Public endpoint for submitting reviews.
- **PATCH** `/api/booster/page`: Authenticated endpoint to update page builder settings.
- **POST** `/api/booster/media`: Authenticated endpoint for image uploads to Supabase Storage.

## Components
- `TemplateRenderer`: Switches based on `template_id`.
- `SectionWrapper`: Standard layout for each page section (spacing, responsive padding).

### Existing UI Components (Refactor to Dynamic)
The following static components exist and must be refactored to accept `content` data from the DB:
- `HeroSection`: (currently `components/sections/hero.tsx`) - Headline, subheadline, avatar.
- `ProofGrid`: (currently `components/sections/proof.tsx`) - Gallery of match screenshots.
- `PersonalSection`: (currently `components/sections/personal.tsx`) - Bio and unique selling points.
- `WhyChooseMe`: (currently `components/sections/why-choose.tsx`) - Value propositions.
- `ReviewList`: (currently `components/sections/reviews.tsx`) - User reviews grid.
- `LeadFormCard`: (currently `components/sections/lead-form.tsx`) - Contact submission.
- `CommunityLinks`: (currently `components/sections/community.tsx` and `external-platform.tsx`) - Discord/TG links.

## Dashboard Components
- `DashboardSidebar`: Navigation for builder categories.
- `LivePreviewOverlay`: To show changes in real-time.
- `SectionToggleGrid`: List of sections with ON/OFF switches and drag-to-reorder handles.

## Security & Performance
- **RLS**: Enable Row Level Security on all tables. Users only `SELECT/INSERT/UPDATE` where `user_id = auth.uid()`.
- **Vanity URL cache**: For performance, the public landing pages should be cached or use Incremental Static Regeneration (ISR) with a short revalidation period.
- **Storage Buckets**: `avatars`, `banners`, `proofs` (private buckets for boosters, public-read for others).

## Design Decisions
- **JSONB for Content**: Used for section content to allow flexibility between different section types (hero vs. community links).
- **Template Swapper**: Templates are UI skins for the same data, ensuring high conversion across styles.
- **No drag-and-drop code**: Using an ordered list for section reordering.
