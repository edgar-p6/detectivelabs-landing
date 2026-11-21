import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Usa o formulário de acesso para receberes um link por email.' }, {
    status: 410, headers: { 'Cache-Control': 'no-store' },
  });
}
