var character = document.getElementById("character");
var game = document.getElementById("game");
var currentScoreElement = document.getElementById("currentScore");
var highestScoreElement = document.getElementById("highestScore");
var timerElement = document.getElementById("timer");

var interval;
var both = 0;
var counter = 0;
var currentBlocks = [];
var score = 0;
var highestScore = localStorage.getItem("highScore") || 0;
var seconds = 0;
var timerInterval;

// Update highest score display
highestScoreElement.textContent = `High Score: ${highestScore}`;

// Timer logic
function startTimer() {
    seconds = 0;
    timerInterval = setInterval(() => {
        seconds++;
        timerElement.textContent = `Time: ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

// Character movement
function moveLeft() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left > 0) {
        character.style.left = left - 2 + "px";
    }
}

function moveRight() {
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if (left < 380) {
        character.style.left = left + 2 + "px";
    }
}

document.addEventListener("keydown", event => {
    if (both == 0) {
        both++;
        if (event.key === "ArrowLeft") {
            interval = setInterval(moveLeft, 1);
        }
        if (event.key === "ArrowRight") {
            interval = setInterval(moveRight, 1);
        }
    }
});

document.addEventListener("keyup", () => {
    clearInterval(interval);
    both = 0;
});

// Block and hole logic
var blocks = setInterval(function () {
    var blockLast = document.getElementById("block" + (counter - 1));
    var holeLast = document.getElementById("hole" + (counter - 1));

    if (counter > 0) {
        var blockLastTop = parseInt(window.getComputedStyle(blockLast).getPropertyValue("top"));
        var holeLastTop = parseInt(window.getComputedStyle(holeLast).getPropertyValue("top"));
    }

    if (blockLastTop < 400 || counter == 0) {
        var block = document.createElement("div");
        var hole = document.createElement("div");
        block.setAttribute("class", "block");
        hole.setAttribute("class", "hole");
        block.setAttribute("id", "block" + counter);
        hole.setAttribute("id", "hole" + counter);
        block.style.top = (blockLastTop || 0) + 100 + "px";
        hole.style.top = (holeLastTop || 0) + 100 + "px";

        var random = Math.floor(Math.random() * 360);
        hole.style.left = random + "px";
        game.appendChild(block);
        game.appendChild(hole);
        currentBlocks.push(counter);
        counter++;
    }

    var characterTop = parseInt(window.getComputedStyle(character).getPropertyValue("top"));
    var characterLeft = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    var drop = 0;

    if (characterTop <= 0) {
        alert(`Game over! Score: ${score}. Time: ${seconds}s`);
        clearInterval(blocks);
        stopTimer();
        location.reload();
    }

    for (var i = 0; i < currentBlocks.length; i++) {
        let current = currentBlocks[i];
        let iblock = document.getElementById("block" + current);
        let ihole = document.getElementById("hole" + current);
        let iblockTop = parseFloat(window.getComputedStyle(iblock).getPropertyValue("top"));
        let iholeLeft = parseFloat(window.getComputedStyle(ihole).getPropertyValue("left"));

        iblock.style.top = iblockTop - 0.5 + "px";
        ihole.style.top = iblockTop - 0.5 + "px";

        if (iblockTop < -20) {
            currentBlocks.shift();
            iblock.remove();
            ihole.remove();
            score++;
            currentScoreElement.textContent = `Score: ${score}`;

            // Update high score if beaten
            if (score > highestScore) {
                highestScore = score;
                highestScoreElement.textContent = `High Score: ${highestScore}`;
                localStorage.setItem("highScore", highestScore);
            }
        }

        if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
            drop++;
            if (iholeLeft <= characterLeft && iholeLeft + 40 >= characterLeft) {
                drop = 0;
            }
        }
    }

    if (drop == 0) {
        if (characterTop < 480) {
            character.style.top = characterTop + 2 + "px";
        }
    } else {
        character.style.top = characterTop - 0.5 + "px";
    }
}, 1);

// Start the game timer
startTimer();
