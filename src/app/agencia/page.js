export default function AgenciaPage() {
  return (
    <main className="main-wrapper" style={{ paddingBottom: '80px' }}>
      {/* Hero Section da Agência */}
      <section className="hero-section" style={{ paddingTop: '60px', paddingBottom: '40px' }}>
        <div className="status-pill">
          <span className="status-dot"></span>
          PÁGINA INSTITUCIONAL • DETECTIVE LABS
        </div>
        
        <h1 className="hero-title" style={{ fontSize: '2.4rem' }}>A AGÊNCIA</h1>
        <p className="hero-subtitle">Conhece a origem da Detective Labs e o que nos motiva a criar experiências de investigação únicas.</p>
      </section>

      {/* Conteúdo Principal do Estúdio */}
      <section className="case-showcase" style={{ marginTop: '20px' }}>
        <div className="case-card-glow"></div>
        <div className="case-content">
          <div className="case-badge-group">
            <span className="badge-confidential">INFORMAÇÃO CONFIDENCIAL</span>
          </div>

          <h2 className="case-title">QUEM SOMOS</h2>
          
          {/* Parágrafos com margens controladas e próximas */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p className="case-description" style={{ margin: '0 0 12px 0' }}>
              A <strong>Detective Labs</strong> nasceu de uma paixão partilhada a dois. Fundada por um casal fascinado pelo universo do mistério e da investigação criminal, a agência é o resultado natural de anos dedicados a resolver enigmas, explorar romances criminais e desvendar histórias de suspense.
            </p>
            
            <p className="case-description" style={{ margin: '0 0 12px 0' }}>
              Foi precisamente essa paixão que fez nascer a vontade de ir mais longe: deixar de ser apenas leitores e jogadores para passar a criar as nossas próprias experiências de investigação.
            </p>

            <p className="case-description" style={{ margin: '0 0 12px 0' }}>
              Assim sendo, a missão da Detective Labs é transformar qualquer pessoa num verdadeiro investigador. Em cada caso que desenvolvemos, tu não és um mero espectador de uma história linear — és o investigador principal encarregue de analisar provas forenses, cruzar depoimentos e desvendar verdades ocultas.
            </p>

            <p className="case-description" style={{ margin: '0 0 0 0' }}>
              Mais do que criar jogos, o nosso objetivo é proporcionar experiências inesquecíveis, onde a curiosidade e o mistério ganham vida em cada caso por resolver.
            </p>
          </div>

          {/* Pilares da Agência */}
          <div className="spec-grid" style={{ marginTop: '40px' }}>
            <div className="spec-card">
              <div className="spec-icon">📝</div>
              <h3>Imersão Total</h3>
              <p>Casos constituídos por narrativas envolventes, pistas realistas e desafios intelectuais que testam o raciocínio lógico e a atenção ao detalhe.</p>
            </div>
            <div className="spec-card">
              <div className="spec-icon">🎯</div>
              <h3>Foge à Rotina</h3>
              <p>Quer jogues sozinho ou trabalhes em equipa com amigos e família, os nossos casos oferecem uma oportunidade única de lazer e diversão.</p>
            </div>
          </div>

          {/* Botão de Retorno */}
          <div style={{ marginTop: '45px', textAlign: 'center' }}>
            <a href="/" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '14px 28px' }}>
              ← VOLTAR À PÁGINA PRINCIPAL
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}