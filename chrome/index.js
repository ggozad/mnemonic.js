function generate() {
    var i=0, bits, m, words;
    bits = $('#strength').val();
    m = new Mnemonic(parseInt(bits, 10));
    $('#hex').text(m.toHex());
    words = m.toWords();
    $('#words').html('');
    for (;i < words.length; i++) {
        $('#words').append($('<li>').text(words[i]));
    }
}

$(function () {
    $('#generate').on('click', generate);
    generate();
});
