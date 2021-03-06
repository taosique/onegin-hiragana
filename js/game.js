var SYLLABLE = 0;
var SINGLE_VOWEL = 1;
var CONSONANT = 2;
var OTHER = 3;

Array.prototype.getRandomItem = function () {
    if (this.length == 1) {
        return this[0];
    } else
        if (this.length > 1) {
            return this[Math.floor(Math.random() * this.length)];
        }
}

function getPoem() {
    return POEMS.getRandomItem();
}

function splitWords(text) {
    return text.split(' ');
}

function getIndicesOf(variant, word) {
    var cyrillic = variant.cyrillic;
    var wordLength = cyrillic.length;
    var type = variant.type;

    var startIndex = 0;
    var index;
    var indices = [];

    while ((index = word.indexOf(cyrillic, startIndex)) > -1) {
        if (!(type == CONSONANT && CYRILLIC_ALPHABET[word[index + 1]] == SINGLE_VOWEL) ) { // && !(type == SINGLE_VOWEL && CYRILLIC_ALPHABET[word[index - 1]] == CONSONANT)) {
            indices.push(index);
        }
        startIndex = index + wordLength;
    }
    return indices;
}

function analyzeWord(word) {
    word = word.toLocaleLowerCase();
    CYRILLIC_NORMALIZATION.forEach(function (item) {
        word = word.replace(item.find, item.replace);
    });
    var options = [];
    REPLACEMENTS.forEach(function (item, index) {
        var indices = getIndicesOf(item, word);
        if (indices.length > 0) {
            options.push(
            {
                variant: item,
                positions: indices
            }
            );
        }
    });
    return options;
}

function applyReplacement(word, options) {
    if (options.length > 0) {
        var option = options.getRandomItem();
        var position = option.positions.getRandomItem();
        return word.substr(0, position) + "<span class='replacement'>" + option.variant.hiragana + "</span>" + word.substr(position + option.variant.cyrillic.length);
    }
    return word;
}

function parsePoem(poem) {
    var words = splitWords(poem);
    words.forEach(function (item, index) {
        words[index] = applyReplacement(item, analyzeWord(item));
    });
    return words.join(' ');
}

$(document).ready(function () {

    $('#mainbutton').click(function () {
        var text = parsePoem(getPoem()).replace(/\n/g, '<br />');
        console.log(text);
        $('#verse').html(text);
    });

});