const startBtn = document.querySelector(".start span");
const userName = document.querySelector(".game-name span");
const controlDiv = document.querySelector(".start");

// Global variables
let letterContainer;
let drawE;
let wrongAtt = 0;
let randomValueV; 

startBtn.onclick = function () {
    let name = prompt("What's Your Name?");

    if (name === null || name === "") {
        window.alert("Please enter a name to start the game!");
    } else {
        userName.innerHTML = name;
        controlDiv.remove();
    }
};

// Function to reset the game
function resetGame(words) {
    // Clear guessed letters
    document.querySelector(".letters-guess").innerHTML = "";

    // Reset wrong attempts counter
    wrongAtt = 0;

    // Remove classes from draw elements
    for (let i = 1; i <= 8; i++) {
        drawE.classList.remove(`wrong-${i}`);
    }

    // Remove finished class from letter container
    letterContainer.classList.remove("finished");

    // Re-initialize the game with a new word
    initializeGame(words);
}

// Load the JSON file
fetch('words.json')
    .then(response => response.json())
    .then(data => {
        initializeGame(data);
    })
    .catch(error => console.error('Error loading words:', error));

function initializeGame(words) {
    //letters 
    const letters = "abcdefghijklmnopqrstuwxyz";

    //get array from letters
    let letterArr = Array.from(letters);

    //select letters container
    letterContainer = document.querySelector(".letters");
    letterContainer.innerHTML = ""; // Clear previous letters

    //generate letters 
    letterArr.forEach(letter => {
        //create span
        let span = document.createElement("span");

        //Letter text node 
        let theLetter = document.createTextNode(letter);

        span.appendChild(theLetter);

        span.className = "letter-box";

        letterContainer.appendChild(span);
    });

    //Random property
    let allKeys = Object.keys(words);

    let randomPropNum = Math.floor(Math.random() * allKeys.length);
    let randomProbName = allKeys[randomPropNum];
    let randomProbValue = words[randomProbName];

    let randomValueNum = Math.floor(Math.random() * randomProbValue.length);
    randomValueV = randomProbValue[randomValueNum]; // Assign to global variable

    //set cat info 
    document.querySelector(".game-info .category span").innerHTML = randomProbName;

    let lettersGuess = document.querySelector(".letters-guess");
    lettersGuess.innerHTML = ""; // Clear previous guesses

    //Convert chosen word to array
    let lettersAndSpace = Array.from(randomValueV);

    //create span depend on word
    lettersAndSpace.forEach(letter => {
        //create empty span
        let emptySpan = document.createElement("span");

        // if letter is space
        if (letter === " ") {
            emptySpan.className = "with-space";
        }

        //append span to the guess container
        lettersGuess.appendChild(emptySpan);
    });

    //draw elements 
    drawE = document.querySelector(".hangman-draw");

    // handle clicking on letters
    document.addEventListener("click", handleLetterClick);

    function handleLetterClick(e) {
        if (e.target.className === "letter-box") {
            e.target.classList.add("clicked");

            //get clicked letter
            let cL = e.target.innerHTML.toLowerCase();

            //the chosen word
            let theChosenWord = Array.from(randomValueV.toLowerCase());

            let gussspans = document.querySelectorAll(".letters-guess span");

            //set the chosen status
            let status = false;

            theChosenWord.forEach((wordLetter, index) => {
                if (cL === wordLetter) {
                    //set status to correct 
                    status = true;

                    gussspans.forEach((span, spanIndex) => {
                        if (index === spanIndex) {
                            span.innerHTML = cL;
                        }
                    });
                }
            });

            //if letter is wrong 
            if (status !== true) {
                //increased wrong attempts 
                wrongAtt++;

                //add class wrong on the draw element
                drawE.classList.add(`wrong-${wrongAtt}`);

                //play wrong sound
                document.getElementById("wrong").currentTime = 0;
                document.getElementById("wrong").play();

                if (wrongAtt === 8) {
                    endGame(words);
                    letterContainer.classList.add("finished");
                }
            } else {
                document.getElementById("correct").currentTime = 0;
                document.getElementById("correct").play();
                checkWin(words);
            }
        }
    }

    function endGame(words) {
        let div = document.createElement("div");
        let divText = document.createTextNode(`Game over! the word is ${randomValueV} :(`);
        div.appendChild(divText);
        div.className = "poped";

        // Create the button element
        let button = document.createElement("button");
        button.innerHTML = "Play Again";
        button.className = "play-again-btn";

        // Add an event listener to the button
        button.addEventListener("click", () => {
            // Reset the game state
            resetGame(words);
            // Remove the game over message
            div.remove();
        });

        // Append the button to the div
        div.appendChild(button);
        document.body.appendChild(div);
    }

    // Function to check if the word is guessed correctly
    function checkWin(words) {
        let guessedLetters = document.querySelectorAll(".letters-guess span");
        let allGuessed = true;

        guessedLetters.forEach((span, index) => {
            if (span.innerHTML === "" && lettersAndSpace[index] !== " ") {
                allGuessed = false;
            }
        });

        if (allGuessed) {
            let div = document.createElement("div");
            let divText = document.createTextNode(`Congratulations! You guessed the word: ${randomValueV} with ${wrongAtt} mistakes`);
            div.appendChild(divText);
            div.className = "poped";
            document.body.appendChild(div);

            // Create the button element
            let button = document.createElement("button");
            button.innerHTML = "Play Again";
            button.className = "play-again-btn";

            // Add an event listener to the button
            button.addEventListener("click", () => {
                // Reset the game state
                resetGame(words);
                // Remove the congratulations message
                div.remove();
            });

            // Append the button to the div
            div.appendChild(button);
            document.body.appendChild(div);

            // Disable further clicks on letters
            letterContainer.classList.add("finished");
        }
    }
}