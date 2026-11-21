'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  async function signOut() {
    setLoading(true);
    setMessage('');
    try {
      const { error } = await createClient().auth.signOut();
      if (error) throw error;
      router.replace('/login');
      router.refresh();
    } catch { setMessage('Não foi possível terminar a sessão. Tenta novamente.'); }
    finally { setLoading(false); }
  }
  return <><button type="button" onClick={signOut} disabled={loading} className="account-signout">{loading ? 'A TERMINAR SESSÃO…' : 'TERMINAR SESSÃO'}</button>{message && <p role="alert">{message}</p>}</>;
}
