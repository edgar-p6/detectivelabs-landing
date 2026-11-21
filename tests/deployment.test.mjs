import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('Vercel builds require public Supabase settings and a server credential; accepted aliases still work', () => {
  const values = {
    VERCEL: '1',
    NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'public-test-key',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
    SUPABASE_SERVICE_ROLE_KEY: 'server-test-key',
    SUPABASE_SECRET_KEY: '',
  };
  const check = (overrides) => spawnSync(process.execPath, ['--input-type=module', '-e', "import './next.config.mjs'"], {
    cwd: new URL('..', import.meta.url),
    env: { ...process.env, ...values, ...overrides },
    encoding: 'utf8',
  });
  for (const name of ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) {
    const result = check({ [name]: '' });
    assert.notEqual(result.status, 0);
    assert.ok(result.stderr.includes(name));
  }
  assert.equal(check({}).status, 0);
  assert.equal(check({ NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: '', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'public-alias', SUPABASE_SERVICE_ROLE_KEY: '', SUPABASE_SECRET_KEY: 'server-alias' }).status, 0);
});
