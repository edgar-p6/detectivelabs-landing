'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CentroTreinosPage() {
  const [pontos, setPontos] = useState(150);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  const [jogos, setJogos] = useState([
    {
      id: 'dossie-00',
      titulo: 'O Descodificador Diário',
      tipo: 'CRIPTO-ANÁLISE',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'resolvido',
      pista: 'O oposto da mentira, essencial em qualquer arquivo forense.',
      respostaSecreta: 'verdade',
      descricao: 'Interceptação de canal de rádio criptografado. Descubra a palavra-chave em falta.',
      tempo: '01:42'
    },
    {
      id: 'dossie-01',
      titulo: 'Frequência Oculta #01',
      tipo: 'CRIPTO-ANÁLISE',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O metal precioso de tom amarelado encontrado no cofre do suspeito.',
      respostaSecreta: 'ouro',
      descricao: 'Mensagem áudio truncada recuperada do telemóvel da vítima.',
      tempo: null
    },
    {
      id: 'dossie-02',
      titulo: 'Registo do Terminal 4',
      tipo: 'CRIPTO-ANÁLISE',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'A estação do ano caracterizada pela queda das folhas e dias mais frios.',
      respostaSecreta: 'outono',
      descricao: 'Logs de acesso remoto eliminados às 03:14 da manhã.',
      tempo: null
    },
    {
      id: 'dossie-03',
      titulo: 'Nonogram de Evidências',
      tipo: 'LOGICA & GRID',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'Resolva a grelha lógica para revelar o objeto.',
      respostaSecreta: 'chave',
      descricao: 'Pinte a grelha lógica para revelar o formato exato da arma do crime.',
      tempo: null
    },
    {
      id: 'dossie-04',
      titulo: 'Murdoku — Alibis',
      tipo: 'DEDUÇÃO',
      dificuldade: 'Avançada',
      recompensa: 200,
      status: 'bloqueado',
      pista: 'N/A',
      respostaSecreta: '',
      descricao: 'Cruze testemunhas e horários para eliminar suspeitos inocentes.',
      tempo: null
    }
  ]);

  const [jogoAtivo, setJogoAtivo] = useState(null);
  const [inputResposta, setInputResposta] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  
  const [segundos, setSegundos] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (cronometroAtivo) {
      intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [cronometroAtivo]);

  const formatarTempo = (totalSegundos) => {
    const min = Math.floor(totalSegundos / 60);
    const seg = totalSegundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const abrirJogo = (jogo) => {
    if (jogo.status === 'bloqueado') return;
    setJogoAtivo(jogo);
    setInputResposta('');
    setMensagemErro('');
    if (jogo.status === 'disponivel') {
      setSegundos(0);
      setCronometroAtivo(true);
    }
  };

  const submeterResposta = (e) => {
    e.preventDefault();
    if (!jogoAtivo) return;

    if (inputResposta.trim().toLowerCase() === jogoAtivo.respostaSecreta) {
      const tempoGasto = formatarTempo(segundos);
      
      setJogos(prev => prev.map(j => {
        if (j.id === jogoAtivo.id) {
          return { ...j, status: 'resolvido', tempo: tempoGasto };
        }
        return j;
      }));

      setPontos(prev => prev + jogoAtivo.recompensa);
      setCronometroAtivo(false);
      setJogoAtivo(null);
    } else {
      setMensagemErro('✖ Código inválido. O sistema rejeitou a credencial.');
    }
  };

  const totalResolvidos = jogos.filter(j => j.status === 'resolvido').length;

  const jogosFiltrados = jogos.filter(j => {
    if (filtroAtivo === 'disponiveis') return j.status === 'disponivel';
    if (filtroAtivo === 'resolvidos') return j.status === 'resolvido';
    return true;
  });

  return (
    <main className="main-wrapper" style={{ paddingTop: '10px', minHeight: '80vh' }}>
      
      {/* Cabeçalho e Painel de Progresso */}
      <section className="hero-section" style={{ textAlign: 'left', marginBottom: '24px', paddingTop: '0px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', lg: { flexDirection: 'row' }, justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', width: '100%' }}>
          <div>
            <h1 className="hero-title" style={{ textAlign: 'left', fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
              CENTRO DE TREINOS
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0', maxWidth: '650px', fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Selecione um dossiê confidencial, teste as suas capacidades analíticas sob pressão e acumule pontos para a agência.
            </p>
          </div>

          {/* Dashboard do Agente */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '14px', padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', maxWidth: '440px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', letterSpacing: '1px' }}>PATENTE</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#60a5fa', marginTop: '4px' }}>DETETIVE JR.</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', letterSpacing: '1px' }}>RESOLVIDOS</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>{totalResolvidos} / {jogos.length}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: '#94a3b8', letterSpacing: '1px' }}>PONTOS</div>
              <div style={{ fontSize: '1rem', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>{pontos} PTS</div>
            </div>
          </div>
        </div>

        {/* Filtros de Estado */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '24px', flexWrap: 'wrap', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <button 
            onClick={() => setFiltroAtivo('todos')} 
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', background: filtroAtivo === 'todos' ? '#f8fafc' : 'rgba(255,255,255,0.03)', color: filtroAtivo === 'todos' ? '#050507' : '#cbd5e1', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
          >
            Todos os Dossiês ({jogos.length})
          </button>
          <button 
            onClick={() => setFiltroAtivo('disponiveis')} 
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', background: filtroAtivo === 'disponiveis' ? '#f8fafc' : 'rgba(255,255,255,0.03)', color: filtroAtivo === 'disponiveis' ? '#050507' : '#cbd5e1', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
          >
            Disponíveis ({jogos.filter(j => j.status === 'disponivel').length})
          </button>
          <button 
            onClick={() => setFiltroAtivo('resolvidos')} 
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', background: filtroAtivo === 'resolvidos' ? '#f8fafc' : 'rgba(255,255,255,0.03)', color: filtroAtivo === 'resolvidos' ? '#050507' : '#cbd5e1', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
          >
            Resolvidos ({totalResolvidos})
          </button>
        </div>
      </section>

      {/* Grelha de Cartões (Altura unificada sem espaços mortos verticais) */}
      <div className="spec-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
        
        {jogosFiltrados.map((jogo) => (
          <div 
            key={jogo.id}
            onClick={() => abrirJogo(jogo)}
            className="spec-card" 
            style={{ 
              position: 'relative', 
              cursor: jogo.status === 'bloqueado' ? 'not-allowed' : 'pointer', 
              background: jogo.status === 'resolvido' ? 'rgba(18, 20, 29, 0.7)' : 'var(--bg-card)', 
              border: jogo.status === 'resolvido' ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid var(--border-color)', 
              opacity: jogo.status === 'bloqueado' ? '0.6' : '1',
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between', 
              overflow: 'hidden', 
              borderRadius: '12px',
              padding: '24px',
              height: '100%',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            {/* Selos / Badges perfeitamente centrados na diagonal e sem cortar letras */}
            {jogo.status === 'resolvido' && (
              <div style={{ position: 'absolute', top: '24px', right: '-24px', width: '120px', textAlign: 'center', background: '#34d399', color: '#050507', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: '900', padding: '4px 0', transform: 'rotate(45deg)', letterSpacing: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', zIndex: 2 }}>
                RESOLVIDO
              </div>
            )}

            {jogo.status === 'disponivel' && (
              <div style={{ position: 'absolute', top: '24px', right: '-24px', width: '120px', textAlign: 'center', background: '#3b82f6', color: '#fff', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: '900', padding: '4px 0', transform: 'rotate(45deg)', letterSpacing: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', zIndex: 2 }}>
                DISPONÍVEL
              </div>
            )}

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', paddingRight: '40px' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                  {jogo.tipo}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#f8fafc' }}>{jogo.titulo}</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.5' }}>
                {jogo.descricao}
              </p>
            </div>

            {/* Rodapé do Cartão reorganizado */}
            <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)' }}>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{jogo.status === 'resolvido' ? `⏱️ Tempo: ${jogo.tempo}` : `Dif: ${jogo.dificuldade}`}</span>
                <span style={{ color: jogo.status === 'bloqueado' ? '#64748b' : '#60a5fa', fontWeight: '700', fontSize: '0.85rem' }}>
                  {jogo.status === 'bloqueado' ? 'Bloqueado' : jogo.status === 'resolvido' ? 'Relatório →' : 'Abrir →'}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700' }}>
                +{jogo.recompensa} PTS
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* MODAL DE RESOLUÇÃO */}
      {jogoAtivo && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(5, 5, 7, 0.9)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#0b0d10', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '540px', position: 'relative', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            
            <button 
              onClick={() => { setJogoAtivo(null); setCronometroAtivo(false); }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge-confidential">DOSSIÊ CONFIDENCIAL</span>
              <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#60a5fa', fontWeight: '700' }}>⏱️ {formatarTempo(segundos)}</span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '8px', color: '#f8fafc' }}>{jogoAtivo.titulo}</h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '20px' }}>
              {jogoAtivo.descricao}
            </p>

            <div style={{ background: 'rgba(0,0,0,0.6)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '20px' }}>
              <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', marginBottom: '6px' }}>// PISTA_INTERCEPTADA</span>
              &quot;{jogoAtivo.pista}&quot;
            </div>

            <form onSubmit={submeterResposta} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="text"
                value={inputResposta}
                onChange={(e) => setInputResposta(e.target.value)}
                placeholder="Insira a resposta secreta..."
                autoFocus
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
              />
              
              <button type="submit" className="btn-primary" style={{ cursor: 'pointer' }}>
                EXECUTAR ANÁLISE FORENSE
              </button>
            </form>

            {mensagemErro && (
              <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>{mensagemErro}</p>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button 
                onClick={() => { setJogoAtivo(null); setCronometroAtivo(false); }}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
              >
                [ Fechar Dossiê ]
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}