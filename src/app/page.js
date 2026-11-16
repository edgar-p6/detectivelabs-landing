'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    setMessage('A registar o teu email…');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Não foi possível registar o email. Tenta novamente.');
      setStatus('success');
      setMessage('Subscrição confirmada. Vais receber as novidades e o cupão por email.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof TypeError ? 'Não foi possível contactar o servidor. Verifica a ligação e tenta novamente.' : error.message);
    }
  }

  return (
    <main id="conteudo" className="main-wrapper noir-home">
      <section className="noir-hero" aria-labelledby="hero-title">
        <div className="noir-hero-copy">
          <h1 id="hero-title">O próximo<br />caso é teu.</h1>
          <p>Analisa provas, cruza depoimentos e descobre quem esconde a verdade.</p>
          <div className="noir-hero-actions">
            <Link href="/treinos" className="btn-primary">Resolver desafios gratuitos</Link>
            <Link href="/casos" className="noir-text-link">Ver o próximo caso</Link>
          </div>
        </div>
        <article className="noir-case-index" aria-labelledby="case-index-title">
          <span className="noir-case-number" aria-hidden="true">01</span>
          <div><p className="noir-case-state">Caso #01 em preparação</p><h2 id="case-index-title">Feliz Aniversário</h2><p>Uma festa de 20 anos.<br />Uma morte suspeita.<br />Todos têm um álibi.</p></div>
          <Link href="#caso01" className="noir-text-link">Abrir o dossiê do caso</Link>
        </article>
      </section>

      <section className="noir-training-strip" aria-labelledby="training-title">
        <h2 id="training-title">Afina o teu olhar.</h2>
        <p>Desafios gratuitos de lógica, dedução e cripto-análise.</p>
        <Link href="/treinos" className="noir-text-link">Entrar no Centro de Treinos</Link>
      </section>

      <section id="caso01" className="noir-dossier" aria-labelledby="dossier-title">
        <div className="noir-dossier-intro">
          <h2 id="dossier-title">Caso #01:<br />Feliz Aniversário</h2>
          <p className="noir-case-state">Em preparação</p>
          <Link href="/casos" className="action-button">Ver detalhes na loja</Link>
        </div>
        <div className="noir-dossier-body">
          <p className="noir-story">O que deveria ser uma festa de 20 anos inesquecível terminou em tragédia. A pedido da polícia local, a nossa agência foi encarregue de examinar a morte suspeita de uma jovem.</p>
          <p>Entre amigos íntimos e familiares, todos têm álibis perfeitos. Estão em jogo velhos segredos de família, relações amorosas complicadas e um aniversário que ninguém quer recordar.</p>
          <dl className="noir-evidence-list">
            <div><dt>Provas forenses</dt><dd>Mensagens privadas, fotografias e registos históricos recuperados.</dd></div>
            <div><dt>Documentos restritos</dt><dd>Depoimentos cruzados e relatórios confidenciais da investigação.</dd></div>
          </dl>
        </div>
      </section>

      <section id="novidades" className="noir-subscribe" aria-labelledby="subscribe-title">
        <div><h2 id="subscribe-title">Recebe a abertura<br />do próximo caso.</h2><p>Subscreve as novidades de “Feliz Aniversário” e recebe um cupão de desconto exclusivo no lançamento.</p></div>
        <div>
          {status !== 'success' && <form onSubmit={handleSubmit} className="lead-form noir-subscribe-form" aria-busy={status === 'loading'}>
            <label htmlFor="case-email">O teu email</label>
            <input id="case-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nome@exemplo.pt" required autoComplete="email" disabled={status === 'loading'} aria-describedby="subscribe-message subscribe-note" />
            <button type="submit" disabled={status === 'loading'} className="btn-primary">{status === 'loading' ? 'A registar…' : 'Receber novidades do caso'}</button>
          </form>}
          <p id="subscribe-message" className={`noir-form-message ${status}`} role={status === 'error' ? 'alert' : 'status'}>{message}</p>
          <p id="subscribe-note" className="noir-form-note">Zero spam. Recebe atualizações do caso e o teu cupão de desconto exclusivo.</p>
          <Link href="/login?modo=criar" className="noir-text-link noir-account-link">Criar conta de agente</Link>
        </div>
      </section>

      <section id="estudio" className="noir-about" aria-labelledby="about-title">
        <h2 id="about-title">Nada passa<br />despercebido.</h2>
        <div><p>Na Detective Labs, desenhamos experiências interativas de resolução de mistérios e casos policiais, com enigmas e puzzles lógicos e desafiantes. Em cada caso, assumes o papel de detetive para analisar provas que passaram despercebidas.</p><Link href="/agencia" className="noir-text-link">Conhecer a agência</Link></div>
      </section>

      <section id="faq" className="faq-section noir-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Antes de investigar.</h2>
        <div className="faq-accordion">
          <details className="faq-item"><summary className="faq-question">O que é o Caso #01: “Feliz Aniversário”?</summary><div className="faq-answer"><p>É o nosso primeiro jogo de investigação criminal digital. Como detetive atribuído ao caso, tens de analisar provas digitais, cruzar depoimentos e desvendar o mistério diretamente no teu ecrã.</p></div></details>
          <details className="faq-item"><summary className="faq-question">Como funciona o recrutamento e o cupão de desconto exclusivo?</summary><div className="faq-answer"><p>Ao registares o teu email, ficas oficialmente integrado na lista de investigadores da agência Detective Labs. Vais receber o acesso antecipado ao caso assim que este estiver disponível e um cupão de desconto exclusivo no dia do lançamento.</p></div></details>
          <details className="faq-item"><summary className="faq-question">O que é o Centro de Treinos? É gratuito?</summary><div className="faq-answer"><p>Sim, o Centro de Treinos é totalmente gratuito. Trata-se de um laboratório de acesso livre onde podes resolver mini-enigmas, quebra-cabeças lógicos e testes criptográficos para afiar as tuas capacidades analíticas.</p></div></details>
          <details className="faq-item"><summary className="faq-question">Para que servem os Pontos de Investigação acumulados?</summary><div className="faq-answer"><p>Cada enigma resolvido com sucesso na primeira tentativa atribui Pontos de Investigação ao teu perfil de agente. Estes pontos funcionam como créditos de experiência do agente e podes trocar por cupões de desconto.</p></div></details>
        </div>
      </section>
    </main>
  );
}
