import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 1. Verify caller is admin via standard session
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

    // 2. Parse body
    const { target_user_id } = await request.json();
    if (!target_user_id) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    // 3. Initialize Admin Client to bypass RLS and interact with auth.users
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 4. Clean up related public tables directly (fail-safe for ON DELETE CASCADE)
    await adminClient.from('booster_pages').delete().eq('user_id', target_user_id);
    await adminClient.from('booster_profiles').delete().eq('user_id', target_user_id);
    await adminClient.from('user_roles').delete().eq('user_id', target_user_id);

    // 5. Delete core auth user from Supabase identity
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(target_user_id);
    
    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
