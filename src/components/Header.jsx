'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar" id="main-header">
      <div className="nav-container">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="brand-logo">
          DETECTIVE LABS
        </Link>

        {/* NAVEGAÇÃO DESKTOP (Visível apenas em ecrãs grandes) */}
        <nav className="nav-links">
          <Link href="/#caso01" className="nav-item">CASO #01</Link>
          <Link href="/agencia" className="nav-item">A AGÊNCIA</Link>
          <Link href="/#faq" className="nav-item">FAQS</Link>
        </nav>

        {/* BOTÃO HAMBÚRGUER (Visível apenas em telemóveis) */}
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

      {/* MENU MOBILE EXPANSÍVEL (Estética Noir) */}
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