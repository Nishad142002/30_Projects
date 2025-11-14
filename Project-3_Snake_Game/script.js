const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const restartGameModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const mobileUp = document.querySelector("#up");
const mobileRight = document.querySelector("#right");
const mobileLeft = document.querySelector("#left");
const mobileDown = document.querySelector("#down");

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);

const blocks = [];

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00:00`;

highScoreElement.innerHTML = highScore;

let snake = [
  { x: 1, y: 5 },
  { x: 1, y: 4 },
  { x: 1, y: 3 },
];

let intervalId = null;
let timerIntervalId = null;
let direction = "right";

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null;

  blocks[`${food.x}-${food.y}`].classList.add("food");

  // Direction Logic
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  // Wall Colusion Logic
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);

    modal.style.display = "flex";
    startGameModal.style.display = "none";
    restartGameModal.style.display = "flex";
    return;
  }

  //Body Colusin Logic
  snake.forEach((segment) => {
    if (head.x == segment.x && head.y == segment.y) {
      clearInterval(intervalId);

      modal.style.display = "flex";
      startGameModal.style.display = "none";
      restartGameModal.style.display = "flex";
      return;
    }
  });

  // Food Consume Logic
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");

    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };

    snake.forEach((segment) => {
      if (segment.x == food.x && segment.y == food.y) {
        food = {
          x: Math.floor(Math.random() * rows),
          y: Math.floor(Math.random() * cols),
        };
      }
    });

    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);

    score += 1;
    scoreElement.innerHTML = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
    }
  }

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  snake.unshift(head);
  snake.pop();

  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

// Start Button Logic
startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split(":").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${min}:${sec}`;
    timeElement.innerHTML = time;
  }, 1000);
});

// Reastart Button Logic
restartButton.addEventListener("click", restartGame);

function restartGame() {
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });

  blocks[`${food.x}-${food.y}`].classList.remove("food");

  modal.style.display = "none";

  snake = [
    { x: 1, y: 5 },
    { x: 1, y: 4 },
    { x: 1, y: 3 },
  ];

  direction = "right";

  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  highScore = localStorage.getItem("highScore") || 0;
  time = `00:00`;
  score = 0;
  scoreElement.innerHTML = score;
  highScoreElement.innerHTML = highScore;
  timeElement.innerHTML = time;

  intervalId = setInterval(() => {
    render();
  }, 300);
}

// Snake Controll logic
addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  }
});

mobileUp.addEventListener("click", () => {
  direction = "up";
});

mobileRight.addEventListener("click", () => {
  direction = "right";
});

mobileLeft.addEventListener("click", () => {
  direction = "left";
});

mobileDown.addEventListener("click", () => {
  direction = "down";
});
