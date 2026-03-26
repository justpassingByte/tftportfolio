# Feature Requirement: Landing Page Builder

## Problem Statement
Solo game boosters need a fast, simple way to build a personal landing page to showcase their skills, proof of work, and collect leads. Most website builders (like WordPress or Elementor) are too complex or overkill for their needs. They need a "multi-tenant" system where each booster can have their own page (`/u/{username}`) with pre-built templates focusing on speed and conversion.

## Goals
- Allow boosters to create a professional page in under 2 minutes.
- Support 2-3 high-quality, conversion-focused templates.
- Enable basic customization (text, media, contact links, and section toggles).
- Collect leads and reviews from visitors.
- Multi-tenancy support using Supabase (Auth, DB, Storage).

## Non-goals
- Full drag-and-drop builder like Elementor or Wix.
- Complex CMS capabilities or custom CSS/JS for users.
- Domain mapping (multi-tenant handles it via `/u/{username}` for now).
- Advanced analytics dashboard (basic lead viewing only in V1).

## User Stories
- **As a Booster**, I can select a template and customize hero text, subheadlines, and contact information.
- **As a Booster**, I can upload "Proof" images (match results) and display them in a gallery.
- **As a Booster**, I can toggle specific sections (like "Reviews" or "Why Choose Me") ON or OFF.
- **As a Visitor**, I can view a booster's page at `/u/{username}` and submit a lead form (current rank, desired rank, message).
- **As a Visitor**, I can leave a review after being boosted (requires approval).
- **As a Booster**, I can view incoming leads and approve/delete reviews from my dashboard.

## Success Criteria
- A booster can sign up, pick a template, and go live in < 2 minutes.
- The resulting page is mobile-responsive and looks professional.
- Leads are correctly stored and notify the booster (via dashboard).
- System scales to multiple users using Supabase RLS.

## Constraints
- Must use Next.js, Radix UI (or similar), and Supabase.
- No heavy libraries for builders to keep page load times fast.
- Data separation via `user_id` is critical.

## Open Questions
- What are the storage limits for proof images per booster?
- Should we provide email notifications for new leads, or just dashboard-based?
- Are templates just CSS/layout variations or and full component swaps?
