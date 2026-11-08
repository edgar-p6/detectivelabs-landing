'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm({ linkExpired }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/conta` },
      });

      if (authError) throw authError;
      setMessage('Se o email puder receber mensagens de autenticação, receberás um link de acesso em breve.');
    } catch {
      setError(true);
      setMessage('Não foi possível enviar o link. Verifica a configuração de email e tenta novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="account-form">
      {linkExpired && <p className="account-message is-error" role="alert">Este link já não é válido. Pede um novo acesso.</p>}
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
        {loading ? 'A ENVIAR LINK…' : 'ENVIAR LINK DE ACESSO'}
      </button>
      {message && <p className={`account-message${error ? ' is-error' : ''}`} role="status">{message}</p>}
    </form>
  );
}
