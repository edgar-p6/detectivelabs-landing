import LoginForm from './login-form';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Acesso de Agente | Detective Labs' };

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/conta');
  const params = await searchParams;
  return (
    <main className="account-page">
      <section className="account-panel">
        <span className="badge-confidential">ACESSO À AGÊNCIA</span>
        <h1 className="account-title">IDENTIFICAÇÃO DO DETETIVE</h1>
        <p className="account-copy">Introduz o teu email e enviamos um link seguro para entrares na tua conta. Sem palavra-passe.</p>
        <LoginForm linkExpired={params?.erro === 'link-invalido'} />
      </section>
    </main>
  );
}
