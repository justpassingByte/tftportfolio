import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { booster_id, contact_info, current_rank, desired_rank, message } = body;

    if (!booster_id || !contact_info) {
      return NextResponse.json(
        { error: 'booster_id and contact_info are required' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project')) {
      const { createClient } = await import('@/lib/supabase/server');
      const supabase = await createClient();

      const { error } = await supabase.from('leads').insert({
        booster_id,
        contact_info,
        current_rank,
        desired_rank,
        message,
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    // In mock mode, just log and return success
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
