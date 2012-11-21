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

    });


})(this.Mnemonic);
