(function (Mnemonic) {

    describe('Mnemonic', function () {

        it('creates mnemonics of 32*n bits', function () {
            var m;
            m = new Mnemonic(32);
            expect(m.seed.length).toEqual(1);
            m = new Mnemonic(64);
            expect(m.seed.length).toEqual(2);
            m = new Mnemonic(); // Default 96bits
            expect(m.seed.length).toEqual(3);
            m = new Mnemonic(256);
            expect(m.seed.length).toEqual(8);

            var illegal = function () {
                return new Mnemonic(42);
            };
            expect(illegal).toThrow();
        });

        it('produces the right words', function () {
            var m;
            m = new Mnemonic(32);
            m.seed[0] = 0;
            expect(m.toWords()).toEqual(['like', 'like', 'like']); // First word 3 times

            m.seed[0] = Mnemonic.wc - 1;
            expect(m.toWords()).toEqual(['weary', 'weary', 'weary']); // Last word 3 times

            m.seed[0] = Math.pow(2,32) - 1;
            expect(m.toWords()).toEqual(['fail', 'husband', 'howl']);
        });

        it('produces the right hex', function () {
            var m;
            m = new Mnemonic(32);
            m.seed[0] = 0;
            expect(m.toHex()).toEqual('00000000'); // First word 3 times

            m.seed[0] = Mnemonic.wc - 1;
            expect(m.toHex()).toEqual('00000659'); // Last word 3 times

            m.seed[0] = Math.pow(2,32) - 1;
            expect(m.toHex()).toEqual('ffffffff');
        });

        it('can be constructed from a Uint32 array', function () {
            var arr, m2, m1 = new Mnemonic();
            arr = m1.seed;
            m2 = new Mnemonic(arr);
            expect(m1.seed).toEqual(m2.seed);
        });

        it('can be reconstructed from words', function () {
            var m2, m1 = new Mnemonic();
            m2 = Mnemonic.fromWords(m1.toWords());
            expect(m1.seed).toEqual(m2.seed);
        });

        it('can be reconstructed from hex', function () {
            var m2, m1 = new Mnemonic();
            m2 = Mnemonic.fromHex(m1.toHex());
            expect(m1.seed).toEqual(m2.seed);
        });
    });


})(this.Mnemonic);
