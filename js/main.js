const createRandomDirection = () => {
  const directions = [-1, 1];
  return directions[Math.floor(Math.random() * directions.length)];
};

const createPaddle = (width, height, x, y) => ({
  width,
  height,
  x,
  y,
  velocity: 0,
});

const createBall = (width, height, x, y, speed) => ({
  width,
  height,
  x,
  y,
  speed,
  directionX: createRandomDirection(),
  directionY: createRandomDirection(),
});

const initializeKeys = () => {
  return {
    w: false,
    s: false,
    i: false,
    k: false,
  };
};

const handleInput = (event, keys) => {
  switch (event.key) {
    case "w":
      keys.w = event.type === "keydown";
      break;
    case "s":
      keys.s = event.type === "keydown";
      break;
    case "i":
      keys.i = event.type === "keydown";
      break;
    case "k":
      keys.k = event.type === "keydown";
      break;
  }
};

const handleInputUpdate = (paddleOne, paddleTwo, keys) => {
  if (keys.w) {
    paddleOne.velocity = -800;
  } else if (keys.s) {
    paddleOne.velocity = 800;
  } else {
    paddleOne.velocity = 0;
  }

  if (keys.i) {
    paddleTwo.velocity = -800;
  } else if (keys.k) {
    paddleTwo.velocity = 800;
  } else {
    paddleTwo.velocity = 0;
  }
};

const updatePaddlePosition = (paddle, canvasHeight, deltaTime) => {
  paddle.y = Math.min(
    Math.max(paddle.y + paddle.velocity * deltaTime, 0),
    canvasHeight - paddle.height
  );
};

const resetBallPosition = (ball, canvas) => {
  ball.x = (canvas.width - ball.width) / 2;
  ball.y = (canvas.height - ball.height) / 2;
  ball.directionX = createRandomDirection();
  ball.directionY = createRandomDirection();
};

const updateBall = (ball, canvas, paddleOne, paddleTwo, score, deltaTime) => {
  ball.x += ball.speed * ball.directionX * deltaTime;
  ball.y += ball.speed * ball.directionY * deltaTime;

  handleWallCollision(ball);
  handlePaddleCollision(ball, paddleOne);
  handlePaddleCollision(ball, paddleTwo);

  if (ball.x <= 0) {
    score.playerTwo += 1;
    resetBallPosition(ball, canvas);
  } else if (ball.x + ball.width >= canvas.width) {
    score.playerOne += 1;
    resetBallPosition(ball, canvas);
  }
};

const handleWallCollision = (ball) => {
  if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
    ball.directionY *= -1;
    ball.y = Math.max(0, Math.min(canvas.height - ball.height, ball.y));
  }
};

const handlePaddleCollision = (ball, paddle) => {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x + ball.width > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y + ball.height > paddle.y
  ) {
    if (ball.directionX > 0 ? ball.x < paddle.x : ball.x > paddle.x) {
      ball.directionX *= -1;
    }
  }
};

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const render = (canvas, paddleOne, paddleTwo, ball, score) => {
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#FFFFFF";

  ctx.fillRect(paddleOne.x, paddleOne.y, paddleOne.width, paddleOne.height);
  ctx.fillRect(paddleTwo.x, paddleTwo.y, paddleTwo.width, paddleTwo.height);

  ctx.font = "1.875rem Arial";
  const middleX = canvas.width / 2;
  const yOffset = 50;

  ctx.fillText(score.playerOne, middleX - 50, yOffset);
  ctx.fillText(score.playerTwo, middleX + 50, yOffset);

  ctx.beginPath();
  ctx.arc(
    ball.x + ball.width / 2,
    ball.y + ball.height / 2,
    ball.width / 2,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.closePath();
};

const mainLoop = (
  canvas,
  paddleOne,
  paddleTwo,
  ball,
  keys,
  score,
  lastTimestamp
) => {
  const currentTimestamp = performance.now();
  const deltaTime = (currentTimestamp - lastTimestamp) / 1000;

  handleInputUpdate(paddleOne, paddleTwo, keys);

  updatePaddlePosition(paddleOne, canvas.height, deltaTime);
  updatePaddlePosition(paddleTwo, canvas.height, deltaTime);
  updateBall(ball, canvas, paddleOne, paddleTwo, score, deltaTime);

  render(canvas, paddleOne, paddleTwo, ball, score);

  requestAnimationFrame(() =>
    mainLoop(canvas, paddleOne, paddleTwo, ball, keys, score, currentTimestamp)
  );
};

const initialize = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("id", "canvas");
  canvas.width = 1024;
  canvas.height = 768;
  document.body.append(canvas);

  const paddleWidth = 15;
  const paddleHeight = 100;

  const paddleOne = createPaddle(
    paddleWidth,
    paddleHeight,
    10,
    (canvas.height - paddleHeight) / 2
  );

  const paddleTwo = createPaddle(
    paddleWidth,
    paddleHeight,
    canvas.width - paddleWidth - 10,
    (canvas.height - paddleHeight) / 2
  );

  const ball = createBall(
    15,
    15,
    (canvas.width - 15) / 2,
    (canvas.height - 15) / 2,
    600
  );

  const score = { playerOne: 0, playerTwo: 0 };

  const keys = initializeKeys();

  document.addEventListener("keydown", (event) => handleInput(event, keys));
  document.addEventListener("keyup", (event) => handleInput(event, keys));

  mainLoop(canvas, paddleOne, paddleTwo, ball, keys, score, performance.now());
};

initialize();
