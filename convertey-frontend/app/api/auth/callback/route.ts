// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirectTo = requestUrl.searchParams.get('redirect') || '/';

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Auth callback error:', error);
        return NextResponse.redirect(new URL('/login?error=auth_callback_error', request.url));
      }
      
      // Successful authentication - redirect to intended destination
      return NextResponse.redirect(new URL(redirectTo, request.url));
    } catch (error) {
      console.error('Unexpected auth callback error:', error);
      return NextResponse.redirect(new URL('/login?error=unexpected_error', request.url));
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL('/login', request.url));
}