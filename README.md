# @ggozad/mnemonic

Random phrases of a chosen strength, as English words. Every 32 bits become 3 words from a list of 1,626, so a 96-bit phrase has 9 words:

    mean yesterday gone size waist lace endless apple war

ESM with TypeScript types, for browsers and Node 23.6+. Randomness comes from `crypto.getRandomValues`.

## Install

    pnpm add @ggozad/mnemonic

## Usage

```ts
import { canonicalise, generate, parse, toWords, words } from '@ggozad/mnemonic';

generate();      // 9 words, 96 bits
generate(128);   // 12 words; bits must be a positive multiple of 32

toWords(bytes);  // Uint8Array whose length is a multiple of 4 → phrase
parse(phrase);   // phrase → Uint8Array

canonicalise('  Mean YESTERDAY gone ...'); // 'mean yesterday gone ...'

words;           // the 1,626 words, for autocomplete
```

`parse` and `canonicalise` ignore case and extra whitespace. They throw on a word that is not in `words` (the message names it), on a word count that is not a positive multiple of 3, and on a 3-word group that does not encode a 32-bit value.

## Encoding

Bytes are read as big-endian 32-bit unsigned integers. With `n = 1626`, each integer `x` becomes the word indices

    w1 = x mod n
    w2 = (floor(x / n) + w1) mod n
    w3 = (floor(x / n²) + w2) mod n

and a triplet of indices decodes to

    x = w1 + n·((w2 − w1) mod n) + n²·((w3 − w2) mod n)

`n³ = 4,298,942,376` is just above `2³² = 4,294,967,296`, so every 32-bit value has a triplet. The 3,974,080 triplets that decode to `2³²` or more are rejected.

## Word list

The words come from a [frequency list of contemporary English poetry](http://en.wiktionary.org/wiki/Wiktionary:Frequency_lists/Contemporary_poetry). Version 2 replaces 58 words about violence, drugs, sex and insults with neutral nouns, in place. A phrase without those words decodes as it did in 1.x.

The idea comes from the [Electrum](https://electrum.org/) bitcoin client.

## License

MIT. Copyright (C) Yiorgis Gozadinos.
