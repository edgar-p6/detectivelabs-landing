import { createHmac } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { normalizeEmail, readSmallJson } from '@/lib/security.mjs';

export async function POST(request) {
  const reply = (body, status = 200, headers = {}) => NextResponse.json(body, {
    status, headers: { 'Cache-Control': 'no-store', ...headers },
  });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return reply({ error: 'Origem do pedido inválida.' }, 403);
  }
  let body;
  try { body = await readSmallJson(request); }
  catch (error) { return reply({ error: 'Pedido inválido.' }, error.message === 'body-too-large' ? 413 : 400); }
  const email = normalizeEmail(body?.email);
  if (!email) return reply({ error: 'Introduz um email válido.' }, 400);
  try {
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    // Only Vercel's own forwarding header is trusted; local requests share one bucket.
    const ip = process.env.VERCEL ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() : 'local';
    if (!ip || !secret) return reply({ error: 'A subscrição está temporariamente indisponível.' }, 503);
    const bucket = createHmac('sha256', secret).update(ip).digest('hex');
    const { data, error } = await createAdminClient().rpc('subscribe_email', { p_email: email, p_bucket: bucket });
    if (error) return reply({ error: 'Não foi possível guardar a subscrição. Tenta novamente mais tarde.' }, 503);
    if (!data) return reply({ error: 'Demasiados pedidos. Tenta novamente dentro de 10 minutos.' }, 429, { 'Retry-After': '600' });
    return reply({ success: true, message: 'Pedido registado. Se já estavas na lista, a tua subscrição mantém-se.' });
  } catch {
    return reply({ error: 'A subscrição está temporariamente indisponível.' }, 503);
  }
}
