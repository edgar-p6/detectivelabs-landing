import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './sign-out-button';
import ProfileForm from './profile-form';
import { getTrainingProgress } from './actions';
import { agentName } from '@/lib/security.mjs';

export const metadata = { title: 'Área do Detetive | Detective Labs' };

export const instant = false;

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const result = await getTrainingProgress();
  const progressRows = result.progress?.jogos || [];

  return (
    <main className="account-page">
      <section className="account-panel account-panel-wide">
        <span className="badge-confidential">SESSÃO AUTORIZADA</span>
        <h1 className="account-title">{agentName(user, 'ÁREA DO DETETIVE')}</h1>
        <p className="account-copy">Sessão iniciada como <strong>{user.email}</strong></p>

        <div className="account-section">
          <h2>Perfil de agente</h2>
          <ProfileForm initialName={agentName(user)} />
        </div>

        <div className="account-section">
          <h2>Centro de treinos</h2>
          {result.legacyProgress && <p className="account-muted">O histórico da versão de testes anterior foi conservado. Nesta versão, os pontos são validados ao concluíres novamente cada desafio.</p>}
          {result.error ? <p role="alert">{result.error}</p> : progressRows.length ? (
            <ul className="progress-list">
              {progressRows.map((row) => (
                <li key={row.id}>
                  <span>
                    {row.id.replaceAll('-', ' ')}
                    {` · ${row.estatisticas.pontosGanhos} pontos`}
                  </span>
                  <span>Melhor tempo: {row.tempo}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="account-muted">Ainda não há progresso guardado. Quando iniciares um treino, poderás continuar daqui.</p>
          )}
          <Link href="/treinos" className="account-link action-button">ABRIR CENTRO DE TREINOS</Link>
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
