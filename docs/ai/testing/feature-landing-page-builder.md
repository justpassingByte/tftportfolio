# Feature Testing: Landing Page Builder

## Test Plan

### Database & Security (Manual/Auto)
- [ ] **RLS Check**: User A cannot update User B's page data or leads.
- [ ] **Data isolation**: User A cannot see User B's storage buckets or individual images.
- [ ] **Public access**: Visitors can view pages without being logged in.

### Public Landing Page (UI/E2E)
- [ ] **Responsive check**: Verify Hero and Section components look good on mobile and desktop.
- [ ] **Template Swapper**: Switch between 'Default' and 'Minimal' templates.
- [ ] **Lead Submission**: Verify lead data is stored in DB upon submission.
- [ ] **Review Submission**: Verify reviews are stored as 'Pending' and not visible until approved.

### Dashboard / Builder (UI/E2E)
- [ ] **Text editing**: Verify changes to headlines and bio are saved correctly.
- [ ] **Section Toggle**: Toggle sections ON/OFF and verify they disappear from public view.
- [ ] **Order Management**: Reorder sections and verify the new order on the public page.
- [ ] **Media Upload**: Upload avatar and banner; verify persistence.
- [ ] **Review Approval**: Approve a review in the dashboard and verify it appears on the public page.

## Testing Tools
- Playwright / Vitest for automated tests.
- Supabase Studio for direct DB verification during manual tests.
