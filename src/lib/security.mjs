export function normalizeEmail(value) {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  return email;
}

export function safeNext(value) {
  return ['/conta', '/treinos'].includes(value) ? value : '/conta';
}

export function agentName(user, fallback = '') {
  const name = user?.user_metadata?.agent_name;
  return typeof name === 'string' ? name.trim().slice(0, 40) || fallback : fallback;
}

export async function readSmallJson(request) {
  const reader = request.body?.getReader();
  if (!reader) throw new Error('invalid-body');
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 4096) throw new Error('body-too-large');
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
