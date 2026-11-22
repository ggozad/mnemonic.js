import { words } from './words.ts';

export { words };

const n = words.length;
const index = new Map(words.map((word, i) => [word, i]));

const mod = (a: number, b: number) => ((a % b) + b) % b;

export function generate(bits = 96): string {
  if (!Number.isInteger(bits) || bits <= 0 || bits % 32 !== 0) {
    throw new RangeError(`bits must be a positive multiple of 32, got ${bits}`);
  }
  return toWords(crypto.getRandomValues(new Uint8Array(bits / 8)));
}

export function toWords(bytes: Uint8Array): string {
  if (bytes.length === 0 || bytes.length % 4 !== 0) {
    throw new RangeError(`byte length must be a positive multiple of 4, got ${bytes.length}`);
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const out: string[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    const x = view.getUint32(i);
    const w1 = x % n;
    const w2 = (Math.floor(x / n) + w1) % n;
    const w3 = (Math.floor(x / n / n) + w2) % n;
    out.push(words[w1], words[w2], words[w3]);
  }
  return out.join(' ');
}

export function parse(phrase: string): Uint8Array {
  const tokens = phrase.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0 || tokens.length % 3 !== 0) {
    throw new Error(`phrase must have a positive multiple of 3 words, got ${tokens.length}`);
  }
  const indices = tokens.map((word) => {
    const i = index.get(word);
    if (i === undefined) throw new Error(`unknown word "${word}"`);
    return i;
  });
  const bytes = new Uint8Array((tokens.length / 3) * 4);
  const view = new DataView(bytes.buffer);
  for (let g = 0; g < indices.length; g += 3) {
    const [w1, w2, w3] = indices.slice(g, g + 3);
    const x = w1 + n * mod(w2 - w1, n) + n * n * mod(w3 - w2, n);
    if (x > 0xffffffff) {
      throw new Error(`words "${tokens.slice(g, g + 3).join(' ')}" are out of range`);
    }
    view.setUint32((g / 3) * 4, x);
  }
  return bytes;
}

export function canonicalise(phrase: string): string {
  return toWords(parse(phrase));
}
