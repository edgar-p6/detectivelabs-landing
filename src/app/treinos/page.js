'use client';

import { useCallback, useState, useEffect, useRef, startTransition } from 'react';
import { getTrainingProgress, completeTraining } from '../conta/actions';
import Link from 'next/link';
import TrainingMaze from '@/components/TrainingMaze';

const NONOGRAM_SOLUCAO = [
  '#########',
  '#.......#',
  '#.......#',
  '#.......#',
  '#.......#',
  '#.......#',
  '#.......#',
  '#.......#',
  '#########',
].map((linha) => [...linha].map((celula) => celula === '#'));

const obterDicas = (linhas) => linhas.map((linha) => {
  const grupos = linha.map((celula) => celula ? '1' : '0').join('').split('0').filter(Boolean).map((grupo) => grupo.length);
  return grupos.length ? grupos : [0];
});

const NONOGRAM_DICAS_LINHAS = obterDicas(NONOGRAM_SOLUCAO);
const NONOGRAM_DICAS_COLUNAS = obterDicas(
  NONOGRAM_SOLUCAO[0].map((_, coluna) => NONOGRAM_SOLUCAO.map((linha) => linha[coluna]))
);

const ORDEM_CATEGORIAS = ['cripto-análise', 'labirinto', 'lógica', 'dedução'];

const formatarTempo = (totalSegundos) => {
  const min = Math.floor(totalSegundos / 60);
  const seg = totalSegundos % 60;
  return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
};

