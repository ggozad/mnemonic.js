(function (Mnemonic) {

    describe('Mnemonic', function () {

        it('creates mnemonics of 32*n bits', function () {
            var m;
            m = new Mnemonic(32);
            expect(m.random.length).toEqual(1);
            m = new Mnemonic(64);
            expect(m.random.length).toEqual(2);
            m = new Mnemonic(); // Default 96bits
            expect(m.random.length).toEqual(3);
            m = new Mnemonic(256);
            expect(m.random.length).toEqual(8);

            var illegal = function () {
                return new Mnemonic(42);
            };
            expect(illegal).toThrow();
        });

        it('produces the right words', function () {
            var m;
            m = new Mnemonic(32);
            m.random[0] = 0;
            expect(m.toWords()).toEqual(['like', 'like', 'like']); // First word 3 times

            m.random[0] = Mnemonic.wc - 1;
            expect(m.toWords()).toEqual(['weary', 'weary', 'weary']); // Last word 3 times

            m.random[0] = Math.pow(2,32) - 1;
            expect(m.toWords()).toEqual(['fail', 'husband', 'howl']);
        });

        it('produces the right hex', function () {
            var m;
            m = new Mnemonic(32);
            m.random[0] = 0;
            expect(m.toHex()).toEqual('00000000'); // First word 3 times

            m.random[0] = Mnemonic.wc - 1;
            expect(m.toHex()).toEqual('00000659'); // Last word 3 times

            m.random[0] = Math.pow(2,32) - 1;
            expect(m.toHex()).toEqual('ffffffff');
        });

        it('can be constructed from a Uint32 array', function () {
            var arr, m2, m1 = new Mnemonic();
            arr = m1.random;
            m2 = new Mnemonic(arr);
            expect(m1.toHex()).toEqual(m2.toHex());
        });

        it('can be reconstructed from words', function () {
            var m2, m1 = new Mnemonic();
            m2 = Mnemonic.fromWords(m1.toWords());
            expect(m1.toHex()).toEqual(m2.toHex());
        });

        it('words can be reconstructed from hex', function () {
            var words, hex, m1 = new Mnemonic();
            words = m1.toWords();
            hex = m1.toHex();
            expect(words).toEqual(m1.seedToWords(hex));
        });
    });


})(this.Mnemonic);
