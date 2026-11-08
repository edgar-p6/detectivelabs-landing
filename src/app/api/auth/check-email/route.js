import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email: rawEmail } = await request.json();
    const email = rawEmail?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Introduz um email válido.' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
    if (!url || !key) {
      return NextResponse.json({ error: 'A verificação de contas ainda não está configurada.' }, { status: 503 });
    }

    const admin = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });

    const perPage = 1000;
    for (let page = 1; page <= 100; page += 1) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) return NextResponse.json({ error: 'Não foi possível verificar o email.' }, { status: 503 });
      const registered = data.users.some((user) => user.email?.toLowerCase() === email);
      if (registered) return NextResponse.json({ registered: true });
      if (data.users.length < perPage) return NextResponse.json({ registered: false });
    }

    return NextResponse.json({ error: 'Não foi possível concluir a verificação.' }, { status: 503 });
  } catch {
    return NextResponse.json({ error: 'Pedido inválido.' }, { status: 400 });
  }
}
