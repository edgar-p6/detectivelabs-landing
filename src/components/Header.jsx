'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="text-xl font-bold tracking-widest text-white hover:text-gray-300 transition">
          DETECTIVE LABS
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
          <Link href="/#caso01" className="hover:text-white transition tracking-wider">CASO #01</Link>
          <Link href="/agencia" className="hover:text-white transition tracking-wider">A AGÊNCIA</Link>
          <Link href="/#faq" className="hover:text-white transition tracking-wider">FAQS</Link>
        </nav>

        {/* BOTÃO HAMBÚRGUER (MOBILE) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none p-2 border border-white/20 rounded bg-black/50"
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* MENU MOBILE EXPANSÍVEL */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 space-y-4 text-center">
          <Link 
            href="/#caso01" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white text-lg tracking-wider py-2 border-b border-white/5"
          >
            CASO #01
          </Link>
          <Link 
            href="/agencia" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white text-lg tracking-wider py-2 border-b border-white/5"
          >
            A AGÊNCIA
          </Link>
          <Link 
            href="/#faq" 
            onClick={() => setIsOpen(false)}
            className="block text-gray-300 hover:text-white text-lg tracking-wider py-2"
          >
            FAQS
          </Link>
        </div>
      )}
    </header>
  );
}