// Background Autoplay
document.querySelector(".video-bg").playbackRate = 3

// Audio Autoplay
document.addEventListener('DOMContentLoaded', function () {
    var audio = document.getElementById('audio');
    document.addEventListener('click', function () {
        audio.play();
    });
});
document.addEventListener('DOMContentLoaded', () => {    

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const displayScore = document.querySelector('.score p span')
    const displayHighScore = document.querySelector('.highscore p span')
    const displayLignes = document.querySelector('.lignes p span')
    const displayLevel = document.querySelector('.level p span')
    const startBtn = document.querySelector('.startBtn')
    const icon = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let score = 0
    var lignes = 0
    var level = 1
    let timerId
    let highScore

if(window.localStorage.getItem("HighScore")) {
    storedHighScore = window.localStorage.getItem("HighScore")
    highScore = storedHighScore
    displayHighScore.innerHTML = highScore
}
//Couleurs pour chaque piéce
const colors = [
    'var(--red)',
    'var(--blue)',
    'var(--green)',
    'var(--orange)',
    'var(--pink)',
    'var(--purple)',
    'var(--skyblue)'

]
    //The Tetraminoes
const jTetramino = [
    [1, width + 1, width * 2, width * 2 + 1],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
    [1, 2, width + 1, width * 2+ 1],
    [width, width + 1, width + 2, width * 2 + 2]
]

const lTetramino = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [0, 1, 2, width]
]

const sTetramino = [
    [1, 2, width, width + 1],
    [0, width, width + 1, width * 2 + 1],
    [1, 2, width , width + 1],
    [0, width, width + 1, width * 2 + 1] 
]

const zTetramino = [
    [0,  1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [0, 1, width + 1, width + 2],
    [2, width + 1, width + 2, width * 2 + 1]
]

const tTetramino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]  
]

const oTetramino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const iTetramino = [
    [0, width, width * 2, width * 3],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

//Création de l'array de Tetraminos
const theTetraminoes = [jTetramino, lTetramino, sTetramino, zTetramino, tTetramino, oTetramino, iTetramino]


let currentPosition = 4
let currentRotation = 0

//Random select a Tetramino 
let random = Math.floor(Math.random() * theTetraminoes.length)
let current = theTetraminoes[random][currentRotation]

//Draw the tetramino on the board
function draw() {
    if(gameIsOver) return
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetramino')
        squares[currentPosition + index].style.background = colors[random]
    })
}

//Undraw the Tetramino from the board
function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetramino')
        squares[currentPosition + index].style.background = ''
    })
}

//Assign function to the arrow keys
function controls(e) {
    if(e.keyCode === 37) {
        // console.log("left")
        moveLeft()
    } else if (e.keyCode === 38 || e.keyCode === 32) {
        rotate()
    } else if(e.keyCode === 39) {
        // console.log("right")
        moveRight()
    } else if(e.keyCode === 40) {
        moveDown()
    }
    //  else if(e.keyCode === 32) {
    //     dropDown()
    // }
}

//eventListener pour declancher la function controls
document.addEventListener('keydown', controls)

//Move the Tetramino down every second
function moveDown() {
    if(pause) return
    if(gameIsOver) return
    undraw()
    currentPosition+=width
    draw()
    // setTimeout(freeze, 150);
    freeze()
}


//Freeze the Tetramino
function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        
        //start a new tetramino
        random = nextRandom
        nextRandom = Math.floor(Math.random()*theTetraminoes.length)
        current = theTetraminoes[random][currentRotation]
        currentPosition = 4
        addScore()
        levelUp()
        displayNext()
        draw()
        gameOver()
    }
}


//Move the Tetramino left unless it's occupied
function moveLeft() {
    if(pause) return
    if(gameIsOver) return
    undraw()
    const isAtLeftEgde = current.some(index => (currentPosition + index) % width === 0)
    
    if(!isAtLeftEgde) {
        currentPosition-=1
    }
    if(current.some(index =>squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }
    draw()
}

//Move the Tetramino Right unless it's occupied
function moveRight() {
    if(pause) return
    if(gameIsOver) return
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)

    if(!isAtRightEdge) {
        currentPosition += 1
    }

    if(current.some(index =>squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition-=1
    }
    draw()
}


//Rotate the Tetramino
    //FIX ROTATION OF TETROMINOS A THE EDGE 
    function isAtRight() {
        return current.some(index=> (currentPosition + index + 1) % width === 0)  
      }
      
      function isAtLeft() {
        return current.some(index=> (currentPosition + index) % width === 0)
      }
      
      function checkRotatedPosition(P){
        P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
        if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
          if (isAtRight()){            //use actual position to check if it's flipped over to right side
            currentPosition += 1    //if so, add one to wrap it back around
            checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
            }
        }
        else if (P % width > 5) {
          if (isAtLeft()){
            currentPosition -= 1
          checkRotatedPosition(P)
          }
        }
      }
      
      //rotate the tetromino
      function rotate() {
        if(pause) return
        if(gameIsOver) return
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { //if the current rotation gets to 4, make it go back to 0
          currentRotation = 0
        }
        current = theTetraminoes[random][currentRotation]
        checkRotatedPosition()
        draw()
      }


