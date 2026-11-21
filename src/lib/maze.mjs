export const MAZE_MAP = [
  '#####################',
  '#S....#C............#',
  '#####.#########.###.#',
  '#...#.........#.#...#',
  '#.###########.###.#.#',
  '#......B#...#.#...#.#',
  '#.###.###.#.#.#.###.#',
  '#.#.#.....#.#...#...#',
  '#.#.#######.#####.###',
  '#.........#...#...#.#',
  '#########.###.#.###.#',
  '#.......#.#.#...#...#',
  '###.###.#.#.#######.#',
  '#...#...#.........#.#',
  '#.#####.#########.#.#',
  '#.....#....A#.....#.#',
  '#.###.#######.#####.#',
  '#.#...#...#...#.....#',
  '#.#.###.#.#.#####.#.#',
  '#.#.....#.........#E#',
  '#####################',
];

export const MAZE_START = { x: 1, y: 1, checkpoints: 0 };
export const MAZE_CHECKPOINTS = ['A', 'B', 'C'];
export const MAZE_DIRECTIONS = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };
export const MAZE_ALL_CHECKPOINTS = (1 << MAZE_CHECKPOINTS.length) - 1;

export function stepMaze(state, direction) {
  if (typeof direction !== 'string' || !Object.hasOwn(MAZE_DIRECTIONS, direction)) return null;
  const delta = MAZE_DIRECTIONS[direction];
  if (!delta || MAZE_MAP[state.y]?.[state.x] === 'E') return null;
  const x = state.x + delta[0], y = state.y + delta[1];
  const cell = MAZE_MAP[y]?.[x];
  if (!cell || cell === '#' || (cell === 'E' && state.checkpoints !== MAZE_ALL_CHECKPOINTS)) return null;
  const checkpoint = MAZE_CHECKPOINTS.indexOf(cell);
  return { x, y, checkpoints: checkpoint < 0 ? state.checkpoints : state.checkpoints | (1 << checkpoint) };
}

export function isMazeComplete(state) {
  return state.checkpoints === MAZE_ALL_CHECKPOINTS && MAZE_MAP[state.y]?.[state.x] === 'E';
}