export default function CentroTreinosPage() {
  const [pontos, setPontos] = useState(0);
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [estadoAtivo, setEstadoAtivo] = useState('todos');

  // Catálogo com novos mini-jogos (incluindo o Labirinto e múltiplos estados de teste)
  const [jogos, setJogos] = useState([
    {
      id: 'dossie-00',
      titulo: 'O Descodificador Diário',
      tipo: 'cripto-análise',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O oposto da mentira, essencial em qualquer arquivo forense.',

      descricao: 'Interceptação de canal de rádio criptografado. Descobre a palavra-chave em falta.',
      tempo: null
    },
    {
      id: 'dossie-01',
      titulo: 'Frequência Oculta #01',
      tipo: 'cripto-análise',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O metal precioso de tom amarelado encontrado no cofre do suspeito.',

      descricao: 'Mensagem áudio truncada recuperada do telemóvel da vítima.',
      tempo: null
    },
    {
      id: 'dossie-02',
      titulo: 'Registo do Terminal 4',
      tipo: 'cripto-análise',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'A estação do ano caracterizada pela queda das folhas e dias mais frios.',

      descricao: 'Logs de acesso remoto eliminados às 03:14 da manhã.',
      tempo: null
    },
    {
      id: 'dossie-03',
      titulo: 'Labirinto do Corredor B',
      tipo: 'labirinto',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'Digita a palavra de saída: "saida"',

      descricao: 'Explora o setor restrito, ativa três postos de controlo e encontra a saída.',
      tempo: null
    },
    {
      id: 'dossie-04',
      titulo: 'Nonogram de Evidências',
      tipo: 'lógica',
      dificuldade: 'Média',
      recompensa: 150,
      status: 'disponivel',
      pista: 'Resolve a grelha lógica para revelar o objeto.',

      descricao: 'Resolve o nonogram para revelar uma imagem relacionada com o caso.',
      tempo: null
    },
    {
      id: 'dossie-05',
      titulo: 'Cifra de Transmissão #02',
      tipo: 'cripto-análise',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O astro rei que ilumina o sistema solar durante o dia.',

      descricao: 'Decifra a mensagem curta interceptada nas frequências de rádio.',
      tempo: null
    },
    {
      id: 'dossie-06',
      titulo: 'Análise de Logs #05',
      tipo: 'cripto-análise',
      dificuldade: 'Fácil',
      recompensa: 100,
      status: 'disponivel',
      pista: 'O satélite natural da Terra.',

      descricao: 'Inspeciona os registos de acesso do servidor central.',
      tempo: null
    },
    {
      id: 'dossie-07',
      titulo: 'Murdoku — Alibis',
      tipo: 'dedução',
      dificuldade: 'Avançada',
      recompensa: 200,
      status: 'bloqueado',
      pista: 'N/A',

      descricao: 'Cruza testemunhas e horários para eliminar suspeitos inocentes.',
      tempo: null
    },
    {
      id: 'dossie-08',
      titulo: 'Dossiê Corrompido #09',
      tipo: 'dedução',
      dificuldade: 'Avançada',
      recompensa: 200,
      status: 'bloqueado',
      pista: 'N/A',

      descricao: 'Recupera fragmentos de dados arquivados no cofre de segurança.',
      tempo: null
    }
  ]);

  // Estados de Modais e Fluxos
  const [jogoAtivo, setJogoAtivo] = useState(null);
  const [ecraSucesso, setEcraSucesso] = useState(null);
  const submitting = useRef(false);
  const lastAttempt = useRef(null);
  const [aGuardar, setAGuardar] = useState(false);
  const [erroProgresso, setErroProgresso] = useState('');
  const [modoRepeticao, setModoRepeticao] = useState(false);
  const [cronometroAtivo, setCronometroAtivo] = useState(false);

  useEffect(() => {
    if (!jogoAtivo && !ecraSucesso) return;
    const dialog = document.querySelector('[role="dialog"]');
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflowY;
    document.body.style.overflowY = 'hidden';
    dialog.querySelector('button')?.focus();
    function handleDialogKey(event) {
      if (event.key === 'Escape' && !submitting.current) {
        setEcraSucesso(null);
        setJogoAtivo(null);
        setCronometroAtivo(false);
        setModoRepeticao(false);
      }
      if (event.key !== 'Tab') return;
      const controls = [...dialog.querySelectorAll('button:not(:disabled), input:not(:disabled), select, a[href]')].filter((element) => element.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleDialogKey);
    return () => {
      document.body.style.overflowY = previousOverflow;
      document.removeEventListener('keydown', handleDialogKey);
      previousFocus?.focus();
    };
  }, [jogoAtivo, ecraSucesso]);
  const [inputResposta, setInputResposta] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  
  const [segundos, setSegundos] = useState(0);
  const [nonogramMarcas, setNonogramMarcas] = useState(() => Array(81).fill(0));
  const [modoMarcarVazias, setModoMarcarVazias] = useState(false);
  const [progressoCarregado, setProgressoCarregado] = useState(false);
  const [utilizadorAutenticado, setUtilizadorAutenticado] = useState(false);
  const [nomeAgente, setNomeAgente] = useState('Agente visitante');

  useEffect(() => {
    let mounted = true;

    startTransition(() => { getTrainingProgress()
      .then(({ authenticated, progress, agentName, error }) => {
        if (error) { if (mounted) setErroProgresso(error); return; }
        if (!mounted) return;
        setUtilizadorAutenticado(authenticated);
        if (authenticated && agentName) setNomeAgente(agentName);

        if (authenticated && progress) {
          if (Number.isFinite(progress.pontos)) setPontos(progress.pontos);
          if (Array.isArray(progress.jogos)) {
            setJogos((current) => current.map((jogo) => {
              const saved = progress.jogos.find((item) => item.id === jogo.id);
              if (!saved) return jogo;
              const validStatuses = ['disponivel', 'resolvido', 'bloqueado'];
              return {
                ...jogo,
                status: validStatuses.includes(saved.status) ? saved.status : jogo.status,
                tempo: typeof saved.tempo === 'string' ? saved.tempo : jogo.tempo,
                estatisticas: saved.estatisticas && typeof saved.estatisticas === 'object'
                  ? saved.estatisticas
                  : jogo.estatisticas,
              };
            }));
          }
        }
        setProgressoCarregado(true);
      })
      .catch(() => { if (mounted) setErroProgresso('Não foi possível carregar o progresso. Volta a tentar.'); }); });

    return () => { mounted = false; };
  }, []);

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
    if (jogo.status === 'bloqueado' || !progressoCarregado || submitting.current) return;
    setEcraSucesso(null);
    setJogoAtivo(jogo);
    setInputResposta('');
    setMensagemErro('');
    if (jogo.id === 'dossie-04') {
      setNonogramMarcas(Array(81).fill(0));
      setModoMarcarVazias(false);
    }

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
    if (jogoAtivo?.id === 'dossie-04') {
      setNonogramMarcas(Array(81).fill(0));
      setModoMarcarVazias(false);
    }
  };

  const concluirJogo = useCallback((attempt) => {
    startTransition(async () => {
    if (!jogoAtivo || submitting.current) return;
    submitting.current = true;
    setAGuardar(true);
    setMensagemErro('');
    lastAttempt.current = attempt;
    let result;
    try {
      result = await completeTraining(jogoAtivo.id, attempt, segundos);
    } catch { result = { error: 'Não foi possível contactar o servidor. Tenta novamente.' }; }
    submitting.current = false;
    setAGuardar(false);
    if (result.error) { setMensagemErro(result.error); return; }

    const tempoGasto = formatarTempo(segundos);
    const primeiraVez = jogoAtivo.status !== 'resolvido';

    setJogos(prev => prev.map((j) => {
      if (j.id !== jogoAtivo.id) return j;
      const estatisticasAnteriores = j.estatisticas;
      const melhorTempoAnterior = estatisticasAnteriores?.melhorTempo || j.tempo || tempoGasto;
      const paraSegundos = (tempo) => {
        const [minutos, segundos] = tempo.split(':').map(Number);
        return minutos * 60 + segundos;
      };
      const melhorTempo = paraSegundos(tempoGasto) < paraSegundos(melhorTempoAnterior) ? tempoGasto : melhorTempoAnterior;
      return {
        ...j,
        status: 'resolvido',
        tempo: melhorTempo,
        estatisticas: {
          melhorTempo,
          ultimaDuracao: tempoGasto,
          tentativas: (estatisticasAnteriores?.tentativas || 0) + 1,
          pontosGanhos: estatisticasAnteriores?.pontosGanhos ?? (primeiraVez ? jogoAtivo.recompensa : 0),
        },
      };
    }));

    if (primeiraVez) setPontos(prev => prev + jogoAtivo.recompensa);
    setCronometroAtivo(false);
    setEcraSucesso({
      titulo: jogoAtivo.titulo,
      tempo: tempoGasto,
      pontosGanhos: primeiraVez ? jogoAtivo.recompensa : 0,
      primeiraVez,
      saved: result.saved,
    });
    setJogoAtivo(null);
    });
  }, [jogoAtivo, segundos]);

  const submeterResposta = (e) => {
    e.preventDefault();
    if (!jogoAtivo) return;
    concluirJogo(inputResposta);
  };

  const marcarCelulaNonogram = (indice) => {
    if (submitting.current) return;
    const marcasAtualizadas = [...nonogramMarcas];
    const marcaAtual = marcasAtualizadas[indice];
    marcasAtualizadas[indice] = modoMarcarVazias
      ? (marcaAtual === 2 ? 0 : 2)
      : (marcaAtual === 1 ? 0 : 1);
    setNonogramMarcas(marcasAtualizadas);

    const grelhaCorreta = NONOGRAM_SOLUCAO.every((linha, y) =>
      linha.every((celula, x) => (marcasAtualizadas[y * 9 + x] === 1) === celula)
    );
    if (grelhaCorreta) concluirJogo(marcasAtualizadas);
  };

  const totalResolvidos = jogos.filter(j => j.status === 'resolvido').length;

  const categoriasDisponiveis = ORDEM_CATEGORIAS.filter((categoria) => jogos.some((jogo) => jogo.tipo === categoria));
  const totalPontosPossiveis = jogos.filter(jogo => jogo.status !== 'bloqueado').reduce((total, jogo) => total + jogo.recompensa, 0);
  const progressoPontos = totalPontosPossiveis > 0 ? Math.min(100, (pontos / totalPontosPossiveis) * 100) : 0;

  const jogosFiltrados = jogos.filter((jogo) => {
    const correspondeCategoria = categoriaAtiva === 'todos' || jogo.tipo === categoriaAtiva;
    const correspondeEstado = estadoAtivo === 'todos'
      || (estadoAtivo === 'resolvidos' ? jogo.status === 'resolvido' : jogo.status !== 'resolvido');
    return correspondeCategoria && correspondeEstado;
  });

  return (
    <main className="main-wrapper interior-page training-page" style={{ minHeight: '80vh', zIndex: jogoAtivo ? 'auto' : undefined }}>
      
      {erroProgresso && <p role="alert">{erroProgresso} <button type="button" onClick={() => window.location.reload()}>Voltar a tentar</button></p>}
      {!progressoCarregado && !erroProgresso && <p role="status">A carregar os treinos…</p>}
      {/* Cabeçalho e perfil do agente */}
      <section className="training-hero">
        <div className="training-title-row">
          <div>
            <h1 className="hero-title training-title interior-page-title">Centro de Treinos</h1>
            <p className="hero-subtitle training-subtitle interior-page-subtitle">Mini-jogos e enigmas para afiar o teu olhar de detetive e acumular pontos de investigação.</p>
          </div>
          <Link href="/casos" className="training-cases-link">EXPLORAR CASOS <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="agent-dashboard">
          <div className="agent-profile">
            <div className="agent-avatar" aria-hidden="true"><span>DL</span></div>
            <div className="agent-identity">
              <span className="agent-profile-label">Cartão de agente</span>
              <h2>{nomeAgente}</h2>
              <span className="agent-id">{utilizadorAutenticado ? 'SESSÃO ATIVA' : 'VISITANTE'}</span>
            </div>
            <div className="agent-completed-stat">
              <span>TREINOS CONCLUÍDOS</span>
              <strong>{totalResolvidos}</strong>
            </div>
          </div>

          <div className="agent-score-panel">
            <div className="agent-score-heading">
              <div><span className="agent-score-label">Pontos de Investigação</span><strong className="agent-score-value">{pontos}<small> pts</small></strong></div>
              <span className="agent-score-icon" aria-hidden="true">✦</span>
            </div>
            <div className="training-progress-copy"><span>Pontos de Investigação</span><strong>{pontos} / {totalPontosPossiveis} PTS</strong></div>
            <div className="training-progress-track" role="progressbar" aria-label="Pontos de Investigação" aria-valuemin="0" aria-valuemax={totalPontosPossiveis} aria-valuenow={Math.min(pontos, totalPontosPossiveis)}>
              <div className="training-progress-fill" style={{ width: progressoPontos + '%' }} />
            </div>
            <span className="agent-score-footnote">Resolve minijogos e acompanha os teus pontos de investigação</span>
          </div>
          <div className="agent-login-inline">
            <div className="agent-login-copy">
              {utilizadorAutenticado
                ? <p>Sessão ativa como <strong>{nomeAgente}</strong>. Os resultados concluídos ficam guardados na tua conta.</p>
                : <p>Inicia sessão antes de jogar para guardares os resultados. Como visitante, os resultados desaparecem ao saíres da página.</p>}
            </div>
            <div className="agent-login-actions">
              {utilizadorAutenticado ? (
                <Link href="/conta" className="action-button">EDITAR PERFIL <span aria-hidden="true">→</span></Link>
              ) : (
                <>
                  <Link href="/login" className="action-button">ENTRAR <span aria-hidden="true">→</span></Link>
                  <Link href="/login?modo=criar" className="action-button action-button-secondary">CRIAR CONTA</Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filtros de Categoria e Estado */}
        <div className="training-filters" role="group" aria-label="Filtros de minijogos">
          <label className="training-filter-control">
            <span>Categoria</span>
            <select value={categoriaAtiva} onChange={(event) => setCategoriaAtiva(event.target.value)}>
              <option value="todos">Todas</option>
              {categoriasDisponiveis.map((categoria) => (
                <option key={categoria} value={categoria}>{categoria.charAt(0).toUpperCase() + categoria.slice(1)}</option>
              ))}
            </select>
          </label>
          <label className="training-filter-control">
            <span>Estado</span>
            <select value={estadoAtivo} onChange={(event) => setEstadoAtivo(event.target.value)}>
              <option value="todos">Todos</option>
              <option value="resolvidos">Resolvidos</option>
              <option value="por-resolver">Por resolver</option>
            </select>
          </label>
        </div>
      </section>

      {/* Grelha de Cartões (Estilo Envelope com overflow: hidden para conter os selos perfeitamente centrados) */}
      <div className="spec-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'stretch' }}>
        
        {jogosFiltrados.map((jogo) => {
          const isResolvido = jogo.status === 'resolvido';
          const isDisponivel = jogo.status === 'disponivel';
          const isBloqueado = jogo.status === 'bloqueado';

          return (
            <div 
              key={jogo.id}
            className="spec-card training-card"
            data-state={jogo.status}
            >
              <span className="training-card-state">{isResolvido ? 'Resolvido' : isDisponivel ? 'Disponível' : 'Bloqueado'}</span>

              <div>
                <div className="training-card-tags">
                  <span className="game-category-tag">
                    {jogo.tipo}
                  </span>
                  <span className={`game-difficulty-tag difficulty-${jogo.dificuldade === 'Fácil' ? 'easy' : jogo.dificuldade === 'Média' ? 'medium' : 'advanced'}`}>
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
                  <button type="button" onClick={() => abrirJogo(jogo)} disabled={isBloqueado || !progressoCarregado} className={'game-card-action' + (isBloqueado ? ' is-disabled' : isResolvido ? ' is-resolved' : ' is-open')} aria-label={`${isResolvido ? 'Ver relatório de' : 'Abrir'} ${jogo.titulo}`}>
                    {isBloqueado ? 'Bloqueado' : isResolvido ? 'Ver relatório' : 'Abrir desafio'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* MODAL AMPLIADO DE RESOLUÇÃO */}
      {jogoAtivo && (
        <div className="game-modal-backdrop" role="presentation">
          <div className="game-modal-panel" role="dialog" aria-modal="true" aria-labelledby="game-modal-title">
            
            <button 
              onClick={() => { setJogoAtivo(null); setCronometroAtivo(false); setModoRepeticao(false); }}
              disabled={aGuardar}
              aria-label="Fechar treino"
              style={{ position: 'absolute', top: '22px', right: '22px', background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.3rem', cursor: 'pointer' }}
            >
              ✕
            </button>

            {aGuardar && <p role="status">A validar e guardar o resultado…</p>}
            {mensagemErro && <div role="alert"><p>{mensagemErro}</p>{jogoAtivo?.tipo !== 'cripto-análise' && <button type="button" disabled={aGuardar} onClick={() => concluirJogo(lastAttempt.current)}>Tentar novamente</button>}</div>}
            {modoRepeticao ? (
              <div>

                <h2 id="game-modal-title" className="resolved-training-title">Treino já efetuado</h2>
                <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '22px' }}>{jogoAtivo.titulo} · {jogoAtivo.descricao}</p>

                <section className="training-stats" aria-label="Estatísticas do treino concluído">
                  <div className="training-stat"><span>Melhor tempo</span><strong>{jogoAtivo.estatisticas?.melhorTempo || jogoAtivo.tempo || '—'}</strong></div>
                  <div className="training-stat"><span>Última resolução</span><strong>{jogoAtivo.estatisticas?.ultimaDuracao || jogoAtivo.tempo || '—'}</strong></div>
                  <div className="training-stat"><span>Tentativas</span><strong>{jogoAtivo.estatisticas?.tentativas || 1}</strong></div>
                  <div className="training-stat"><span>Pontos atribuídos</span><strong>+{jogoAtivo.estatisticas?.pontosGanhos ?? jogoAtivo.recompensa} PTS</strong></div>
                </section>

                <div className="resolved-training-actions">
                  <button onClick={iniciarResolucaoNovamente} className="btn-primary" style={{ flex: 1, cursor: 'pointer', padding: '14px' }}>
                    RESOLVER NOVAMENTE
                  </button>
                  <button onClick={() => { setJogoAtivo(null); setModoRepeticao(false); }} className="resolved-close-button">
                    FECHAR
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="active-game-meta">
                  <div className="active-game-tags">
                    <span className="game-category-tag">{jogoAtivo.tipo}</span>
                    <span className={`game-difficulty-tag difficulty-${jogoAtivo.dificuldade === 'Fácil' ? 'easy' : jogoAtivo.dificuldade === 'Média' ? 'medium' : 'advanced'}`}>{jogoAtivo.dificuldade}</span>
                  </div>
                  <span className="active-game-timer">⏱️ {formatarTempo(segundos)}</span>
                </div>

                <h2 id="game-modal-title" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: '#f8fafc' }}>{jogoAtivo.titulo}</h2>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '20px' }}>
                  {jogoAtivo.descricao}
                </p>

                {jogoAtivo.id === 'dossie-03' ? (
                    <TrainingMaze
                      onComplete={concluirJogo}
                      disabled={aGuardar}
                      onRestart={() => { setMensagemErro(''); lastAttempt.current = null; setSegundos(0); }}
                    />
) : jogoAtivo.id === 'dossie-04' ? (
                  <section className="nonogram-game" aria-label="Nonogram de investigação">
                    <p className="nonogram-instructions">Resolve o nonogram seguindo as pistas para revelar uma imagem. Clica para pintar; ativa o modo × para marcar células vazias.</p>
                    <div className="nonogram-controls">
                      <button type="button" className={modoMarcarVazias ? 'nonogram-mode-button' : 'nonogram-mode-button is-active'} onClick={() => setModoMarcarVazias(false)}>■ Pintar</button>
                      <button type="button" className={modoMarcarVazias ? 'nonogram-mode-button is-active' : 'nonogram-mode-button'} onClick={() => setModoMarcarVazias(true)}>× Marcar vazias</button>
                      <button type="button" className="nonogram-reset-button" onClick={() => setNonogramMarcas(Array(81).fill(0))}>Limpar grelha</button>
                    </div>
                    <div className="nonogram-board" role="group" aria-label="Grelha de nonogram 9 por 9">
                      <div className="nonogram-corner" aria-hidden="true"></div>
                      <div className="nonogram-column-clues">
                        {NONOGRAM_DICAS_COLUNAS.map((dicas, x) => <div className="nonogram-column-clue" key={x} aria-label={`Coluna ${x + 1}: ${dicas.join(', ')}`}>{dicas.map((dica, i) => <span key={i}>{dica}</span>)}</div>)}
                      </div>
                      <div className="nonogram-row-clues">
                        {NONOGRAM_DICAS_LINHAS.map((dicas, y) => <div className="nonogram-row-clue" key={y} aria-label={`Linha ${y + 1}: ${dicas.join(', ')}`}>{dicas.map((dica, i) => <span key={i}>{dica}</span>)}</div>)}
                      </div>
                      <div className="nonogram-cells">
                        {nonogramMarcas.map((marca, indice) => {
                          const linha = Math.floor(indice / 9);
                          const coluna = indice % 9;
                          return <button type="button" key={indice} className={`nonogram-cell ${marca === 1 ? 'is-filled' : marca === 2 ? 'is-empty-marked' : ''} ${coluna === 4 ? 'after-fifth-column' : ''} ${linha === 4 ? 'after-fifth-row' : ''}`} aria-label={`Linha ${linha + 1}, coluna ${coluna + 1}: ${marca === 1 ? 'pintada' : marca === 2 ? 'vazia' : 'por resolver'}`} aria-pressed={marca === 1} onClick={() => marcarCelulaNonogram(indice)}>{marca === 2 ? <span className="nonogram-cell-mark" aria-hidden="true">×</span> : ''}</button>;
                        })}
                      </div>
                    </div>
                  </section>
                ) : (
                  <>
                    <div style={{ background: 'rgba(0,0,0,0.6)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#f8fafc', marginBottom: '24px' }}>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '0.7rem', marginBottom: '6px' }}>{'// PISTA_INTERCEPTADA'}</span>
                      &quot;{jogoAtivo.pista}&quot;
                    </div>

                    <form onSubmit={submeterResposta} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <input
                        type="text"
                        value={inputResposta}
                        onChange={(e) => setInputResposta(e.target.value)}
                        aria-label="Resposta ao desafio"
                        disabled={aGuardar}
                        placeholder="Insira a resposta secreta..."
                        autoFocus
                        style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#f8fafc', fontSize: '0.95rem', outline: 'none' }}
                      />
                      
                      <button type="submit" disabled={aGuardar} className="btn-primary" style={{ cursor: 'pointer', padding: '14px' }}>
                        EXECUTAR ANÁLISE FORENSE
                      </button>
                    </form>


                  </>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ECRÃ FINAL DE SUCESSO / CELEBRAÇÃO */}
      {ecraSucesso && (
        <div role="presentation" style={{ position: 'fixed', inset: '0', background: 'rgba(5, 5, 7, 0.95)', backdropFilter: 'blur(16px)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div role="dialog" aria-modal="true" aria-labelledby="training-success-title" style={{ background: '#0e1117', border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '520px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.9)' }}>
            
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎯</div>
            <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '4px', fontWeight: '800' }}>
              ENIGMA RESOLVIDO COM SUCESSO
            </span>

            <h2 id="training-success-title" style={{ fontSize: '1.6rem', fontWeight: '800', margin: '16px 0 8px 0', color: '#f8fafc' }}>{ecraSucesso.titulo}</h2>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
              {ecraSucesso.saved ? 'Resultado guardado no teu perfil de agente.' : 'Desafio concluído como visitante. Este resultado fica apenas nesta página.'}
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
                {ecraSucesso.saved ? 'Pontos registados na tua conta de agente.' : 'Inicia sessão antes do próximo desafio para guardares os pontos.'}
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
