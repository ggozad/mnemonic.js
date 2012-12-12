function generate() {
    var i=0, bits, m, words;
    bits = $('#strength').val();
    m = new Mnemonic(parseInt(bits, 10));
    $('#hex').text(m.toHex());
    words = m.toWords();
    $('#words').html('');
    for (;i < words.length; i++) {
        $('#words').append($('<li>').text(words[i]+' '));
    }
}

function clipboard(ev) {
    var bg, cb;
    bg = chrome.extension.getBackgroundPage();
    cb = bg.document.getElementById("cb");
    cb.style.display = "block";
    cb.value = $(ev.target).text();
    cb.select();
    bg.document.execCommand("Copy");
    cb.style.display = "none";
}


$(function () {
    $('#generate').on('click', generate);
    $('#hex').on('click', clipboard);
    generate();
});
