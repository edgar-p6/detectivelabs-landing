import test from 'node:test';
import assert from 'node:assert/strict';
import { MAZE_MAP, MAZE_START, stepMaze, isMazeComplete } from '../src/lib/maze.mjs';
import { validCompletion } from '../src/lib/training-validation.mjs';

const solution = 'RRRRDDRRRRRRRRDDDDRRUURRUURRUULLLLLLLLLLLLRRRRRRRRRRRRDDDDDDLLDDLLDDLLUULLUUUULLDDLLLLUURRLLLLLLDDDDRRRRRRRRDDDDRRRRRRRRDDLLLLDDLLDDLLUULLDDLLLLUURRUULLLLUURRUURRRRDDDDRRRRLLLLUUUULLLLDDLLDDRRRRDDLLDDRRRRUURRDDRRRRRRRRUURRDD'.split('');
const directExit = 'RRRRDDRRRRRRRRDDDDRRUURRUURRDDDDLLDDLLDDLLUULLUUUULLDDLLLLUULLLLDDDDRRRRRRRRDDDDRRRRRRRRDDLLLLDDLLDDRRRRRRUURRDD'.split('');

test('maze has a closed border, connected corridors and meaningful branches', () => {
  assert.equal(MAZE_MAP.length, 21);
  assert.ok(MAZE_MAP.every(row => row.length === 21 && row[0] === '#' && row[20] === '#'));
  assert.match(MAZE_MAP[0] + MAZE_MAP[20], /^#+$/);
  for (const marker of ['S', 'E', 'A', 'B', 'C']) assert.equal(MAZE_MAP.join('').split(marker).length - 1, 1);
  const queue = [[1, 1]], visited = new Set(['1,1']);
  let deadEnds = 0;
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    const neighbors = [[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([nx,ny]) => MAZE_MAP[ny]?.[nx] && MAZE_MAP[ny][nx] !== '#');
    if (neighbors.length === 1) deadEnds++;
    for (const [nx,ny] of neighbors) if (!visited.has(`${nx},${ny}`)) { visited.add(`${nx},${ny}`); queue.push([nx,ny]); }
  }
  assert.equal(visited.size, [...MAZE_MAP.join('')].filter(cell => cell !== '#').length);
  assert.ok(deadEnds >= 12);
  assert.ok(solution.length > 200);
});

test('a complete route activates all checkpoints and is accepted by the server', () => {
  let state = MAZE_START;
  for (const direction of solution) { state = stepMaze(state, direction); assert.ok(state); }
  assert.equal(state.checkpoints, 7);
  assert.equal(isMazeComplete(state), true);
  assert.equal(validCompletion('dossie-03', solution, 180), true);
  assert.equal(validCompletion('dossie-03', [...solution, 'U'], 180), false);
});

test('walls, invalid directions, early exits and the previous easy solution are rejected', () => {
  assert.equal(stepMaze(MAZE_START, 'U'), null);
  assert.equal(stepMaze(MAZE_START, 'teleport'), null);
  for (const direction of [null, 1, ['R'], {}, '__proto__', 'constructor']) assert.equal(stepMaze(MAZE_START, direction), null);
  assert.equal(validCompletion('dossie-03', [['R'], ...solution.slice(1)], 180), false);
  assert.equal(stepMaze({ x: 19, y: 18, checkpoints: 0 }, 'D'), null);
  assert.equal(isMazeComplete({ x: 19, y: 19, checkpoints: 0 }), false);
  assert.equal(validCompletion('dossie-03', directExit, 40), false);
  assert.equal(validCompletion('dossie-03', ['R','R','D','D','L','L',...Array(10).fill('D'),...Array(12).fill('R')], 20), false);
  assert.equal(validCompletion('dossie-03', solution.slice(0,-1), 180), false);
});
