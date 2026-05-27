const cells =
document.querySelectorAll(".cell");

const statusText =
document.querySelector(".status");

const restartBtn =
document.querySelector(".restartBtn");

const popup =
document.querySelector(".popup");

const winnerText =
document.getElementById("winnerText");

const closePopup =
document.getElementById("closePopup");

const twoPlayerBtn =
document.getElementById("twoPlayerBtn");

const aiBtn =
document.getElementById("aiBtn");

const winLine =
document.getElementById("winLine");

let aiMode = false;

twoPlayerBtn.classList.add("active-mode");

let currentPlayer = "X";

let gameRunning = true;

let gameState =
["", "", "", "", "", "", "", "", ""];

const winningConditions = [

    [0,1,2],
    [3,4,5],
    [6,7,8],

    [0,3,6],
    [1,4,7],
    [2,5,8],

    [0,4,8],
    [2,4,6]
];

cells.forEach(cell => {

    cell.addEventListener(
    "click",
    cellClicked
    );
});

restartBtn.addEventListener(
"click",
restartGame
);

closePopup.addEventListener(
"click",
restartGame
);

twoPlayerBtn.addEventListener(
"click",
() => {

    aiMode = false;

    twoPlayerBtn.classList.add(
    "active-mode"
    );

    aiBtn.classList.remove(
    "active-mode"
    );

    restartGame();
});

aiBtn.addEventListener(
"click",
() => {

    aiMode = true;

    aiBtn.classList.add(
    "active-mode"
    );

    twoPlayerBtn.classList.remove(
    "active-mode"
    );

    restartGame();
});

function cellClicked(){

    const cellIndex =
    this.getAttribute("data-index");

    if(
    gameState[cellIndex] !== ""
    ||
    !gameRunning
    ){
        return;
    }

    updateCell(
    this,
    cellIndex
    );

    checkWinner();

    if(
    gameRunning
    &&
    aiMode
    &&
    currentPlayer === "O"
    ){
        aiMove();
    }
}

function updateCell(cell,index){

    gameState[index] =
    currentPlayer;

    cell.textContent =
    currentPlayer;
}

function changePlayer(){

    currentPlayer =
    currentPlayer === "X"
    ?
    "O"
    :
    "X";

    statusText.textContent =
    `Player ${currentPlayer}'s Turn`;
}

function checkWinner(){

    let roundWon = false;

    let winningCombo = [];

    let winningIndex = -1;

    for(let i=0;
        i<winningConditions.length;
        i++){

        const condition =
        winningConditions[i];

        const a =
        gameState[condition[0]];

        const b =
        gameState[condition[1]];

        const c =
        gameState[condition[2]];

        if(
        a === ""
        ||
        b === ""
        ||
        c === ""
        ){
            continue;
        }

        if(a === b && b === c){

            roundWon = true;

            winningCombo =
            condition;

            winningIndex = i;

            break;
        }
    }

    if(roundWon){

        winningCombo.forEach(index => {

            cells[index].classList.add(
            "winning-cell"
            );
        });

        showWinLine(winningIndex);

        statusText.textContent =
        `Player ${currentPlayer} Wins!`;

        showPopup(
        `Player ${currentPlayer} Wins!`
        );

        confetti({
            particleCount:200,
            spread:100
        });

        gameRunning = false;

        return;
    }

    if(!gameState.includes("")){

        statusText.textContent =
        "Game Draw!";

        showPopup(
        "Game Draw!"
        );

        gameRunning = false;

        return;
    }

    changePlayer();
}

function showWinLine(index){

    const positions = [

        {
            top:"17%",
            left:"5%",
            width:"90%",
            transform:"rotate(0deg)"
        },

        {
            top:"50%",
            left:"5%",
            width:"90%",
            transform:"rotate(0deg)"
        },

        {
            top:"83%",
            left:"5%",
            width:"90%",
            transform:"rotate(0deg)"
        },

        {
            top:"50%",
            left:"-28%",
            width:"90%",
            transform:"rotate(90deg)"
        },

        {
            top:"50%",
            left:"5%",
            width:"90%",
            transform:"rotate(90deg)"
        },

        {
            top:"50%",
            left:"38%",
            width:"90%",
            transform:"rotate(90deg)"
        },

        {
            top:"50%",
            left:"5%",
            width:"125%",
            transform:"rotate(45deg)"
        },

        {
            top:"50%",
            left:"5%",
            width:"125%",
            transform:"rotate(-45deg)"
        }
    ];

    const pos =
    positions[index];

    winLine.style.top =
    pos.top;

    winLine.style.left =
    pos.left;

    winLine.style.width =
    pos.width;

    winLine.style.transform =
    pos.transform;

    winLine.classList.add("show");
}

function aiMove(){

    if(!gameRunning){
        return;
    }

    let emptyCells = [];

    gameState.forEach(
    (cell,index) => {

        if(cell === ""){
            emptyCells.push(index);
        }
    });

    if(emptyCells.length === 0){
        return;
    }

    const randomIndex =
    emptyCells[
    Math.floor(
    Math.random()
    *
    emptyCells.length
    )
    ];

    gameRunning = false;

    setTimeout(() => {

        gameState[randomIndex] = "O";

        cells[randomIndex].textContent = "O";

        currentPlayer = "O";

        gameRunning = true;

        checkWinner();

    },500);
}

function showPopup(message){

    popup.classList.remove(
    "hidden"
    );

    winnerText.textContent =
    message;
}

function restartGame(){

    currentPlayer = "X";

    gameRunning = true;

    gameState =
    ["", "", "", "", "", "", "", "", ""];

    statusText.textContent =
    `Player ${currentPlayer}'s Turn`;

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
        "winning-cell"
        );
    });

    popup.classList.add("hidden");

    winLine.style.width = "0";

    winLine.classList.remove("show");
}