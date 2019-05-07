var secretCodeLength, digitRange, secretCode, userGuess, whiteCount, blackCount, turn, validGuesses;

function run() {

    secretCodeLength = 4;
    digitRange = 4;

    for (var i = 1; i < 10; i++) {
        $('#chooseSecretCodeLength').append(`<option value="${i}">${i}</option>`);
        $('#chooseDigitRange').append(`<option value="${i}">${i}</option>`);
    }

    $('#submitGuess').click(handleSubmit);
    $('#resetGame').click(handleReset);

    initializeGame();
}

function initializeGame() {
    generateSecretCode();
    generateInputFields();
    appendSecretCode();
    clearFeedback();
    initializeEventListeners();
    $('#input1').focus();
    turn = 0;
}

function generateSecretCode() {
    secretCode = [];
    for (var num = 0; num < secretCodeLength; num++) {
        secretCode.push(Math.floor(Math.random() * digitRange) + 1);
    }
    console.log('sc ' + secretCode);
    return secretCode;
}

function generateInputFields() {
    $('#inputContainer').html('');

    for (var i = 1; i <= secretCodeLength; i++) {
        $('#inputContainer').append(`<input id="input${i}" type="text" minlength="1" maxlength="1" pattern="[1-${digitRange}]" class="noBueno">`);
    }
}

function appendSecretCode() {
    $('#secretCodeContainer').html('');

    for (var i = 0; i < secretCodeLength; i++) {
        $('#secretCodeContainer').append('<div class="mysteryPeg">?</div>');
    }
}

function validateGuess() {
    var validSlots = $('.muyBueno').length;

    if (validSlots == secretCodeLength) {
        $('#submitGuess').removeAttr('disabled');
        // $('input').keyup(function(event) {
        //     if (event.keyCode == 13) {
        //         handleSubmit();
        //     }
        // });
    } else {
        $('#submitGuess').attr('disabled','disabled');
    }
}

function handleSubmit() {
    userGuess = getGuess();
    turn++;
    blackCount = getBlackCount();
    whiteCount = getWhiteCount();
    render();
}

function handleReset() {
    secretCodeLength = parseInt($('#chooseSecretCodeLength').val());
    digitRange = parseInt($('#chooseDigitRange').val());

    initializeGame();
}

function render() {
    createNewFeedbackRow();
    appendFeedbackToRow();
    generateInputFields();
    initializeEventListeners();
    $('#input1').focus();
}

function getGuess() {
    var guess = [];
    for (var num = 1; num <= secretCodeLength; num++) {
        guess.push(parseInt($('#input' + num).val()));
    }

    return guess;
}

function getBlackCount() {
    var blackCount = 0;
    for (var i = 0; i < secretCodeLength; i++) {
        if (secretCode[i] == userGuess[i]) {
            blackCount++;
        }
    }

    return blackCount;
}

function getWhiteCount() {
    var code = secretCode.slice();
    
    whiteCount = 0;
    for (var i = 0; i < secretCodeLength; i++) {
        if (code.includes(userGuess[i])) {
            whiteCount++;
            code.splice(code.indexOf(userGuess[i]), 1);
        }
    }

    return whiteCount - blackCount;
}

function createNewFeedbackRow() {
    $('#feedbackContainer').append(`
        <div class="turnFeedback tf${turn}">
            <div class="guessContainer gc${turn}"></div>
            <div class="spacer"></div>
            <div class="dotContainer dc${turn}">
                <div class="blackContainer bc${turn}"></div>
                <div class="whiteContainer wc${turn}"></div>
            </div>
        </div>
    `)
}

function appendFeedbackToRow() {
    appendGuess();
    appendBlackDots();
    appendWhiteDots();
}

function appendGuess() {
    for (var i = 0; i < secretCodeLength; i++) {
        $(`.gc${turn}`).append(`<div class="guessPeg guessPeg${userGuess[i]}">${userGuess[i]}</div>`);
    }
}

function appendBlackDots() {
    for (var i = 0; i < blackCount; i++) {
        $(`.bc${turn}`).append(`<div class="black dot"></div>`);
    }
}

function appendWhiteDots() {
    for (var i = 0; i < whiteCount; i++) {
        $(`.wc${turn}`).append(`<div class="white dot"></div>`);
    }
}

function clearFeedback() {
    $('#feedbackContainer').html('');
}

function initializeEventListeners() {
    $('input').keyup(function() {
        if ($(this).val()) {
            $(this).next().focus();
        }
    });

    $('input').keyup(function(event) {
        if (event.keyCode == 8) {
            $(this).prev().focus();
        }
    });

    var inputs = $('input')
    
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('keyup', function() {
            if (!this.validity.valid || this.value == '') {
                this.value = '';
                this.setAttribute('class', 'noBueno');
            } else {
                this.setAttribute('class', 'muyBueno')
            }
            validateGuess();
        }, false);
    }
}

run();