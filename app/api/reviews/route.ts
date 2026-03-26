import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booster_id, username, rank_before, rank_after, content } = body;

    if (!booster_id || !username || !content) {
      return NextResponse.json(
        { error: 'booster_id, username, and content are required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { error } = await supabase.from('reviews').insert({
        booster_id,
        username,
        rank_before,
        rank_after,
        content,
        is_approved: false, // Requires booster approval
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
