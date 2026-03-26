import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

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
      // Clean up: delete the auth user if profile creation fails
      await adminClient.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: `Profile error: ${profileError.message}` }, { status: 500 });
    }

    // 3. Assign booster role
    await adminClient.from('user_roles').insert({
      user_id: userId,
      role: 'booster',
    });

    // 4. Create default page
    await adminClient.from('booster_pages').insert({
      user_id: userId,
      blocks: [],
      is_published: false,
    });

    return NextResponse.json({ success: true, user_id: userId });
  } catch (err) {
    console.error('Create user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
