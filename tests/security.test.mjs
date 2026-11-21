import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHmac } from 'node:crypto';
import { normalizeEmail, safeNext, readSmallJson, agentName } from '../src/lib/security.mjs';
import { validCompletion, trainingProgress } from '../src/lib/training-validation.mjs';

function load(file, dependencies, names) {
  const source = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8')
    .replace(/^import .*;\r?\n/gm, '').replace(/^export /gm, '');
  return new Function(...Object.keys(dependencies), source + '\nreturn {' + names.join(',') + '};')(...Object.values(dependencies));
}
const NextResponse = { json: (value, options) => Response.json(value, options), redirect: (url, options) => new Response(null, { status: 307, headers: { ...options?.headers, location: url.href } }) };

test('emails are normalized; wrong types, oversized and malformed emails are rejected', () => {
  assert.equal(normalizeEmail('  Suporte@DetectiveLabs.PT '), 'suporte@detectivelabs.pt');
  for (const value of [null, {}, ['@'], 'a@', 'a@@b.pt', 'a b@c.pt', '<a@b.pt>', 'a'.repeat(250) + '@b.pt']) assert.equal(normalizeEmail(value), null);
  assert.equal(agentName({ user_metadata: { agent_name: {} } }, 'Perfil'), 'Perfil');
});

test('post-login destinations cannot leave the site', () => {
  for (const value of ['//evil.test', '/\\evil.test', 'https://evil.test', '/%5cevil.test', '/conta?next=//evil.test', null]) assert.equal(safeNext(value), '/conta');
  assert.equal(safeNext('/treinos'), '/treinos');
});

test('JSON request limit applies to actual streamed bytes', async () => {
  assert.deepEqual(await readSmallJson(new Request('https://example.test', { method: 'POST', body: '{"email":"a@b.pt"}' })), { email: 'a@b.pt' });
  await assert.rejects(readSmallJson(new Request('https://example.test', { method: 'POST', body: '{' })));
  await assert.rejects(readSmallJson(new Request('https://example.test', { method: 'POST', body: JSON.stringify({ email: 'x'.repeat(4096) }) })), /body-too-large/);
});

test('solutions are checked for every playable game; locked and forged results fail', () => {
  for (const [id, answer] of [['dossie-00', 'verdade'], ['dossie-01', 'ouro'], ['dossie-02', 'outono'], ['dossie-05', 'sol'], ['dossie-06', 'lua']]) {
    assert.equal(validCompletion(id, ' ' + answer.toUpperCase() + ' ', 25), true);
    assert.equal(validCompletion(id, 'wrong', 25), false);
  }
  assert.equal(validCompletion('dossie-07', '', 0), false);
  assert.equal(validCompletion('dossie-01', { pontos: 999999 }, 1), false);
  for (const seconds of [-1, 0.5, Infinity, 86401]) assert.equal(validCompletion('dossie-01', 'ouro', seconds), false);
  assert.equal(validCompletion('dossie-03', ['U'], 5), false);
  assert.equal(validCompletion('dossie-03', Array(4097).fill('R'), 5), false);
  const grid = Array.from({ length: 81 }, (_, i) => i < 9 || i >= 72 || i % 9 === 0 || i % 9 === 8 ? 1 : 2);
  assert.equal(validCompletion('dossie-04', grid, 5), true);
  assert.equal(validCompletion('dossie-04', Array(81).fill(1), 5), false);
});

test('points come from verified game IDs, never from stored or browser-provided points', () => {
  const result = trainingProgress([
    { game_id: 'dossie-01', best_seconds: 12, last_seconds: 20, completions: 2, pontos: 999999 },
    { game_id: 'unknown', best_seconds: 0, last_seconds: 0, completions: 100, pontos: 999999 },
  ]);
  assert.equal(result.pontos, 100);
  assert.equal(result.jogos[0].tempo, '00:12');
  assert.equal(result.jogos[0].estatisticas.tentativas, 2);
  assert.equal(trainingProgress([]).pontos, 0);
});

test('completion uses authenticated identity; rejected solutions cannot write; outages preserve progress', async () => {
  let calls = 0, captured;
  const user = { id: 'authenticated-user', user_metadata: {} };
  const client = { auth: { getUser: async () => ({ data: { user } }) }, from: () => ({ select: () => ({ eq: async () => ({ error: { message: 'outage' } }) }) }) };
  const actions = load('src/app/conta/actions.js', {
    createClient: async () => client, createAdminClient: () => ({ rpc: async (_name, args) => { calls++; captured = args; return {}; } }),
    revalidatePath: () => {}, agentName, validCompletion, trainingProgress,
  }, ['getTrainingProgress', 'completeTraining']);
  assert.ok((await actions.completeTraining('dossie-01', { pontos: 999999, user_id: 'victim' }, 0)).error);
  assert.equal(calls, 0);
  assert.equal((await actions.completeTraining('dossie-01', 'ouro', 30)).saved, true);
  assert.deepEqual(captured, { p_user_id: 'authenticated-user', p_game_id: 'dossie-01', p_seconds: 30 });
  assert.ok((await actions.getTrainingProgress()).error);
  assert.equal(calls, 1);
});

test('subscription validates before database access, hides duplicates and errors, and enforces rate response', async () => {
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'isolated-test-secret';
  let calls = 0, captured, result = { data: true };
  const { POST } = load('src/app/api/subscribe/route.js', { createHmac, NextResponse, normalizeEmail, readSmallJson,
    createAdminClient: () => ({ rpc: async (_name, args) => { calls++; captured = args; return result; } }),
  }, ['POST']);
  const request = (body, headers = {}) => new Request('https://detectivelabs.pt/api/subscribe', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });
  for (const body of [{ email: 'a@' }, { email: ['@'] }, null, '{']) assert.equal((await POST(request(body))).status, 400);
  assert.equal((await POST(request({ email: 'a@b.pt' }, { origin: 'https://evil.test' }))).status, 403);
  assert.equal(calls, 0);
  const first = await POST(request({ email: ' A@B.PT ' }));
  assert.equal(first.status, 200);
  assert.equal(captured.p_email, 'a@b.pt');
  assert.match(captured.p_bucket, /^[a-f0-9]{64}$/);
  result = { data: false };
  const limited = await POST(request({ email: 'a@b.pt' }));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get('retry-after'), '600');
  result = { error: { message: 'sensitive database details' } };
  const failed = await POST(request({ email: 'a@b.pt' }));
  assert.equal(failed.status, 503);
  assert.doesNotMatch(await failed.text(), /sensitive/);
});

test('callback rejects redirect bypass even after successful code exchange', async () => {
  const { GET } = load('src/app/auth/callback/route.js', { NextResponse, safeNext,
    createClient: async () => ({ auth: { exchangeCodeForSession: async () => ({ error: null }) } }),
  }, ['GET']);
  const result = await GET(new Request('https://detectivelabs.pt/auth/callback?code=test&next=' + encodeURIComponent('/\\evil.test')));
  assert.equal(result.headers.get('location'), 'https://detectivelabs.pt/conta');
  assert.equal(result.headers.get('referrer-policy'), 'no-referrer');
});
