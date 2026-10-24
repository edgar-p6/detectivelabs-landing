'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('#8e9aaf');
  const [success, setSuccess] = useState(false);
  const [agentId, setAgentId] = useState(null);

  // Estado para o efeito de dactilografia (Typist)
  const [typedText, setTypedText] = useState('');
  const fullText = "Narrativas interativas de investigação criminal onde tu és o único detetive capaz de ligar as provas.";

  // Efeito Typist seguro (sem duplicação de letras)
  useEffect(() => {
    let timer;
    let index = 0;
    setTypedText('');

    const type = () => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
        timer = setTimeout(type, 30);
      }
    };

    timer = setTimeout(type, 300);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessageColor('#8e9aaf');
    setMessage('A contactar o cofre central da agência...');
    setAgentId(null);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const result = await response.json();

      if (response.ok) {
        setMessageColor('#38ef7d');
        setMessage('ACESSO AUTORIZADO À AGÊNCIA');
        setSuccess(true);
        const randomId = Math.floor(1000 + Math.random() * 9000);
        setAgentId(randomId);
      } else {
        setMessageColor('#ff4b4b');
        setMessage(`[ ERRO: ${result.error || 'Falha no registo.'} ]`);
        setLoading(false);
      }
    } catch (err) {
      setMessageColor('#ff4b4b');
      setMessage('[ ERRO DE CONEXÃO COM O SERVIDOR CENTRAL ]');
      setLoading(false);
    }
  };

  return (
    <main className="main-wrapper">
      {/* Hero Section Cinematográfica */}
      <section className="hero-section">
        <div className="status-pill">
          <span className="status-dot"></span>
          DEPARTAMENTO DE INVESTIGAÇÃO CRIMINAL
        </div>
        
        <h1 className="hero-title">A VERDADE ESTÁ ESCONDIDA NOS DADOS.</h1>
        <p className="hero-subtitle">{typedText}</p>
      </section>

      {/* Destaque Central: Caso #01 */}
      <section id="caso01" className="case-showcase">
        <div className="case-card-glow"></div>
        <div className="case-content">
          <div className="case-badge-group">
            <span className="badge-confidential">CONFIDENCIAL • EM BREVE</span>
          </div>

          <h2 className="case-title">CASO #01: "FELIZ ANIVERSÁRIO"</h2>
          <p className="case-description">
            O que deveria ser uma festa de 20 anos inesquecível terminou em tragédia. A pedido da polícia local, a nossa agência foi encarregue de examinar a morte suspeita de uma jovem. Entre o círculo de amigos íntimos e os familiares, todos têm álibis perfeitos, mas <span className="redacted" title="Passa o rato para revelar">será que alguém está a mentir?</span> Estão em jogo velhos segredos de 
            família, relações amorosas complicadas e um aniversário que ninguém quer recordar.
          </p>

          {/* 2 Contentores Principais */}
          <div className="spec-grid">
            <div className="spec-card">
              <div className="spec-icon">🔍</div>
              <h3>Provas Forenses</h3>
              <p>Mensagens privadas, fotografias e registos históricos recuperados.</p>
            </div>
            <div className="spec-card">
              <div className="spec-icon">💻</div>
              <h3>Documentos Restritos</h3>
              <p>Acesso a depoimentos cruzados e relatórios confidenciais da investigação.</p>
            </div>
          </div>

          {/* Formulário de Recrutamento & Cupão VIP */}
          <div className="lead-box">
            <div className="lead-header">
              <h3>Solicitar Atribuição ao Caso</h3>
              <p>Junta-te à equipa de investigadores da Detective Labs para aceder ao caso <strong>"Feliz Aniversário"</strong> em primeira mão e garante um <strong>cupão de desconto exclusivo</strong> no lançamento.</p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="lead-form">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="introduz o teu email..." 
                  required 
                  autoComplete="email"
                />
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'A VERIFICAR CREDENCIAIS...' : 'SOLICITAR CREDENCIAIS DE AGENTE'}
                </button>
              </form>
            ) : (
              <div style={{ marginTop: '20px' }}>
                <div className="agent-card">
                  <div className="agent-card-header">✔ CREDENCIAIS DE DETETIVE EMITIDAS</div>
                  <div className="agent-card-body">
                    <div><strong>ID DE AGENTE:</strong> #DL-{agentId}</div>
                    <div><strong>ESTADO:</strong> Atribuído ao Caso #01 • Cupão de Desconto Exclusivo Reservado</div>
                  </div>
                </div>
              </div>
            )}

            <p className="form-status-msg" style={{ color: messageColor }}>{message}</p>

            <span className="lead-disclaimer">Zero spam. Apenas atualizações operacionais do caso e o teu cupão de desconto exclusivo.</span>
          </div>
        </div>
      </section>

      {/* Secção Institucional / A Agência */}
      <section id="estudio" className="about-section">
        <div className="about-content">
          <h2>INVESTIGAÇÕES RIGOROSAS PARA QUEM NÃO PERDE UM DETALHE.</h2>
          <p>
            Na <strong>Detective Labs</strong>, desenhamos experiências interativas de resolução de mistérios e casos policiais, que podem envolver enigmas e puzzles lógicos e desafiantes. Em cada um dos nossos casos, os jogadores assumem o papel de detetives para analisar provas reais que os outros ignoraram ou não conseguiram compreender.
          </p>
        </div>
      </section>

      {/* Secção de FAQs / Accordion Tradicional */}
      <section id="faq" className="faq-section">
        <div className="faq-header">
          <h2>PERGUNTAS FREQUENTES</h2>
        </div>

        <div className="faq-accordion">
          <details className="faq-item">
            <summary className="faq-question">
              <span>O que é o Caso #01: "Feliz Aniversário"?</span>
              <span className="faq-icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>É o nosso primeiro jogo de investigação criminal digital. Como detetive atribuído ao caso, terás de analisar provas digitais, cruzar depoimentos e desvendar o mistério diretamente no teu ecrã.</p>
            </div>
          </details>

          <details className="faq-item">
            <summary className="faq-question">
              <span>Como funciona o recrutamento e o cupão de desconto exclusivo?</span>
              <span className="faq-icon">+</span>
            </summary>
            <div className="faq-answer">
              <p>Ao registares o teu email, ficas oficialmente integrado na lista de investigadores da agência Detective Labs. Vais receber o acesso antecipado ao caso assim que este estiver disponível e um cupão de desconto exclusivo no dia do lançamento.</p>
            </div>
          </details>
        </div>
      </section>
    </main>
  );
}