'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { updateAgentName } from './actions';

export default function ProfileForm({ initialName = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const lastPathname = useRef(pathname);
  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    const resetTimer = window.setTimeout(() => {
      setMessage('');
      setError(false);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [pathname]);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError(false);
    const result = await updateAgentName(name);
    setLoading(false);
    if (result.error) {
      setError(true);
      setMessage(result.error);
      return;
    }
    setMessage('Nome de agente atualizado.');
    window.setTimeout(() => setMessage(''), 4000);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="account-form profile-form">
      <label htmlFor="profile-agent-name">Nome de agente</label>
      <input
        id="profile-agent-name"
        type="text"
        autoComplete="nickname"
        required
        minLength={2}
        maxLength={40}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'A GUARDAR…' : 'GUARDAR ALTERAÇÕES'}
      </button>
      {message && <p className={'account-message' + (error ? ' is-error' : '')} role="status">{message}</p>}
    </form>
  );
}



