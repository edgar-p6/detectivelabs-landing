import LoginForm from './login-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Acesso de Agente | Detective Labs' };

export const instant = false;

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/conta');
  const params = await searchParams;
  const initialMode = params?.modo === 'criar' ? 'signup' : 'login';
  return (
    <main className="account-page">
      <section className="account-panel">
        <span className="badge-confidential">ACESSO À AGÊNCIA</span>
        <h1 className="account-title">IDENTIFICAÇÃO DO DETETIVE</h1>
        <p className="account-copy">Entra numa conta existente ou cria uma conta nova com o teu email e nome de agente.</p>
        <LoginForm linkExpired={params?.erro === 'link-invalido'} initialMode={initialMode} />
      </section>
    </main>
  );
}
