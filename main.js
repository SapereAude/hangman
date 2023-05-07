//Use "input()" to input a line from the user
// Use "input(str)" to print some text before requesting input
// You will need this in the following stages
const input = require('sync-input');
let wins = 0, loses = 0;
console.log("H A N G M A N");
menu();
// Play the game
function startGame() {
    let word = chooseWord();
    let maskedWord = maskWord(word);
    let attempts = 8;
    let userInputs = [];
    let correctInputs = [];
    let isGameOver = false;
    let currentInput = "";

    do {
        console.log(`\n${maskedWord}`);
        currentInput = getUserInput();
        if (isSingleLetter(currentInput).isValid) {
            console.log(isSingleLetter(currentInput).msg);
        } else if (!isLetterLowercase(currentInput).isValid) {
            console.log(isLetterLowercase(currentInput).msg);
        } else if (hasLetterBeenUsedBefore(currentInput, userInputs).isValid) {
            console.log(hasLetterBeenUsedBefore(currentInput).msg);
        } else if (!(isLetterInWord(currentInput, word).isMatch)) {
            console.log(isLetterInWord(currentInput, word).msg);
            userInputs = addPreviousUserInput(currentInput, userInputs);
            isGameOver = handleAttempts(attempts).isOutOfTurns;
            attempts = handleAttempts(attempts).attempts;
        } else {
            userInputs = addPreviousUserInput(currentInput, userInputs);
            maskedWord = revealLetter(currentInput, correctInputs, word, maskedWord);
            isGameOver = checkWin(maskedWord, word).isWin;
        }
    } while (!isGameOver);
    if (checkWin(maskedWord, word).isWin) {
        console.log(messages(word).win);
        wins += 1;
    } else {
        console.log(handleAttempts(attempts).msg);
        loses += 1;
    }
}
// messages used in the game
function messages(word) {
    return {
        singleLetter: "Please, input a single letter.",
        lowerCase: "Please, enter a lowercase letter from the English alphabet.",
        alreadyUsed: "You've already guessed this letter.",
        checkLetter: "That letter doesn't appear in the word.",
        attempts: "You lost!",
        win: `You guessed the word ${word}!\nYou survived!`,
        menu: `Type "play" to play the game, "results" to show the scoreboard, and "exit" to quit:`,
        results: `You won: ${wins} times.\nYou lost: ${loses} times.`
    }
}
// game menu
function menu() {
    let userChoice = input(messages().menu);
    //let userChoice = prompt(messages().menu);
    switch (userChoice) {
        case "play":
            startGame();
            menu();
            break;
        case "results":
            getResults();
            menu();
            break;
        case "exit":
            break;
        default:
            menu();
            break;
    }
}
// return scoreboard
function getResults() {
    return console.log(messages().results);
}
// assign a random hangman word and return it
function chooseWord() {
    let words = ["javascript", "swift", "java", "python"];
    let rand = Math.floor(Math.random() * words.length);
    return words[rand];
}
// mask the chosen hangman word
function maskWord(chosenWord) {
    return chosenWord.replaceAll(/./gi, "-");
}
// get user input
function getUserInput() {
    return input("Input a letter: ");
    //return prompt("Input a letter: ");
}
// check if input contains only one letter
function isSingleLetter(currentInput) {
    return {
        isValid: !(currentInput.length === 1),
        msg: messages().singleLetter
    };
}
// check if letter is lowercase
function isLetterLowercase(currentInput) {
    let regExp = /[a-z]/g;
    return {
        isValid: regExp.test(currentInput),
        msg: messages().lowerCase
    };

}
// Check if the letter has been used before
function hasLetterBeenUsedBefore(currentInput, userInputs) {
    return {
        isValid: userInputs ? userInputs.includes(currentInput) : true,
        msg: messages().alreadyUsed
    };
}
// add the letter to previous user inputs
function addPreviousUserInput(currentInput, userInputs) {
    userInputs.push(currentInput);
    return userInputs;

}
// Check if the letter is in the word
function isLetterInWord(currentInput, word) {
    return {
        isMatch: word.includes(currentInput),
        msg: messages().checkLetter
    }
}
// Handle the number of attempts
function handleAttempts(attempts) {
    return {
        attempts: attempts - 1,
        isOutOfTurns: attempts === 1,
        msg: messages().attempts
    }
}
// Reveal a letter from the word
function revealLetter(currentInput, correctInputs, word, maskedWord) {
    let RegEx, esc;
    correctInputs.push(currentInput);
    esc = "[^" + correctInputs.join("") + "]"
    RegEx = new RegExp(esc, "gi");
    maskedWord = word.replaceAll(RegEx, "-");
    return maskedWord;
}
// Returns true if the word has been guessed correctly
function checkWin(maskedWord, word) {
    return {
        isWin: maskedWord === word,
        msg: messages(word).win
    }
}
