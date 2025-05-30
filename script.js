const gameContainer = document.getElementById("gameContainer");
const block = document.getElementById("block");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("gameOver");

let gravity = 2;
let isJumping = true;
let velocity = 0;
let score = 0;
let gameRunning = true;

// Load sound effects
const jumpSound = new Audio("jump.wav");
const scoreSound = new Audio("score.wav");
const gameOverSound = new Audio("gameover.wav");

function jump() {
  if (!gameRunning) return;
  velocity = -25;
  jumpSound.currentTime = 0;
  jumpSound.play();
}

document.body.addEventListener("keydown", (e) => {
  if (e.code === "Space") jump();
});

document.body.addEventListener("touchstart", jump);

function createPipe() {
  const gap = 250;
  const minHeight = 50;
  const maxHeight = 300;
  const topHeight = minHeight + Math.random() * (maxHeight - minHeight);
  const bottomHeight = 600 - topHeight - gap;

  const topPipe = document.createElement("div");
  const bottomPipe = document.createElement("div");

  topPipe.classList.add("pipe");
  bottomPipe.classList.add("pipe");

  topPipe.style.height = `${topHeight}px`;
  topPipe.style.top = `0px`;
  bottomPipe.style.height = `${bottomHeight}px`;
  bottomPipe.style.bottom = `0px`;

  topPipe.style.left = bottomPipe.style.left = "400px";

  gameContainer.appendChild(topPipe);
  gameContainer.appendChild(bottomPipe);

  movePipe(topPipe, bottomPipe);
}

function movePipe(topPipe, bottomPipe) {
  let pipeLeft = 400;

  const pipeInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(pipeInterval);
      return;
    }

    pipeLeft -= 4;
    topPipe.style.left = bottomPipe.style.left = `${pipeLeft}px`;

    const blockTop = parseInt(block.style.top);
    const blockBottom = blockTop + 40;

    const topPipeHeight = parseInt(topPipe.style.height);
    const bottomPipeTop = 600 - parseInt(bottomPipe.style.height);

    if (
      pipeLeft < 120 &&
      pipeLeft + 60 > 80 &&
      (blockTop < topPipeHeight || blockBottom > bottomPipeTop)
    ) {
      endGame();
    }

    if (pipeLeft + 60 < 0) {
      clearInterval(pipeInterval);
      topPipe.remove();
      bottomPipe.remove();
      if (gameRunning) {
        score++;
        scoreSound.currentTime = 0;
        scoreSound.play();
      }
      scoreDisplay.innerText = "Score: " + score;
    }
  }, 20);
}

function gameLoop() {
  if (!gameRunning) return;

  velocity += gravity;
  let blockTop = parseInt(block.style.top);
  blockTop += velocity;

  if (blockTop < 0) blockTop = 0;
  if (blockTop + 40 > 600) {
    blockTop = 560;
    endGame();
  }

  block.style.top = `${blockTop}px`;

  requestAnimationFrame(gameLoop);
}

function pipeGenerator() {
  if (!gameRunning) return;
  createPipe();
  setTimeout(pipeGenerator, 1500);
}

function endGame() {
  gameRunning = false;
  gameOverDiv.style.display = "block";
  gameOverSound.currentTime = 0;
  gameOverSound.play();
}

function restartGame() {
  location.reload();
}

block.style.top = "200px";
pipeGenerator();
gameLoop();
