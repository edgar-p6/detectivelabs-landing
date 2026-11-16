import Link from 'next/link';

export const metadata = {
  title: 'Casos & Loja | Detective Labs',
  description: 'Explora os casos de investigação da Detective Labs. O Caso #01 estará disponível em breve.',
};

export default function CasosPage() {
  return (
    <main className="main-wrapper cases-page interior-page">
      <section className="cases-hero">
        <h1 className="interior-page-title">Escolhe o teu próximo caso.</h1>
        <p className="interior-page-subtitle">Investigações interativas, provas digitais e mistérios para resolver ao teu ritmo. O arquivo está a ser preparado.</p>
      </section>

      <section className="case-store-card" aria-labelledby="case-one-title">
        <div className="case-cover-visual" aria-hidden="true">
          <div className="case-cover-topline"><span>DETECTIVE LABS</span><span>ARQUIVO 001</span></div>
          <div className="case-cover-orbit case-cover-orbit-one" />
          <div className="case-cover-orbit case-cover-orbit-two" />
          <div className="case-cover-number">01</div>
          <span className="case-cover-stamp">CONFIDENCIAL</span>
          <span className="case-cover-foot">CASO PRINCIPAL • PORTUGAL</span>
        </div>

        <div className="case-store-details">
          <div className="case-store-tags"><span>Caso principal</span><span className="case-status-tag">Em preparação</span></div>
          <h2 id="case-one-title">Caso #01: “Feliz Aniversário”</h2>
          <p className="case-store-description">Uma festa de 20 anos termina em tragédia. Entre amigos e familiares, todos parecem ter um álibi perfeito. Analisa provas, cruza depoimentos e descobre quem está a esconder a verdade.</p>

          <div className="case-feature-list">
            <div><span aria-hidden="true">⌕</span><div><strong>Investigação digital</strong><small>Analisa cada detalhe do dossiê</small></div></div>
            <div><span aria-hidden="true">▤</span><div><strong>Provas e depoimentos</strong><small>Informação para cruzar e interpretar</small></div></div>
            <div><span aria-hidden="true">✦</span><div><strong>Uma história interativa</strong><small>As tuas deduções conduzem o caso</small></div></div>
          </div>

          <div className="case-store-actions">
            <button type="button" className="case-coming-button" disabled>Disponível em breve</button>
            <Link href="/#novidades" className="case-notify-link action-button action-button-secondary">Receber novidades do caso</Link>
          </div>
          <p className="case-store-note">Este caso ainda não está disponível para compra.</p>
        </div>
      </section>

      <section className="cases-next-steps">
        <div><h2>Continua a treinar as tuas deduções.</h2><p>Resolve desafios gratuitos no Centro de Treinos e prepara-te para o próximo dossiê.</p></div>
        <Link href="/treinos" className="cases-training-link action-button">Resolver desafios gratuitos</Link>
      </section>

      <nav className="cases-secondary-links" aria-label="Mais sobre a Detective Labs">
        <Link href="/agencia" className="action-button action-button-subtle">Conhecer a agência</Link>
        <Link href="/#faq" className="action-button action-button-subtle">Perguntas frequentes</Link>
        <Link href="/" className="action-button action-button-subtle">Voltar à página inicial</Link>
      </nav>
    </main>
  );
}
