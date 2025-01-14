const scoreEl = document.getElementById("score")
const timeEL = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const messageOver = document.getElementById("message");

let score = 0;
let timeLeft = 0;
let gameInterval;
let target;
let isPlaying = false;

const createTarget = () => {
    if(target) target.remove();

    target = document.createElement("div");
    target.classList.add("target");

    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    target.style.left = `${randomX}px`;    
    target.style.top = `${randomY}px`;

    target.onclick = () => {
        if (!isPlaying) return;
        score++;
        scoreEl.textContent = score;
        createTarget();
    }

    document.body.appendChild(target)
}

const startGame = () => {
    score = 0;
    timeLeft = 30;
    isPlaying = true;
    scoreEl.textContent = score;
    timeEL.textContent = timeLeft;

    createTarget()

    gameInterval = setInterval(() => {
        console.log("Time left:", timeLeft);
        timeLeft--;

        timeEL.textContent = `${timeLeft}s`;

        if(timeLeft < 15){
            timeEL.style.color = "red";
        }

        if(timeLeft <= 0){
            endGame();
        }
    },1000)
}

const resetGame = () => {
    isPlaying = true;
    clearInterval(gameInterval);
    if(target) target.remove();
    score = 0;
    timeLeft = 30;
    scoreEl.textContent = score;
    timeEL.style.color = "white";
    timeEL.textContent = `${timeLeft}s`;
    messageOver.textContent = "";
}

const endGame = () => {
    isPlaying = false;
    clearInterval(gameInterval);
    
    if(target) target.remove();
    messageOver.textContent = (`Game Over! Your score: ${score}`);
}

resetBtn.addEventListener("click",resetGame)
startBtn.addEventListener("click",startGame)