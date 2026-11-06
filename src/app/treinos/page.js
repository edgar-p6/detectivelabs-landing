'use client';

import { useCallback, useState, useEffect } from 'react';
import Link from 'next/link';

const MAPA_LABIRINTO = [
  '#########',
  '#S#.....#',
  '#.#.###.#',
  '#...#...#',
  '###.#.#.#',
  '#...#.#.#',
  '#.###.#.#',
  '#.....#E#',
  '#########',
];

const formatarTempo = (totalSegundos) => {
  const min = Math.floor(totalSegundos / 60);
  const seg = totalSegundos % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
};

export default function CentroTreinosPage() {
  const [pontos, setPontos] = useState(150);
  const [filtroAtivo, setFiltroAtivo] = useState('todos');

  // Catálogo com novos mini-jogos (incluindo o Labirinto e múltiplos estados de teste)
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
      titulo: 'Labirinto do Corredor B',
      tipo: 'LABIRINTO',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'Digite a palavra de saída: "saida"',
      respostaSecreta: 'saida',
      descricao: 'Navegação tática em planta arquitetónica do setor restrito.',
      tempo: null
    },
    {
      id: 'dossie-04',
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
      id: 'dossie-05',
      titulo: 'Cifra de Transmissão #02',
      tipo: 'CRIPTO-ANÁLISE',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O astro rei que ilumina o sistema solar durante o dia.',
      respostaSecreta: 'sol',
      descricao: 'Decifre a mensagem curta interceptada nas frequências de rádio.',
      tempo: null
    },
    {
      id: 'dossie-06',
      titulo: 'Análise de Logs #05',
      tipo: 'CRIPTO-ANÁLISE',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O satélite natural da Terra.',
      respostaSecreta: 'lua',
      descricao: 'Inspecione os registos de acesso do servidor central.',
      tempo: null
    },
    {
      id: 'dossie-07',
      titulo: 'Murdoku — Alibis',
      tipo: 'DEDUÇÃO',
      dificuldade: 'Avançada',
      recompensa: 200,
      status: 'bloqueado',
      pista: 'N/A',
      respostaSecreta: '',
      descricao: 'Cruze testemunhas e horários para eliminar suspeitos inocentes.',
      tempo: null
    },
    {
      id: 'dossie-08',
      titulo: 'Dossiê Corrompido #09',
      tipo: 'DEDUÇÃO',
      dificuldade: 'Avançada',
      recompensa: 200,
      status: 'bloqueado',
      pista: 'N/A',
      respostaSecreta: '',
      descricao: 'Recupere fragmentos de dados arquivados no cofre de segurança.',
      tempo: null
    }
  ]);

  // Estados de Modais e Fluxos
  const [jogoAtivo, setJogoAtivo] = useState(null);
  const [modoRepeticao, setModoRepeticao] = useState(false);
  const [inputResposta, setInputResposta] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  const [ecraSucesso, setEcraSucesso] = useState(null);
  
  const [segundos, setSegundos] = useState(0);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);
  const [posicaoLabirinto, setPosicaoLabirinto] = useState({ x: 1, y: 1 });

  useEffect(() => {
    let intervalo = null;
    if (cronometroAtivo) {
      intervalo = setInterval(() => setSegundos(s => s + 1), 1000);
    } else {
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [cronometroAtivo]);

  const abrirJogo = (jogo) => {
    if (jogo.status === 'bloqueado') return;
    setEcraSucesso(null);
    setJogoAtivo(jogo);
    setInputResposta('');
    setMensagemErro('');
    if (jogo.id === 'dossie-03') setPosicaoLabirinto({ x: 1, y: 1 });

    if (jogo.status === 'resolvido') {
      setModoRepeticao(true);
      setCronometroAtivo(false);
    } else {
      setModoRepeticao(false);
      setSegundos(0);
      setCronometroAtivo(true);
    }
  };

  const iniciarResolucaoNovamente = () => {
    setModoRepeticao(false);
    setSegundos(0);
    setCronometroAtivo(true);
    setInputResposta('');
    setMensagemErro('');
    if (jogoAtivo?.id === 'dossie-03') setPosicaoLabirinto({ x: 1, y: 1 });
  };

  const concluirJogo = useCallback(() => {
    if (!jogoAtivo) return;

    const tempoGasto = formatarTempo(segundos);
    const primeiraVez = jogoAtivo.status !== 'resolvido';

    setJogos(prev => prev.map(j => (
      j.id === jogoAtivo.id ? { ...j, status: 'resolvido', tempo: tempoGasto } : j
    )));

    if (primeiraVez) setPontos(prev => prev + jogoAtivo.recompensa);
    setCronometroAtivo(false);
    setEcraSucesso({
      titulo: jogoAtivo.titulo,
      tempo: tempoGasto,
      pontosGanhos: primeiraVez ? jogoAtivo.recompensa : 0,
      primeiraVez,
    });
    setJogoAtivo(null);
  }, [jogoAtivo, segundos]);

  const moverJogador = useCallback((dx, dy) => {
    if (jogoAtivo?.id !== 'dossie-03' || modoRepeticao) return;

    const x = posicaoLabirinto.x + dx;
    const y = posicaoLabirinto.y + dy;
    const destino = MAPA_LABIRINTO[y]?.[x];

    if (!destino || destino === '#') return;
    if (destino === 'E') {
      concluirJogo();
      return;
    }

    setPosicaoLabirinto({ x, y });
  }, [jogoAtivo, modoRepeticao, posicaoLabirinto, concluirJogo]);

  useEffect(() => {
    if (jogoAtivo?.id !== 'dossie-03' || modoRepeticao) return;

    const movimentos = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
    };
    const handleKeyDown = (event) => {
      const movimento = movimentos[event.key];
      if (!movimento) return;
      event.preventDefault();
      moverJogador(...movimento);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jogoAtivo?.id, modoRepeticao, moverJogador]);

  const submeterResposta = (e) => {
    e.preventDefault();
    if (!jogoAtivo) return;

    if (inputResposta.trim().toLowerCase() === jogoAtivo.respostaSecreta) {
      concluirJogo();
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
    <main className="main-wrapper" style={{ paddingTop: '0px', minHeight: '80vh' }}>
      
      {/* Cabeçalho e Painel de Progresso (Com espaço superior reduzido e contraste melhorado) */}
      <section className="hero-section" style={{ textAlign: 'left', marginBottom: '24px', paddingTop: '10px' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', width: '100%' }}>
          <div>
            <h1 className="hero-title" style={{ textAlign: 'left', fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
              CENTRO DE TREINOS
            </h1>
            <p className="hero-subtitle" style={{ textAlign: 'left', margin: '0', maxWidth: '650px', fontSize: '1rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              Coleção de mini-jogos e enigmas onde podes testar as tuas capacidades dedutivas e acumular experiência enquanto detetive.
            </p>
          </div>

          {/* Dashboard do Agente (Contraste e Legibilidade Aumentados) */}
          <div style={{ background: '#12151c', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '14px', padding: '18px 24px', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', width: '100%', maxWidth: '460px', boxShadow: '0 10px 30px rgba(0,0,0,0.6)' }}>
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
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', background: filtroAtivo === 'disponiveis' ? '#3b82f6' : 'rgba(255,255,255,0.03)', color: filtroAtivo === 'disponiveis' ? '#fff' : '#cbd5e1', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
          >
            Disponíveis ({jogos.filter(j => j.status === 'disponivel').length})
          </button>
          <button 
            onClick={() => setFiltroAtivo('resolvidos')} 
            style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)', background: filtroAtivo === 'resolvidos' ? '#34d399' : 'rgba(255,255,255,0.03)', color: filtroAtivo === 'resolvidos' ? '#050507' : '#cbd5e1', border: '1px solid var(--border-color)', cursor: 'pointer', fontWeight: '700', transition: 'all 0.2s' }}
          >
            Resolvidos ({totalResolvidos})
          </button>
        </div>
      </section>

      {/* Grelha de Cartões (Estilo Envelope com overflow: hidden para conter os selos perfeitamente centrados) */}
      <div className="spec-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
        
        {jogosFiltrados.map((jogo) => {
          const isResolvido = jogo.status === 'resolvido';
          const isDisponivel = jogo.status === 'disponivel';
          const isBloqueado = jogo.status === 'bloqueado';
          const dificuldadeCores = {
            Fácil: { background: '#064e3b', color: '#a7f3d0', border: '1px solid #34d399' },
            Média: { background: '#78350f', color: '#fde68a', border: '1px solid #f59e0b' },
            Avançada: { background: '#7f1d1d', color: '#fecaca', border: '1px solid #f87171' },
          };

          return (
            <div 
              key={jogo.id}
              onClick={() => abrirJogo(jogo)}
              className="spec-card" 
              style={{ 
                position: 'relative', 
                cursor: isBloqueado ? 'not-allowed' : 'pointer', 
                background: isResolvido ? 'linear-gradient(135deg, #121824 0%, #0d111a 100%)' : 'linear-gradient(135deg, #181c25 0%, #11141c 100%)', 
                border: isResolvido ? '1px solid rgba(52, 211, 153, 0.4)' : isDisponivel ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(255,255,255,0.1)', 
                opacity: isBloqueado ? '0.6' : '1',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between', 
                overflow: 'hidden', 
                borderRadius: '12px',
                padding: '24px',
                height: '100%',
                boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                transition: 'transform 0.2s ease, border-color 0.2s ease'
              }}
            >
              {/* Envelope Flap Accent Superior */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: isResolvido ? '#34d399' : isDisponivel ? '#3b82f6' : '#64748b' }}></div>

              {/* Selos de Estado com largura fixa e text-align center para perfeito centramento na diagonal */}
              {isResolvido && (
                <div style={{ position: 'absolute', top: '22px', right: '-32px', width: '130px', textAlign: 'center', background: '#34d399', color: '#050507', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: '900', padding: '4px 0', transform: 'rotate(45deg)', letterSpacing: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', zIndex: 2 }}>
                  RESOLVIDO
                </div>
              )}

              {isDisponivel && (
                <div style={{ position: 'absolute', top: '22px', right: '-32px', width: '130px', textAlign: 'center', background: '#3b82f6', color: '#fff', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', fontWeight: '900', padding: '4px 0', transform: 'rotate(45deg)', letterSpacing: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.3)', zIndex: 2 }}>
                  DISPONÍVEL
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px', paddingRight: '45px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '4px 10px', borderRadius: '4px', fontWeight: '600' }}>
                    {jogo.tipo}
                  </span>
                  <span style={{ ...dificuldadeCores[jogo.dificuldade], fontSize: '0.7rem', fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: '4px', fontWeight: '800', whiteSpace: 'nowrap' }}>
                    {jogo.dificuldade}
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: '#f8fafc' }}>{jogo.titulo}</h3>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px', lineHeight: '1.5' }}>
                  {jogo.descricao}
                </p>
              </div>

              {/* Rodapé do Cartão reorganizado com os pontos ao lado da dificuldade/tempo */}
              <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'var(--font-mono)' }}>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: isResolvido ? 'space-between' : 'flex-end', alignItems: 'center' }}>
                  {isResolvido && <span>⏱️ {jogo.tempo}</span>}
                  <span style={{ color: '#34d399', fontWeight: '700' }}>+{jogo.recompensa} PTS</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2px' }}>
                  <span style={{ color: isBloqueado ? '#64748b' : isResolvido ? '#34d399' : '#60a5fa', fontWeight: '700', fontSize: '0.85rem' }}>
                    {isBloqueado ? 'Bloqueado' : isResolvido ? 'Relatório →' : 'Abrir Envelope →'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* MODAL AMPLIADO DE RESOLUÇÃO */}
      {jogoAtivo && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(5, 5, 7, 0.92)', backdropFilter: 'blur(16px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '680px', position: 'relative', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}>
            
            <button 
              onClick={() => { setJogoAtivo(null); setCronometroAtivo(false); setModoRepeticao(false); }}
              style={{ position: 'absolute', top: '22px', right: '22px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            {modoRepeticao ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 10px', borderRadius: '4px' }}>DOSSIÊ JÁ RESOLVIDO</span>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#60a5fa' }}>⏱️ Recorde: {jogoAtivo.tempo}</span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px', color: '#f8fafc' }}>{jogoAtivo.titulo}</h2>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
                  {jogoAtivo.descricao}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.5)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#34d399', marginBottom: '6px' }}>ESTADO DO ARQUIVO:</div>
                  <p style={{ fontSize: '0.85rem', color: '#f8fafc', margin: 0 }}>Este enigma já foi concluído com sucesso. Podes consultar os dados ou optar por resolvê-lo novamente por treino (sem atribuição adicional de pontos).</p>
                </div>

                <div style={{ display: 'flex', gap: '14px' }}>
                  <button onClick={iniciarResolucaoNovamente} className="btn-primary" style={{ flex: 1, cursor: 'pointer', padding: '12px' }}>
                    RESOLVER NOVAMENTE
                  </button>
                  <button onClick={() => { setJogoAtivo(null); setModoRepeticao(false); }} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#f8fafc', borderRadius: '8px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    FECHAR DOSSIÊ
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#60a5fa', background: 'rgba(59, 130, 246, 0.1)', padding: '4px 10px', borderRadius: '4px' }}>{jogoAtivo.tipo} • {jogoAtivo.dificuldade}</span>
                  <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#34d399', fontWeight: '700' }}>⏱️ {formatarTempo(segundos)}</span>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: '#f8fafc' }}>{jogoAtivo.titulo}</h2>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '20px' }}>
                  {jogoAtivo.descricao}
                </p>

                {jogoAtivo.id === 'dossie-03' ? (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px', textAlign: 'center' }}>
                      Guia o detetive até à saída. Usa as setas do teclado ou os botões.
                    </p>

                    <div
                      role="img"
                      aria-label="Labirinto: guia o detetive até à saída"
                      style={{ display: 'grid', gridTemplateColumns: 'repeat(9, minmax(0, 1fr))', gap: '4px', width: '100%', maxWidth: '360px', margin: '0 auto 18px' }}
                    >
                      {MAPA_LABIRINTO.flatMap((linha, y) => Array.from(linha).map((celula, x) => {
                        const eJogador = posicaoLabirinto.x === x && posicaoLabirinto.y === y;
                        const eParede = celula === '#';
                        const eSaida = celula === 'E';

                        return (
                          <div
                            key={`${x}-${y}`}
                            aria-label={eJogador ? 'Detetive' : eSaida ? 'Saída' : eParede ? 'Parede' : 'Caminho'}
                            style={{
                              aspectRatio: '1',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '4px',
                              background: eParede ? '#334155' : eSaida ? 'rgba(52, 211, 153, 0.2)' : '#111827',
                              border: eSaida ? '1px solid #34d399' : '1px solid rgba(255,255,255,0.04)',
                              fontSize: 'clamp(0.75rem, 4vw, 1.2rem)',
                              lineHeight: 1,
                            }}
                          >
                            {eJogador ? '🕵️' : eSaida ? '🚪' : ''}
                          </div>
                        );
                      }))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 52px)', gridTemplateRows: 'repeat(2, 46px)', gap: '8px', justifyContent: 'center', marginBottom: '12px' }}>
                      <button type="button" aria-label="Mover para cima" onClick={() => moverJogador(0, -1)} style={{ gridColumn: '2', gridRow: '1', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', background: '#1e293b', color: '#f8fafc', fontSize: '1.2rem', cursor: 'pointer' }}>↑</button>
                      <button type="button" aria-label="Mover para a esquerda" onClick={() => moverJogador(-1, 0)} style={{ gridColumn: '1', gridRow: '2', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', background: '#1e293b', color: '#f8fafc', fontSize: '1.2rem', cursor: 'pointer' }}>←</button>
                      <button type="button" aria-label="Mover para baixo" onClick={() => moverJogador(0, 1)} style={{ gridColumn: '2', gridRow: '2', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', background: '#1e293b', color: '#f8fafc', fontSize: '1.2rem', cursor: 'pointer' }}>↓</button>
                      <button type="button" aria-label="Mover para a direita" onClick={() => moverJogador(1, 0)} style={{ gridColumn: '3', gridRow: '2', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '8px', background: '#1e293b', color: '#f8fafc', fontSize: '1.2rem', cursor: 'pointer' }}>→</button>
                    </div>

                    <p style={{ fontSize: '0.7rem', color: '#94a3b8', textAlign: 'center', margin: 0 }}>🕵️ Agente &nbsp; • &nbsp; 🚪 Saída</p>
                  </div>
                ) : (
                  <>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '24px' }}>
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
                        style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                      />
                      
                      <button type="submit" className="btn-primary" style={{ cursor: 'pointer', padding: '14px' }}>
                        EXECUTAR ANÁLISE FORENSE
                      </button>
                    </form>

                    {mensagemErro && (
                      <p style={{ fontSize: '0.8rem', color: '#f87171', marginTop: '12px', fontFamily: 'var(--font-mono)' }}>{mensagemErro}</p>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ECRÃ FINAL DE SUCESSO / CELEBRAÇÃO */}
      {ecraSucesso && (
        <div style={{ position: 'fixed', inset: '0', background: 'rgba(5, 5, 7, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#0e1117', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}>
            
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '4px', fontWeight: '800' }}>
              ENIGMA RESOLVIDO COM SUCESSO
            </span>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '16px 0 8px 0', color: '#f8fafc' }}>{ecraSucesso.titulo}</h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
              Análise concluída com precisão cirúrgica. O relatório foi arquivado no perfil do agente.
            </p>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', fontFamily: 'var(--font-mono)' }}>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>TEMPO TOTAL</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#60a5fa' }}>{ecraSucesso.tempo}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px' }}>PONTOS GANHOS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#34d399' }}>+{ecraSucesso.pontosGanhos} PTS</div>
              </div>
            </div>

            {ecraSucesso.primeiraVez && (
              <p style={{ fontSize: '0.75rem', color: '#34d399', fontFamily: 'var(--font-mono)', marginBottom: '20px' }}>
                ✨ Pontos creditados com sucesso na tua conta de agente!
              </p>
            )}

            <button 
              onClick={() => setEcraSucesso(null)}
              className="btn-primary" 
              style={{ width: '100%', cursor: 'pointer', padding: '14px' }}
            >
              CONTINUAR INVESTIGAÇÃO →
            </button>

          </div>
        </div>
      )}

    </main>
  );
}
