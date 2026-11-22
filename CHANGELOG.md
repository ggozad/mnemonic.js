# Changelog

## [2.0.0] - 2026-11-22

### Changed

- Published as `@ggozad/mnemonic`, ESM only with TypeScript types. Requires Node 23.6+ or a browser with `crypto.getRandomValues`.
- The `Mnemonic` class is replaced by functions: `generate(bits)`, `toWords(bytes)`, `parse(phrase)`, `canonicalise(phrase)` and `words`. Migrate `new Mnemonic(bits).toWords()` to `generate(bits)`, and `Mnemonic.fromWords(list).seed` to `parse(list.join(' '))`, which returns big-endian bytes.
- `toHex`, `fromHex`, `seed` and `wc` removed.
- 58 words replaced in the word list: kill, murder, rape, abuse, gun, bomb, knife, bullet, weapon, shoot, stab, torture, victim, violence, poison, choke, suffocate, punch, slap, blade, sword, suicide, death, blood, bloody, bleed, drug, drunk, cigarette, naked, breast, thigh, lust, gay, damn, crap, screw, idiot, stupid, dumb, loser, freak, pathetic, worthless, nerd, jock, pig, coward, ugly, insane, depress, depression, demon, devil, hate, hatred, terror, revenge. Phrases containing them no longer parse.
- Bower, AMD and CommonJS builds and the Chrome extension removed.

### Fixed

- Parsing throws on a word that is not in the list. It returned a wrong value.
- Parsing throws on a 3-word group that decodes to 2³² or more. It wrapped modulo 2³².
