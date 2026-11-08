'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [agent, setAgent] = useState(null);
  const accountHref = agent ? '/conta' : '/login';
  const accountLabel = agent?.user_metadata?.agent_name?.trim() || (agent ? 'PERFIL' : 'ENTRAR');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setAgent(data.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAgent(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={'navbar ' + (scrolled ? 'scrolled' : '')} id="main-header">
      <div className="nav-container">
        <Link href="/" className="brand-logo">DETECTIVE LABS</Link>
        <nav className="nav-links">
          <Link href="/casos" className="nav-item">CASOS / LOJA</Link>
          <Link href="/agencia" className="nav-item">A AGÊNCIA</Link>
          <Link href="/treinos" className="nav-item">CENTRO DE TREINOS</Link>
          <Link href={accountHref} className="nav-item nav-login-item"><span aria-hidden="true">◉</span> {accountLabel}</Link>
        </nav>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-btn"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>
      {isOpen && (
        <div className="mobile-dropdown-menu">
          <Link href="/casos" onClick={() => setIsOpen(false)} className="mobile-nav-item">CASOS / LOJA</Link>
          <Link href="/agencia" onClick={() => setIsOpen(false)} className="mobile-nav-item">A AGÊNCIA</Link>
          <Link href="/treinos" onClick={() => setIsOpen(false)} className="mobile-nav-item">CENTRO DE TREINOS</Link>
          <Link href={accountHref} onClick={() => setIsOpen(false)} className="mobile-nav-item mobile-login-item">{accountLabel}</Link>
        </div>
      )}
    </header>
  );
}
