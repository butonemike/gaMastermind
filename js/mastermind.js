// don't forget to add the number to the color in the feedback rows
var secretCodeLength, digitRange, secretCode, userGuess, whiteCount, blackCount, turn, validGuesses;

function run() {

    secretCodeLength = 4;
    digitRange = 4;

    for (var i = 1; i < 10; i++) {
        $('#chooseSecretCodeLength').append(`<option value="${i}">${i}</option>`);
        $('#chooseDigitRange').append(`<option value="${i}">${i}</option>`);
        // var selected = (i == codeLength) ? "selected" : "";
    }

    initializeGame();
}
// var codeCap = $('#codeLength').val();

// 2. error handling for invalid inputs (e.g. blank fields or non numeric characters)

// don't do post colelction validation. validate each individual input in real time; feedback via css: color boxes red and disable submit button until guess is valid

function initializeGame() {
    var validGuesses =  /^[1-4]+$/;
    generateSecretCode();
    console.log('sc ' + secretCode);
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

    return secretCode;
}

function generateInputFields() {    
    $('#inputContainer').html('');

    for (var i = 1; i <= secretCodeLength; i++) {
        $('#inputContainer').append(`<input id="input${i}" type="text" minlength="1" maxlength="1" pattern="[1-${digitRange}]" max="${digitRange}" class="userInput">`);
    }
}

function appendSecretCode() {
    $('#secretCodeContainer').html('');

    for (var i = 0; i < secretCodeLength; i++) {
        $('#secretCodeContainer').append('<div class="mysteryPeg">?</div>');
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
    console.log(userGuess)
    console.log(userGuess.length)
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
    // add button listeners

    $('#submitGuess').attr('disabled','disabled');
    $('#submitGuess').click(handleSubmit);
    $('#resetGame').click(handleReset);

    // advance pointer to next input field once current field has been populated

    $('.userInput').keyup(function() {
        if ($(this).val()) {
            $(this).next().focus();
        }
    });

    // move pointer to previous input field when 'delete' is pressed in current field

    $('.userInput').keyup(function(event) {
        // if () {
            if (event.keyCode == 8) {
                $(this).prev().focus();
            }
        // }
    });

    // add 'submit' functionality to 'enter' key

    $('.userInput').keyup(function(event) {
        if (event.keyCode == 13) {
            handleSubmit();
        }
    });

    // add css feedback for input validation: box with invalid entry turns red upon entry and is autocleared on refocus

    var inputs = $('.userInput')
    
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('focus', function() {
            if (!this.validity.valid) {
                this.value = '';
            }
        }, false);
    }
    
    $('input').keyup(function() {
        var validInput = false;
        validGuesses = /^[1-4]+$/
        $('input').each(function() {
            if (validGuesses.test($(this).val())) {
                validInput = true;
            } else {
                validInput = false;
            }
        });

        if (validInput) {
            $('#submitGuess').removeAttr('disabled');
        }
    });
}



// function validateUserInput() {
//     var validGuesses =  /^[1-4]+$/;
    
//     for (var i = 0; i < userGuess.length; i++) {
//         if (!validGuesses.test(userGuess[i])) {
//             console.log('oy, whats all this then?!')
//             return false;
//         }
//     }
// }

function validateUserInputTemp() {

}

run();