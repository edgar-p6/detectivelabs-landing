'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CentroTreinosPage() {
  const [utilizadorLogado, setUtilizadorLogado] = useState(true);
  const [pontos, setPontos] = useState(150);
  
  const [respostaCifra, setRespostaCifra] = useState('');
  const [cifraResolvida, setCifraResolvida] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');

  const verificarCifra = (e) => {
    e.preventDefault();
    if (respostaCifra.trim().toLowerCase() === 'verdade') {
      if (!cifraResolvida) {
        setPontos(prev => prev + 100);
        setCifraResolvida(true);
      }
      setMensagemErro('');
    } else {
      setMensagemErro('Código inválido. Analise novamente os dados.');
    }
  };

  return (
    <main className="main-wrapper">
      {/* Cabeçalho da Página de Treinos */}
      <section className="hero-section" style={{ textAlign: 'left', marginBottom: '40px', paddingTop: '20px' }}>
        <div className="status-pill">
          <span className="status-dot"></span>
          CENTRO DE TREINOS • PLAYGROUND DA AGÊNCIA
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', md: { flexDirection: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', width: '100%' }}>
          <div>
            <h1 className="hero-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '12px' }}>
              CENTRO DE TREINOS
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0', maxWidth: '700px' }}>
              Teste as suas capacidades analíticas, resolva mini-enigmas e acumule pontos de investigação para o seu perfil de agente.
            </p>
          </div>

          {/* Painel do Agente */}
          {utilizadorLogado ? (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', backdropFilter: 'blur(12px)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                🕵️‍♂️
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '1px' }}>ESTATUTO: AGENTE</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                  {pontos} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-secondary)' }}>Pontos</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Modo Convidado. <Link href="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Inicie sessão</Link> para guardar o progresso.
            </div>
          )}
        </div>
      </section>

      {/* Grelha de Mini-Jogos */}
      <div className="spec-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Mini-Jogo 1: O Descodificador */}
        <div className="spec-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'var(--bg-card)', backdropFilter: 'blur(12px)' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                CRIPTO-ANÁLISE
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: '600' }}>+100 PTS</span>
            </div>
            
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>O Descodificador Diário</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Descubra a palavra-chave interceptada no canal de rádio encriptado da agência.
            </p>
            
            <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.65rem', marginBottom: '4px' }}>// PISTA_INTERCEPTADA</span>
              &quot;O oposto da mentira, essencial em qualquer arquivo forense.&quot;
            </div>

            <form onSubmit={verificarCifra} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                value={respostaCifra}
                onChange={(e) => setRespostaCifra(e.target.value)}
                placeholder="Introduza a palavra..."
                disabled={cifraResolvida && utilizadorLogado}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}
              />
              {!cifraResolvida && (
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px', background: 'var(--text-primary)', color: 'var(--bg-main)', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}
                >
                  Submeter Resposta
                </button>
              )}
            </form>

            {mensagemErro && (
              <p style={{ fontSize: '0.75rem', color: '#f87171', marginTop: '10px', fontFamily: 'var(--font-mono)' }}>{mensagemErro}</p>
            )}

            {cifraResolvida && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: '8px', color: '#34d399', fontSize: '0.8rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                ✔ Resolvido com sucesso! Ponto atribuído.
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
            <span>Dificuldade: Fácil</span>
            <span>1.240 jogadas</span>
          </div>
        </div>

        {/* Mini-Jogo 2: Nonogram (Mockup) */}
        <div className="spec-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(18, 20, 29, 0.3)', border: '1px solid var(--border-color)', opacity: '0.75' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '4px' }}>
                LOGICA & GRID
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>+150 PTS</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Nonogram de Evidências</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Pinte os blocos corretos na grelha para revelar o formato da arma do crime escondida.
            </p>
            <div style={{ height: '120px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [ MÓDULO EM DESENVOLVIMENTO ]
            </div>
          </div>
          <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
            <span>Dificuldade: Média</span>
            <span>Brevemente</span>
          </div>
        </div>

        {/* Mini-Jogo 3: Murdoku (Mockup) */}
        <div className="spec-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(18, 20, 29, 0.3)', border: '1px solid var(--border-color)', opacity: '0.75' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '4px' }}>
                DEDUÇÃO
              </span>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>+200 PTS</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>Murdoku — Alibis</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
              Cruze testemunhas, horários e locais para eliminar suspeitos inocentes.
            </p>
            <div style={{ height: '120px', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              [ MÓDULO EM DESENVOLVIMENTO ]
            </div>
          </div>
          <div style={{ marginTop: '30px', paddingTop: '16px', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)' }}>
            <span>Dificuldade: Avançada</span>
            <span>Brevemente</span>
          </div>
        </div>

      </div>
    </main>
  );
}