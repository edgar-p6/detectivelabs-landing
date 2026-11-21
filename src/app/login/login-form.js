'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { normalizeEmail } from '@/lib/security.mjs';

export default function LoginForm({ linkExpired, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [agentName, setAgentName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (loading) return;
    setMessage('');
    setError(false);
    const normalizedEmail = normalizeEmail(email);
    const name = agentName.trim();
    if (!normalizedEmail || (mode === 'signup' && (name.length < 2 || name.length > 40))) {
      setError(true);
      setMessage('Confirma o email e o nome de agente (entre 2 e 40 caracteres).');
      return;
    }
    setLoading(true);
    try {
      const { error: authError } = await createClient().auth.signInWithOtp({
        email: normalizedEmail,
        options: {
          shouldCreateUser: mode === 'signup',
          ...(mode === 'signup' ? { data: { agent_name: name } } : {}),
          emailRedirectTo: window.location.origin + '/auth/callback',
        },
      });
      // Supabase can reject an unknown account; keep the public response identical.
      if (authError && !['otp_disabled', 'signup_disabled'].includes(authError.code)) {
        setError(true);
        setMessage(authError.status === 429
          ? 'Aguarda um pouco antes de pedires outro link.'
          : 'Não foi possível enviar o link. Tenta novamente dentro de alguns instantes.');
        return;
      }
      setMessage('Se o pedido puder ser concluído, receberás um link por email. Abre-o neste mesmo browser e perfil.');
    } catch {
      setError(true);
      setMessage('Não foi possível contactar o serviço de acesso. Verifica a ligação e tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="account-form">
      <h2 className="account-form-heading">{mode === 'login' ? 'Entrar' : 'Criar conta de agente'}</h2>
      {linkExpired && <p className="account-message is-error" role="alert">Este link já não é válido. Pede um novo acesso.</p>}
      {mode === 'signup' && (
        <>
          <label htmlFor="agent-name">Nome de agente</label>
          <input
            id="agent-name"
            type="text"
            autoComplete="nickname"
            required
            minLength={2}
            maxLength={40}
            value={agentName}
            onChange={(event) => setAgentName(event.target.value)}
            placeholder="Nome para colocarmos no teu cartão de agente"
          />
        </>
      )}
      <p className="account-muted">O link de acesso é pessoal. Abre-o no mesmo browser onde o pedires.</p>
      <label htmlFor="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="o.teu@email.pt"
      />
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'A VERIFICAR…' : mode === 'login' ? 'ENVIAR LINK DE ACESSO' : 'CRIAR CONTA'}
      </button>
      {message && <p className={'account-message' + (error ? ' is-error' : '')} role="status">{message}</p>}
      <button
        type="button"
        disabled={loading}
        className="account-mode-toggle"
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setError(false); }}
      >
        {mode === 'login' ? 'Ainda não tens conta? Criar conta' : 'Já tens conta? Entrar'}
      </button>
      <p className="account-muted">Consulta o <Link href="/privacidade">aviso de privacidade</Link> para saberes como tratamos os dados da tua conta.</p>
    </form>
  );
}
