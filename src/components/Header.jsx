'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-header">
      <div className="nav-container">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="brand-logo">
          DETECTIVE LABS
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="nav-links">
          <Link href="/casos"className="nav-item">CASOS / LOJA</Link>
          <Link href="/agencia" className="nav-item">A AGÊNCIA</Link>
          <Link href="/treinos" className="nav-item">CENTRO DE TREINOS</Link>
          <Link href="/#faq" className="nav-item">FAQS</Link>
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
            href="/casos"
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            CASOS / LOJA
          </Link>
          <Link 
            href="/agencia" 
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            A AGÊNCIA
          </Link>
          <Link 
            href="/treinos" 
            onClick={() => setIsOpen(false)}
            className="mobile-nav-item"
          >
            CENTRO DE TREINOS
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