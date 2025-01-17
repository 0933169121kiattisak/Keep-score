const scoreEl = document.getElementById("score");
const timeEL = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const messageOver = document.getElementById("message");
const levelProgress = document.getElementById("levelProgress");
const level = document.getElementById("level");

let score = 0;
let timeLeft = 0;
let gameInterval;
let moveInterval;
let target;
let isPlaying = false;
let currentLevel = 1;
let targetClicked = 0;

const levelConfig = {
  1: { size: 30, speed: 0, targetsNeeded: 5 },
  2: { size: 40, speed: 1000, targetsNeeded: 8 },
  3: { size: 30, speed: 800, targetsNeeded: 10 },
  4: { size: 25, speed: 600, targetsNeeded: 12 },
  5: { size: 20, speed: 400, targetsNeeded: 15 },
};

const updateLevelProgress = () => {
  const config = levelConfig[currentLevel];
  const progress = (targetClicked / config.targetsNeeded) * 100;
  levelProgress.style.width = `${progress}%`;
};

const moveTarget = () => {
  if (!target || !isPlaying) return;

  const maxX = window.innerWidth - levelConfig[currentLevel].size;
  const maxY = window.innerHeight - levelConfig[currentLevel].size;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  target.style.left = randomX + "px";
  target.style.top = randomY + "px";
};

const createTarget = () => {
  if (target) target.remove();

  target = document.createElement("div");
  target.classList.add("target");

  const config = levelConfig[currentLevel];
  target.style.width = config.size + "px";
  target.style.height = config.size + "px";

  const maxX = window.innerWidth - 50;
  const maxY = window.innerHeight - 50;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  target.style.left = `${randomX}px`;
  target.style.top = `${randomY}px`;

  target.onclick = () => {
    if (!isPlaying) return;
    score++;
    targetClicked++;
    scoreEl.textContent = score;
    updateLevelProgress();
    createTarget();

    if(targetClicked >= config.targetsNeeded){
        levelUp();
    } else {
        createTarget();
    }
  }; 

  document.body.appendChild(target);
};

const levelUp = () => {
    if(currentLevel < 5){
        currentLevel++;
        targetClicked = 0;
        level.textContent = currentLevel;
        updateLevelProgress();

        if(moveInterval) clearInterval(moveInterval);

        if(levelConfig[currentLevel].speed > 0){
            moveInterval = setInterval(moveTarget, levelConfig[currentLevel].speed)
        }
        createTarget();

    } else {
        endGame();
    }
}

const startGame = () => {
  score = 0;
  timeLeft = 30;
  isPlaying = true;
  currentLevel = 1;
  targetClicked = 0;
  scoreEl.textContent = score;
  timeEL.textContent = timeLeft;
  level.textContent = currentLevel;

  createTarget();

  gameInterval = setInterval(() => {
    console.log("Time left:", timeLeft);
    timeLeft--;

    timeEL.textContent = `${timeLeft}s`;

    if (timeLeft < 15) {
      timeEL.style.color = "red";
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  if (levelConfig[currentLevel].speed > 0) {
    moveInterval = setInterval(moveTarget, levelConfig[currentLevel].speed);
    }
};

const resetGame = () => {
  isPlaying = true;
  clearInterval(gameInterval);
  if (target) target.remove();
  score = 0;
  timeLeft = 30;
  currentLevel = 1;
  targetClicked = 0;
  level.textContent = currentLevel;
  scoreEl.textContent = score;
  timeEL.style.color = "white";
  timeEL.textContent = `${timeLeft}s`;
  messageOver.textContent = "";
};

const endGame = () => {
  isPlaying = false;
  clearInterval(gameInterval);
  if(moveInterval) clearInterval(moveInterval);

  if (target) target.remove();
  messageOver.textContent = `Game Over! Your score: ${score}`;
};

resetBtn.addEventListener("click", resetGame);
startBtn.addEventListener("click", startGame);
