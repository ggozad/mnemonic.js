import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { canonicalise, generate, parse, toWords, words } from '../src/index.ts';

// 1.1 vectors whose words are all still in the list.
const vectors: { hex: string; words: string }[] = JSON.parse(
  readFileSync(new URL('./vectors-1.1.json', import.meta.url), 'utf8'),
).filter((v: { words: string }) => v.words.split(' ').every((w) => words.includes(w)));

const fromHex = (hex: string) => Uint8Array.from(Buffer.from(hex, 'hex'));
const toHex = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');

test('words has 1626 unique entries', () => {
  assert.equal(words.length, 1626);
  assert.equal(new Set(words).size, 1626);
});

test('toWords matches 1.1 output', () => {
  for (const v of vectors) assert.equal(toWords(fromHex(v.hex)), v.words, v.hex);
});

test('parse matches 1.1 output', () => {
  for (const v of vectors) assert.equal(toHex(parse(v.words)), v.hex, v.words);
});

test('multi-word-group phrases are big-endian uint32 per group', () => {
  const hex = vectors.slice(0, 3).map((v) => v.hex).join('');
  const phrase = vectors.slice(0, 3).map((v) => v.words).join(' ');
  assert.equal(toWords(fromHex(hex)), phrase);
  assert.equal(toHex(parse(phrase)), hex);
});

test('toWords refuses a length that is not a multiple of 4 bytes', () => {
  assert.throws(() => toWords(new Uint8Array(0)), RangeError);
  assert.throws(() => toWords(new Uint8Array(5)), RangeError);
});

test('parse normalises case and whitespace', () => {
  assert.equal(toHex(parse('  Fail\tHUSBAND \n howl ')), 'ffffffff');
});

test('parse refuses an unknown word and names it', () => {
  assert.throws(() => parse('fail husbandd howl'), /"husbandd"/);
});

test('parse refuses a word count that is not a positive multiple of 3', () => {
  assert.throws(() => parse(''), /multiple of 3/);
  assert.throws(() => parse('fail husband'), /multiple of 3/);
  assert.throws(() => parse('like like like like'), /multiple of 3/);
});

test('parse refuses a group that decodes to 2^32 or more', () => {
  // w1 = 0, (w2 - w1) mod n = 1625, (w3 - w2) mod n = 1625 decodes to n^3 - 1.
  const phrase = [words[0], words[1625], words[1624]].join(' ');
  assert.throws(() => parse(phrase), /out of range/);
});

test('canonicalise returns lower case single-spaced words', () => {
  assert.equal(canonicalise('  Fail\tHUSBAND \n howl '), 'fail husband howl');
  assert.throws(() => canonicalise('fail husbandd howl'), /"husbandd"/);
  assert.throws(() => canonicalise('fail husband howl like'), /multiple of 3/);
});

test('generate returns 3 words per 32 bits that round trip', () => {
  const phrase = generate();
  assert.equal(phrase.split(' ').length, 9);
  assert.equal(toWords(parse(phrase)), phrase);
  assert.equal(generate(32).split(' ').length, 3);
  assert.equal(generate(256).split(' ').length, 24);
});

test('generate refuses bits that are not a positive multiple of 32', () => {
  for (const bits of [0, 42, -32, 32.5]) assert.throws(() => generate(bits), RangeError);
});
