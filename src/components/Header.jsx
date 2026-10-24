'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-navbar" id="main-header">
      <div className="site-nav-container">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="site-brand-logo">
          DETECTIVE LABS
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="site-nav-links">
          <Link href="/#caso01" className="site-nav-item">CASO #01</Link>
          <Link href="/agencia" className="site-nav-item">A AGÊNCIA</Link>
          <Link href="/#faq" className="site-nav-item">FAQS</Link>
        </nav>

        {/* BOTÃO HAMBÚRGUER (MOBILE) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-btn"
          aria-label="Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </div>

      {/* MENU MOBILE EXPANSÍVEL */}
      {isOpen && (
        <div className="mobile-dropdown-menu">
          <Link 
            href="/#caso01" 
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            CASO #01
          </Link>
          <Link 
            href="/agencia" 
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            A AGÊNCIA
          </Link>
          <Link 
            href="/#faq" 
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            FAQS
          </Link>
        </div>
      )}
    </header>
  );
}