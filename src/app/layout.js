import Header from '@/components/Header';
import Link from 'next/link';
import './globals.css';
import './noir.css';

export const metadata = {
  title: 'Detective Labs | Agência de Investigação Criminal',
  description: 'Agência privada de investigação criminal digital. Analisa provas, decifra ficheiros e desvenda o Caso #01: Feliz Aniversário.',
  keywords: 'jogos de investigação, detective labs, indie games, jogos de mistério, escape room online, investigação criminal',
  authors: [{ name: 'Detective Labs' }],
  openGraph: {
    title: 'Detective Labs | Agência de Investigação',
    description: 'Agência privada de investigação criminal. Prepara-te para o Caso #01: Feliz Aniversário.',
    type: 'website',
    url: 'https://detectivelabs.pt',
    images: ['https://detectivelabs.pt/icon.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <head><link rel="apple-touch-icon" href="/icon.png" />{process.env.VERCEL && <script defer src="/_vercel/insights/script.js" />}</head>
      <body>
        <Header />
        <div id="main-content" tabIndex={-1}>{children}</div>
        <footer className="site-footer"><div className="footer-container"><p>&copy; Detective Labs. Agência de Investigação Criminal Digital.</p><span className="footer-status">Investigação digital, Portugal</span><Link href="/privacidade" className="noir-text-link">Privacidade</Link></div></footer>
      </body>
    </html>
  );
}
