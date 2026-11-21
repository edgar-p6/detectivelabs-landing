import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { safeNext } from '@/lib/security.mjs';

export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const destination = safeNext(url.searchParams.get('next'));
  if (code && code.length <= 2048) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return NextResponse.redirect(new URL(destination, url.origin), {
        headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
      });
    } catch { /* An unavailable auth service also needs a recoverable login screen. */ }
  }
  return NextResponse.redirect(new URL('/login?erro=link-invalido', url.origin), {
    headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' },
  });
}
