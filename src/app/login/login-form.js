'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm({ linkExpired, initialMode = 'login' }) {
  const router = useRouter();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [agentName, setAgentName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function checkEmail(value) {
    const response = await fetch('/api/auth/check-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: value }),
    });
    const result = await response.json();
    return { response, result };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const { response: checkResponse, result: checkResult } = await checkEmail(normalizedEmail);
      if (!checkResponse.ok && checkResponse.status !== 503) throw new Error(checkResult.error || 'Não foi possível verificar o email.');
      const registered = checkResponse.ok ? checkResult.registered : null;

      if (mode === 'login' && registered === false) {
        setMode('signup');
        setMessage('Este email ainda não tem conta. Define o teu nome de agente para criar uma.');
        setLoading(false);
        return;
      }

      if (mode === 'signup' && registered === true) {
        setMode('login');
        setMessage('Este email já tem conta. Envia um link de acesso para entrar.');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      if (mode === 'login') {
        const { error: authError } = await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: window.location.origin + '/auth/callback?next=/conta',
          },
        });
        if (authError) throw authError;
        setMessage(registered === null ? 'Se já tens conta, receberás um link seguro. Se ainda não tens, usa o botão de criar conta abaixo.' : 'Se o email estiver registado, receberás um link seguro para entrar.');
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email: normalizedEmail,
          options: {
            data: { agent_name: agentName.trim() },
            emailRedirectTo: window.location.origin + '/auth/callback?next=/conta',
          },
        });
        if (authError) throw authError;
        if (data.user?.identities?.length === 0) {
          setMode('login');
          setMessage('Este email já tem conta. Envia um link de acesso para entrar.');
        } else if (data.session) {
          router.push('/conta');
          router.refresh();
        } else {
          setMessage('Conta criada. Confirma o endereço através do link que enviámos por email.');
        }
      }
    } catch (submitError) {
      setError(true);
      setMessage(submitError.message || 'Não foi possível concluir o pedido. Tenta novamente.');
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
        className="account-mode-toggle"
        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setError(false); }}
      >
        {mode === 'login' ? 'Ainda não tens conta? Criar conta' : 'Já tens conta? Entrar'}
      </button>
    </form>
  );
}
