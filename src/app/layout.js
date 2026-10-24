import './globals.css';

export const metadata = {
  title: 'Detective Labs | Agência de Investigação Criminal',
  description: 'Agência privada de investigação criminal digital. Analise provas, decifre ficheiros e desvende o Caso #01: Feliz Aniversário.',
  keywords: 'jogos de investigação, detective labs, indie games, jogos de mistério, escape room online, investigação criminal',
  authors: [{ name: 'Detective Labs' }],
  openGraph: {
    title: 'Detective Labs | Agência de Investigação',
    description: 'Agência privada de investigação criminal. Prepare-se para o Caso #01: Feliz Aniversário.',
    type: 'website',
    url: 'https://detectivelabs.pt',
    images: ['https://detectivelabs.pt/preview.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        {/* Vercel Analytics */}
        <script defer src="/_vercel/insights/script.js"></script>
      </head>
      <body>
        <div className="ambient-glow" />

        {/* Navegação Discreta / Header Fixo */}
        <header className="navbar" id="main-header">
          <div className="nav-container">
            <a href="/" className="brand-logo">DETECTIVE LABS</a>
            <nav className="nav-links">
              <a href="/#caso01" className="nav-item">CASO #01</a>
              <a href="/agencia" className="nav-item">A AGÊNCIA</a>
              <a href="/#faq" className="nav-item">FAQS</a>
            </nav>
          </div>
        </header>

        {children}

        {/* Rodapé */}
        <footer className="site-footer">
          <div className="footer-container">
            <p>&copy; Detective Labs. Agência de Investigação Criminal Digital.</p>
            <span className="footer-status">SISTEMA OPERACIONAL • PORTUGAL</span>
          </div>
        </footer>
      </body>
    </html>
  );
}