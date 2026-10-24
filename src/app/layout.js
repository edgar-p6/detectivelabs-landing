import Header from '@/components/Header';
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
      <body className="bg-black text-white antialiased overflow-x-hidden">
        <div className="ambient-glow" />

        {/* Novo Header Global com Menu Hambúrguer */}
        <Header />

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