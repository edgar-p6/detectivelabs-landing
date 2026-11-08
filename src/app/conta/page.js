import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './sign-out-button';

export const metadata = { title: 'Área do Detetive | Detective Labs' };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: progressRows } = await supabase
    .from('training_progress')
    .select('training_slug, progress, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  return (
    <main className="account-page">
      <section className="account-panel account-panel-wide">
        <span className="badge-confidential">SESSÃO AUTORIZADA</span>
        <h1 className="account-title">ÁREA DO DETETIVE</h1>
        <p className="account-copy">Sessão iniciada como <strong>{user.email}</strong></p>

        <div className="account-section">
          <h2>Centro de treinos</h2>
          {progressRows?.length ? (
            <ul className="progress-list">
              {progressRows.map((row) => (
                <li key={row.training_slug}>
                  <span>
                    {row.training_slug.replaceAll('-', ' ')}
                    {Number.isFinite(row.progress?.pontos) && ` · ${row.progress.pontos} pontos`}
                  </span>
                  <time dateTime={row.updated_at}>Atualizado {new Date(row.updated_at).toLocaleDateString('pt-PT')}</time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="account-muted">Ainda não há progresso guardado. Quando iniciares um treino, poderás continuar daqui.</p>
          )}
          <Link href="/treinos" className="account-link">ABRIR CENTRO DE TREINOS</Link>
        </div>

        <div className="account-section">
          <h2>Casos adquiridos</h2>
          <p className="account-muted">As compras e o acesso aos casos serão ligados quando implementarmos a loja.</p>
        </div>

        <SignOutButton />
      </section>
    </main>
  );
}