//Next Tetramino display
const displayWidth = 4
let displayIndex = 0


const upNextTetraminoes = [
    [1, displayWidth + 1, displayWidth * 2, displayWidth * 2 + 1], // jTetramino
    [1, displayWidth + 1,  displayWidth * 2 + 1, displayWidth * 2 + 2 ], // lTetramino
    [1, 2, displayWidth, displayWidth + 1], // sTetramino
    [0,  1, displayWidth + 1, displayWidth + 2], //zTetramino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetramino
    [0, 1, displayWidth, displayWidth + 1], //oTetramino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1]   
]
const next = document.querySelectorAll('.next div')

function displayNext() {
    next.forEach(square => {
        square.classList.remove('tetramino')
        square.style.background = ''
    })
    upNextTetraminoes[nextRandom].forEach(index => {
        next[displayIndex + index].classList.add('tetramino')
        next[displayIndex + index].style.background = colors[nextRandom]
    })
}


var pause = false
//Start/Pause button
startBtn.addEventListener('click', () => {
    //Restart
    if(gameIsOver) {
        restart()
        gameIsOver = false
    } else if(timerId) {
        //Mise en pause
        clearInterval(timerId)
        timerId = null
        icon.classList.remove('fa-circle-pause')
        icon.classList.add('fa-circle-play')
        pause = true
    } else {
        //Mise en marche
        score = 0
        level = 1
        lignes = 0
        draw()
        timerId = setInterval(moveDown, Math.max(150, 500 - (level - 1) * 50))
        // nextRandom = Math.floor(Math.random() * theTetraminoes.length)
        icon.classList.remove('fa-circle-play')
        icon.classList.add('fa-circle-pause')
        pause = false

        displayScore.innerHTML = score
        displayLevel.innerHTML = level
        displayLignes.innerHTML = lignes
        displayNext()
    }
})

//Remove rows and add score
function addScore() {
    for(let i = 0; i < 199; i +=width) {
        const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score+=10
            displayScore.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetramino')
                squares[index].style.background = ''
                
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
            lignes+=1
            displayLignes.innerHTML = lignes
        }
    }
    highScore = 0
    if(score > highScore) {
        highScore = score
    } 
    displayHighScore.innerHTML = highScore
    window.localStorage.setItem("HighScore", highScore)    
}


//Level up
let leveledUp = 0
function levelUp() {
    if (lignes > 0 && lignes % 10 === 0 && leveledUp < lignes / 10) {
        //Passer de niveau
        level += 1
        leveledUp+=1

        //Définir un nouveau timing pour la function moveDown()
        const newInterval = Math.max(150, 500 - (level - 1) * 50)
        
        //Annuler le delay actuel
        clearInterval(timerId)
        
        //Nouveau delai
        timerId = setInterval(moveDown, newInterval)
        console.log(newInterval)

        displayLevel.innerHTML = level
    }
}


//Game over
let gameIsOver = false
function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        displayScore.innerHTML = "Game Over! " + score
        clearInterval(timerId)
        gameIsOver = true
        icon.classList.remove('fa-circle-pause')
        icon.classList.add('fa-circle-play')
    }
}


//Reset grid and Restart game
function restart() {
    if (!gameIsOver) return

    clearInterval(timerId);
    level = 1
    lignes = 0
    score = 0

    for(let i = 0; i <= 199; i++){
        squares[i].classList.remove('tetramino')
        squares[i].classList.remove('taken')
        squares[i].style.background = ''
    }
        
    draw()
    timerId = setInterval(moveDown, Math.max(150, 500 - (level - 1) * 50))
    nextRandom = Math.floor(Math.random() * theTetraminoes.length)
    icon.classList.remove('fa-circle-play')
    icon.classList.add('fa-circle-pause')
    pause = false
    displayNext()
}
})