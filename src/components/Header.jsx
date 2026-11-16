'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const links = [ ['/casos', 'Casos / Loja'], ['/agencia', 'A agência'], ['/treinos', 'Centro de Treinos'] ];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [agent, setAgent] = useState(null);
  const menuButton = useRef(null);
  const pathname = usePathname();
  const accountHref = agent ? '/conta' : '/login';
  const accountLabel = agent?.user_metadata?.agent_name?.trim() || (agent ? 'Perfil' : 'Entrar');

  useEffect(() => {
    const supabase = createClient();
    let active = true;
    supabase.auth.getUser().then(({ data }) => { if (active) setAgent(data.user || null); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setAgent(session?.user || null));
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Escape' && isOpen) {
      setIsOpen(false);
      menuButton.current?.focus();
    }
  }

  return (
    <header className="navbar" id="main-header" onKeyDown={handleKeyDown}>
      <a className="skip-link" href="#main-content">Saltar para o conteúdo</a>
      <div className="nav-container">
        <Link href="/" className="brand-logo" aria-label="Detective Labs, página inicial">Detective Labs</Link>
        <nav className="nav-links" aria-label="Navegação principal">
          {links.map(([href, label]) => <Link key={href} href={href} className="nav-item" aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
          <Link href={accountHref} className="nav-item nav-login-item" aria-current={pathname === accountHref ? 'page' : undefined}>{accountLabel}</Link>
        </nav>
        <button ref={menuButton} type="button" onClick={() => setIsOpen(!isOpen)} className="mobile-menu-btn" aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={isOpen} aria-controls="mobile-navigation"><span className="hamburger-line" /><span className="hamburger-line" /><span className="hamburger-line" /></button>
      </div>
      <nav id="mobile-navigation" className="mobile-dropdown-menu" aria-label="Navegação móvel" hidden={!isOpen}>
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setIsOpen(false)} className="mobile-nav-item" aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}
        <Link href={accountHref} onClick={() => setIsOpen(false)} className="mobile-nav-item mobile-login-item">{accountLabel}</Link>
      </nav>
    </header>
  );
}
