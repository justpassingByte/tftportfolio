import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  MOCK_USERS,
  ngusitinkSectionOrder,
  getNgusitinkSectionContent,
} from '@/lib/data';
import { DEFAULT_BLOCK_STYLE } from '@/lib/block-types';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Missing Supabase keys. Set SUPABASE_SERVICE_ROLE_KEY in .env.local' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const mock = MOCK_USERS['ngusitink'];

  // ── 1. Create or find auth user ───────────────
  let userId = ''; 
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email: 'ngusitink@tacticianclimb.com',
    password: 'Password123!',
    email_confirm: true,
  });

  if (authErr && authErr.code !== 'email_exists' && !authErr.message.includes('already registered')) {
    return NextResponse.json({ step: 'auth', error: authErr });
  }
  
  if (authUser?.user) {
    userId = authUser.user.id;
  } else {
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existing = usersData.users.find(u => u.email === 'ngusitink@tacticianclimb.com');
    if (existing) userId = existing.id;
  }

  if (!userId) {
    return NextResponse.json({ step: 'auth_missing', message: 'Could not find or create user' });
  }

  // ── 2. Ensure admin role ──────────────────────
  const { error: roleErr } = await supabase.from('user_roles').upsert({
    user_id: userId,
    role: 'admin',
  }, { onConflict: 'user_id' });

  // ── 3. Upsert booster profile ─────────────────
  const { error: pErr } = await supabase.from('booster_profiles').upsert({
    user_id: userId,
    username: mock.profile.username,
    display_name: mock.profile.display_name,
    avatar_url: mock.profile.avatar_url,
    bio: mock.profile.bio,
    contact_links: mock.profile.contact_links,
  });

  if (pErr) return NextResponse.json({ step: 'booster_profiles', error: pErr });

  // ── 4. Build full blocks array for page builder ─
  const fullBlocks = ngusitinkSectionOrder.map((type, index) => {
    const rawContent = getNgusitinkSectionContent(type);
    
    // Inject literal ngusitink initial
    let content = { ...rawContent };
    
    return {
      id: `seed-${type}-${index}`,
      type,
      content,
      style: { ...DEFAULT_BLOCK_STYLE, width: type === 'hero' ? 'full' : 'wide', padding: 'lg', textAlign: ['hero', 'comparison', 'why_me', 'reviews', 'community', 'external', 'links'].includes(type) ? 'center' : 'left' },
    };
  });

  const pagePayload = {
    user_id: userId,
    template_id: 'default',
    theme_config: {
      accent_color: '#6d28d9',
      accentColor: '#6d28d9',
      background_color: '#0f172a',
      font_family: 'inter',
      spacing: 'normal',
      mode: 'dark',
    },
    section_order: [],
    is_published: true,
    blocks: fullBlocks,
    blocks_en: [],
  };

  const { data: existingPage } = await supabase.from('booster_pages').select('id').eq('user_id', userId).single();
  let pageErr;

  if (existingPage) {
    const { error } = await supabase.from('booster_pages').update(pagePayload).eq('user_id', userId);
    pageErr = error;
  } else {
    const { error } = await supabase.from('booster_pages').insert([pagePayload]);
    pageErr = error;
  }

  if (pageErr) return NextResponse.json({ step: 'booster_pages', error: pageErr });

  return NextResponse.json({ 
    success: true, 
    message: 'Database seeded successfully!',
    details: {
      userId,
      username: 'ngusitink',
      email: 'ngusitink@tacticianclimb.com',
      role: roleErr ? `role upsert warning: ${roleErr.message}` : 'admin',
      blocksCount: fullBlocks.length,
    }
  });
}
