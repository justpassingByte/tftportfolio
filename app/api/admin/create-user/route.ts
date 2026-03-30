import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { DEFAULT_BLOCK_STYLE } from '@/lib/block-types';
import { ngusitinkSectionOrder, getNgusitinkSectionContent } from '@/lib/data';

// Build the starter template blocks (matches the finalized homepage layout)
function getStarterBlocks(displayName: string) {
  return ngusitinkSectionOrder.map((type, index) => {
    const rawContent = getNgusitinkSectionContent(type);
    
    // Inject custom display name into the hero avatar initial
    let content = { ...rawContent };
    if (type === 'hero' && typeof content.avatar_initial === 'string') {
      content.avatar_initial = displayName.charAt(0).toUpperCase();
    }
    
    return {
      id: `tpl-${type}-${index}`,
      type,
      content,
      style: { ...DEFAULT_BLOCK_STYLE, width: type === 'hero' ? 'full' : 'wide', padding: 'lg', textAlign: ['hero', 'comparison', 'why_me', 'reviews', 'community', 'external', 'links'].includes(type) ? 'center' : 'left' },
    };
  });
}

export async function POST(request: Request) {
  try {
    // Verify caller is admin
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: role } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!role || role.role !== 'admin') {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    // Parse body
    const { email, password, username, display_name } = await request.json();
    if (!email || !password || !username || !display_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Use Supabase Admin client (service role key) to create user
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Create auth user
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !newUser.user) {
      return NextResponse.json({ error: createError?.message || 'Failed to create user' }, { status: 500 });
    }

    const userId = newUser.user.id;

    // 2. Create booster profile
    const { error: profileError } = await adminClient.from('booster_profiles').insert({
      user_id: userId,
      username,
      display_name,
    });

    if (profileError) {
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: `Profile error: ${profileError.message}` }, { status: 500 });
    }

    // 3. Assign booster role
    await adminClient.from('user_roles').insert({
      user_id: userId,
      role: 'booster',
    });

    // 4. Create page: Clone exactly from the Admin's current page
    const { data: adminPage } = await adminClient
      .from('booster_pages')
      .select('blocks, blocks_en, theme_config')
      .eq('user_id', user.id) // user.id is the admin caller
      .single();

    let newBlocks = adminPage?.blocks ? structuredClone(adminPage.blocks) : getStarterBlocks(display_name);
    let newBlocksEn = adminPage?.blocks_en ? structuredClone(adminPage.blocks_en) : [];
    let newThemeConfig = adminPage?.theme_config || { accentColor: '#6d28d9' };

    const injectAvatar = (blockArray: any[]) => {
      if (!Array.isArray(blockArray)) return;
      const heroBlock = blockArray.find(b => b.type === 'hero');
      if (heroBlock && heroBlock.content) {
        heroBlock.content.avatar_initial = display_name.charAt(0).toUpperCase();
        heroBlock.content.avatar_url = ''; // clear admin's avatar photo
      }
    };

    injectAvatar(newBlocks);
    injectAvatar(newBlocksEn);

    await adminClient.from('booster_pages').insert({
      user_id: userId,
      template_id: 'default',
      theme_config: newThemeConfig,
      blocks: newBlocks,
      blocks_en: newBlocksEn,
      is_published: true,
    });

    return NextResponse.json({ success: true, user_id: userId });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
