import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { display_name, email, discord, game, message } = body;

    if (!display_name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase.from('booster_applications').insert({
      display_name,
      email,
      discord: discord || null,
      game: game || 'TFT',
      message: message || null,
    });

    if (error) {
      console.error('Application insert error:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
