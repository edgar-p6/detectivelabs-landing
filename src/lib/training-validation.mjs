import { MAZE_START, stepMaze, isMazeComplete } from './maze.mjs';

export const REWARDS = { 'dossie-00': 100, 'dossie-01': 100, 'dossie-02': 150, 'dossie-03': 150, 'dossie-04': 150, 'dossie-05': 100, 'dossie-06': 100 };
const answers = { 'dossie-00': 'verdade', 'dossie-01': 'ouro', 'dossie-02': 'outono', 'dossie-05': 'sol', 'dossie-06': 'lua' };


export function validCompletion(id, attempt, seconds) {
  if (!Object.hasOwn(REWARDS, id) || !Number.isInteger(seconds) || seconds < 0 || seconds > 86400) return false;
  if (Object.hasOwn(answers, id)) return typeof attempt === 'string' && attempt.length <= 100 && attempt.trim().toLowerCase() === answers[id];
  if (id === 'dossie-04') return Array.isArray(attempt) && attempt.length === 81
    && attempt.every((mark, index) => [0, 1, 2].includes(mark)
      && (mark === 1) === (index < 9 || index >= 72 || index % 9 === 0 || index % 9 === 8));
  if (!Array.isArray(attempt) || !attempt.length || attempt.length > 4096) return false;
  let state = MAZE_START;
  for (const direction of attempt) {
    state = stepMaze(state, direction);
    if (!state) return false;
  }
  return isMazeComplete(state);
}

export function formatTime(seconds) {
  return `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
}

export function trainingProgress(rows) {
  const results = rows.filter(row => Object.hasOwn(REWARDS, row.game_id));
  return {
    pontos: results.reduce((sum, row) => sum + REWARDS[row.game_id], 0),
    jogos: results.map(row => ({ id: row.game_id, status: 'resolvido', tempo: formatTime(row.best_seconds),
      estatisticas: { melhorTempo: formatTime(row.best_seconds), ultimaDuracao: formatTime(row.last_seconds), tentativas: row.completions, pontosGanhos: REWARDS[row.game_id] } })),
  };
}
