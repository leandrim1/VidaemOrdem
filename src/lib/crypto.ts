/**
 * Hash de senhas para a autenticação mockada.
 *
 * Mesmo sem backend, senhas nunca são armazenadas em texto puro: usamos
 * PBKDF2-SHA256 com salt aleatório por usuário via Web Crypto. Em contextos
 * sem `crypto.subtle` (ex.: acesso por IP da rede local em HTTP), caímos para
 * SHA-256 iterado implementado em JS — ainda com salt.
 *
 * Quando a autenticação migrar para o Supabase Auth, este módulo deixa de ser
 * usado: o hash passa a ser responsabilidade do servidor.
 */
export interface PasswordHash {
  algorithm: 'pbkdf2-sha256' | 'sha256-iter'
  iterations: number
  salt: string
  hash: string
}

const PBKDF2_ITERATIONS = 120_000
const FALLBACK_ITERATIONS = 2_000

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(hex.length / 2)
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
  return out
}

function hasSubtle(): boolean {
  return typeof crypto !== 'undefined' && typeof crypto.subtle?.importKey === 'function'
}

async function pbkdf2(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
  return toHex(new Uint8Array(bits))
}

/* SHA-256 compacto (FIPS 180-4) usado apenas como fallback. */
const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
  0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
  0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
  0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function sha256(data: Uint8Array): Uint8Array {
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19])
  const bitLen = data.length * 8
  const padded = new Uint8Array(Math.ceil((data.length + 9) / 64) * 64)
  padded.set(data)
  padded[data.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(padded.length - 4, bitLen >>> 0)
  view.setUint32(padded.length - 8, Math.floor(bitLen / 2 ** 32))
  const w = new Uint32Array(64)
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n))
  for (let offset = 0; offset < padded.length; offset += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(offset + i * 4)
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let i = 0; i < 64; i++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const t1 = (hh + s1 + ch + K[i] + w[i]) >>> 0
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const t2 = (s0 + maj) >>> 0
      hh = g
      g = f
      f = e
      e = (d + t1) >>> 0
      d = c
      c = b
      b = a
      a = (t1 + t2) >>> 0
    }
    h[0] += a; h[1] += b; h[2] += c; h[3] += d; h[4] += e; h[5] += f; h[6] += g; h[7] += hh
  }
  const out = new Uint8Array(32)
  const outView = new DataView(out.buffer)
  h.forEach((value, i) => outView.setUint32(i * 4, value))
  return out
}

function iteratedSha256(password: string, salt: Uint8Array, iterations: number): string {
  const encoder = new TextEncoder()
  let digest = sha256(new Uint8Array([...salt, ...encoder.encode(password)]))
  for (let i = 1; i < iterations; i++) digest = sha256(new Uint8Array([...salt, ...digest]))
  return toHex(digest)
}

export async function hashPassword(password: string): Promise<PasswordHash> {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)
  if (hasSubtle()) {
    return { algorithm: 'pbkdf2-sha256', iterations: PBKDF2_ITERATIONS, salt: toHex(salt), hash: await pbkdf2(password, salt, PBKDF2_ITERATIONS) }
  }
  return { algorithm: 'sha256-iter', iterations: FALLBACK_ITERATIONS, salt: toHex(salt), hash: iteratedSha256(password, salt, FALLBACK_ITERATIONS) }
}

/** Comparação em tempo constante para não vazar informação por timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verifyPassword(password: string, stored: PasswordHash): Promise<boolean> {
  const salt = fromHex(stored.salt)
  if (stored.algorithm === 'pbkdf2-sha256') {
    if (!hasSubtle()) return false
    return safeEqual(await pbkdf2(password, salt, stored.iterations), stored.hash)
  }
  return safeEqual(iteratedSha256(password, salt, stored.iterations), stored.hash)
}

/** Token de sessão opaco e aleatório. */
export function createToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return toHex(bytes)
}
