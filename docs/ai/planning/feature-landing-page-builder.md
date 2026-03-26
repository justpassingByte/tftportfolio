# Feature Plan: Landing Page Builder

## Execution Strategy
The feature will be built in phases, starting with the database schema and public landing page, followed by the builder interface.

## Task Breakdown

### Phase 0: Prerequisite & Setup
- [ ] **Dependencies Installation**
  - [ ] Run `npm install @supabase/supabase-js @supabase/auth-helpers-nextjs`.
  - [ ] Run `npm install @dnd-kit/core @dnd-kit/sortable` (for component dragging in builder).
- [ ] **Component Refactoring**
  - [ ] Convert all `components/sections/*.tsx` to accept content `props`.
  - [ ] Extract static text into a default `json` configuration.

### Phase 1: Database & Public Routes (Foundation)
- [ ] **Infrastructure (Supabase)**
  - [ ] Set up tables: `booster_profiles`, `booster_pages`, `booster_sections`, `proof_gallery`, `leads`, `reviews`.
  - [ ] Configure RLS (Row Level Security) for all tables.
  - [ ] Create Storage buckets: `avatars`, `banners`, `proofs`.
- [ ] **Public Landing Page (/u/[username])**
  - [ ] Implement dynamic route `app/u/[username]/page.tsx`.
  - [ ] Build `TemplateRenderer` logic.
  - [ ] Create basic `Hero`, `SectionWrapper`, and `Layout` components.
  - [ ] Implement `LeadForm` and `ReviewForm` submission logic.
- [ ] **Templates (V1)**
  - [ ] Implement "Default" / "Modern" template.
  - [ ] Implement "Minimal" template.

### Phase 2: Booster Dashboard (Builder)
- [ ] **Dashboard Layout**
  - [ ] Build sidebar navigation: (Edit Page, Layout, Proof, Reviews, Leads, Settings).
  - [ ] Create "Live Preview" panel (iframe or side-by-side).
- [ ] **Edit Page Tab**
  - [ ] Text field editors for headline, subheadline, bio, etc.
  - [ ] Section manager (toggle ON/OFF, drag-to-reorder list).
- [ ] **Media Management**
  - [ ] UI for avatar and banner uploads using `Supabase Storage`.
  - [ ] Proof image gallery uploader/deleter.
- [ ] **Layout & Theme Tab**
  - [ ] Template selector (visual cards).
  - [ ] Theme controls (accent color, spacing options).

### Phase 3: Reviews & Leads (Operations)
- [ ] **Reviews Panel**
  - [ ] List of pending/approved reviews.
  - [ ] Approve/Delete functionality.
- [ ] **Leads Panel**
  - [ ] Display list of leads with contact info, ranks, and message.
  - [ ] Status updates (new/contacted).

## Dependencies
- Supabase project must be linked.
- Authentication must be working in the app.
- Shared UI components (Radix/Lucide) should be available.

## Risks & Mitigations
- **Complexity of Builder**: Keep it simple (form-based editing) to avoid common drag-and-drop bugs.
- **Image handling**: Ensure images are optimized (resized) on upload or use a CDN for delivery.
- **Multi-tenancy isolation**: Rigorous testing of RLS to prevent data leakage between users.

## Effort Estimate
- DB & Foundations: 2-3 Days
- Public Landing Page + Templates: 3-4 Days
- Dashboard + Live Preview: 4-5 Days
- Media & Operations (Leads/Reviews): 2 Days
Total: ~2 Weeks
