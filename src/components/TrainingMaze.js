'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MAZE_MAP, MAZE_START, MAZE_CHECKPOINTS, MAZE_DIRECTIONS, MAZE_ALL_CHECKPOINTS, stepMaze, isMazeComplete } from '@/lib/maze.mjs';

export default function TrainingMaze({ onComplete, onRestart, disabled }) {
  const [player, setPlayer] = useState(MAZE_START);
  const [moves, setMoves] = useState(0);
  const [visited, setVisited] = useState(() => new Set(['1,1']));
  const [showTrail, setShowTrail] = useState(false);
  const [notice, setNotice] = useState('');
  const position = useRef(MAZE_START);
  const route = useRef([]);
  const finished = useRef(false);
  const collected = MAZE_CHECKPOINTS.filter((_, index) => player.checkpoints & (1 << index)).length;

  const move = useCallback((direction) => {
    if (disabled || finished.current) return;
    const before = position.current;
    const next = stepMaze(before, direction);
    if (!next) {
      const delta = MAZE_DIRECTIONS[direction];
      if (delta && MAZE_MAP[before.y + delta[1]]?.[before.x + delta[0]] === 'E') {
        setNotice('A saída está fechada. Ativa os três postos de controlo.');
      }
      return;
    }
    position.current = next;
    route.current.push(direction);
    setPlayer(next);
    setMoves(route.current.length);
    setVisited((previous) => new Set(previous).add(`${next.x},${next.y}`));
    if (next.checkpoints !== before.checkpoints) {
      setNotice(`Posto ${MAZE_MAP[next.y][next.x]} ativado.${next.checkpoints === MAZE_ALL_CHECKPOINTS ? ' A saída já está aberta.' : ''}`);
    } else {
      setNotice('');
    }
    if (isMazeComplete(next)) {
      finished.current = true;
      setNotice('Saída alcançada. A validar o percurso…');
      onComplete([...route.current]);
    }
  }, [disabled, onComplete]);

  useEffect(() => {
    const keys = { ArrowUp: 'U', ArrowRight: 'R', ArrowDown: 'D', ArrowLeft: 'L', w: 'U', d: 'R', s: 'D', a: 'L' };
    function handleKey(event) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.target.closest?.('input, select, textarea, [contenteditable="true"]')) return;
      const direction = keys[event.key] || keys[event.key.toLowerCase()];
      if (!direction) return;
      event.preventDefault();
      move(direction);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [move]);

  function restart() {
    if (disabled) return;
    position.current = MAZE_START;
    route.current = [];
    finished.current = false;
    setPlayer(MAZE_START);
    setMoves(0);
    setVisited(new Set(['1,1']));
    setNotice('Percurso reiniciado.');
    onRestart();
  }

  return (
    <section className="maze-game" aria-label="Labirinto do Corredor B">
      <p id="maze-instructions" className="maze-instructions">Ativa os postos A, B e C, pela ordem que preferires, e chega à saída. Usa as setas, WASD ou os botões.</p>
      <div className="maze-progress">
        <span>Postos: <strong>{collected}/3</strong></span>
        <span>Movimentos: <strong>{moves}</strong></span>
        <span>{player.checkpoints === MAZE_ALL_CHECKPOINTS ? 'Saída aberta' : 'Saída fechada'}</span>
      </div>
      <ul className="maze-checkpoints" aria-label="Postos de controlo">
        {MAZE_CHECKPOINTS.map((label, index) => <li key={label} className={player.checkpoints & (1 << index) ? 'is-collected' : ''}>Posto {label}: {player.checkpoints & (1 << index) ? 'ativado' : 'por ativar'}</li>)}
      </ul>
      <div className="maze-board" role="img" tabIndex={0} aria-describedby="maze-instructions" aria-label={`Planta do corredor, 21 por 21. Detetive na linha ${player.y + 1}, coluna ${player.x + 1}. ${collected} de 3 postos ativados.`}>
        {MAZE_MAP.flatMap((row, y) => [...row].map((cell, x) => {
          const isPlayer = player.x === x && player.y === y;
          const checkpoint = MAZE_CHECKPOINTS.indexOf(cell);
          return <span key={`${x},${y}`} aria-hidden="true" className={`maze-cell${cell === '#' ? ' is-wall' : ''}${checkpoint >= 0 ? ' is-checkpoint' : ''}${cell === 'E' ? ' is-exit' : ''}${showTrail && visited.has(`${x},${y}`) ? ' is-visited' : ''}${checkpoint >= 0 && player.checkpoints & (1 << checkpoint) ? ' is-collected' : ''}${cell === 'E' && player.checkpoints === MAZE_ALL_CHECKPOINTS ? ' is-open' : ''}`}>
            {isPlayer ? <span className="maze-player">●</span> : checkpoint >= 0 ? cell : cell === 'E' ? 'E' : cell === 'S' ? 'S' : ''}
          </span>;
        }))}
      </div>
      <p className="maze-legend">● Detetive · S Início · A/B/C Postos · E Saída</p>
      <div className="maze-direction-controls">
        {[['U', 'Mover para cima', '↑'], ['L', 'Mover para a esquerda', '←'], ['D', 'Mover para baixo', '↓'], ['R', 'Mover para a direita', '→']].map(([direction, label, symbol]) => <button key={direction} type="button" className={`maze-direction maze-direction-${direction}`} aria-label={label} disabled={disabled || isMazeComplete(player)} onClick={() => move(direction)}>{symbol}</button>)}
      </div>
      <div className="maze-tools">
        <button type="button" aria-pressed={showTrail} onClick={() => setShowTrail(!showTrail)}>{showTrail ? 'Ocultar percurso' : 'Mostrar percurso'}</button>
        <button type="button" disabled={disabled} onClick={restart}>Reiniciar labirinto</button>
      </div>
      <p className="maze-notice" role="status">{notice}</p>
    </section>
  );
}
