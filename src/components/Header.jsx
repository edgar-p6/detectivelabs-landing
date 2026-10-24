'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGÓTIPO */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-widest text-white">DETECTIVE LABS</span>
        </Link>

        {/* NAVEGAÇÃO DESKTOP (Intocada e alinhada) */}
        <nav className="hidden md:flex items-center space-x-8 text-sm text-gray-300">
          <Link href="/#caso-01" className="hover:text-white transition">CASO #01</Link>
          <Link href="/agencia" className="hover:text-white transition">A AGÊNCIA</Link>
          <Link href="/#faqs" className="hover:text-white transition">FAQS</Link>
        </nav>

        {/* BOTÃO HAMBÚRGUER (Aparece apenas em Mobile) */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none p-2"
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

      {/* MENU MOBILE EXPANSÍVEL (Estética Noir) */}
      {isOpen && (
        <div className="md:hidden bg-black/95 border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
          <Link 
            href="/#caso-01" 
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
            href="/#faqs" 
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