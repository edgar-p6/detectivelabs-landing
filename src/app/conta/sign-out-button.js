'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const { error } = await createClient().auth.signOut();
    if (!error) router.replace('/login');
    setLoading(false);
  }

  return <button type="button" onClick={signOut} disabled={loading} className="account-signout">{loading ? 'A TERMINAR SESSÃO…' : 'TERMINAR SESSÃO'}</button>;
}
