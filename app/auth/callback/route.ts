import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const redirect = searchParams.get('redirect') || '/dashboard';
  const isNewUser = searchParams.get('new') === 'true';

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerSupabaseClient();
    
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }

    if (data.user && isNewUser) {
      // Create user profile in MongoDB for OAuth users
      try {
        await fetch(`${origin}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            supabaseId: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            emailVerified: true,
          }),
        });
      } catch (error) {
        console.error('Failed to create user profile:', error);
      }
    }

    return NextResponse.redirect(`${origin}${redirect}`);
  }

  return NextResponse.redirect(`${origin}/login?error=no_code`);
}
