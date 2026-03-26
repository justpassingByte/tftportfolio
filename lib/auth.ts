import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Server-side auth guard — call at the top of any protected page's server component.
 * Returns the authenticated user or redirects to /login.
 */
export async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}

/**
 * Server-side admin guard — redirects non-admins to /dashboard.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!role || role.role !== 'admin') {
    redirect('/dashboard');
  }

  return user;
}
