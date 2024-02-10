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

let keys = {
  w: false,
  s: false,
  i: false,
  k: false,
};

const handleInput = (event) => {
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

const handleInputUpdate = (paddleOne, paddleTwo) => {
  if (keys.w) {
    paddleOne.velocity = -5;
  } else if (keys.s) {
    paddleOne.velocity = 5;
  } else {
    paddleOne.velocity = 0;
  }

  if (keys.i) {
    paddleTwo.velocity = -5;
  } else if (keys.k) {
    paddleTwo.velocity = 5;
  } else {
    paddleTwo.velocity = 0;
  }
};

const updatePaddlePosition = (paddle, canvasHeight) => {
  paddle.y = Math.min(
    Math.max(paddle.y + paddle.velocity, 0),
    canvasHeight - paddle.height
  );
};

const updateBall = (ball, canvas, paddleOne, paddleTwo) => {
  ball.x += ball.speed * ball.directionX;
  ball.y += ball.speed * ball.directionY;

  if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
    ball.directionY *= -1;
  }

  if (
    (ball.x <= paddleOne.x + paddleOne.width &&
      ball.x + ball.width >= paddleOne.x &&
      ball.y + ball.height >= paddleOne.y &&
      ball.y <= paddleOne.y + paddleOne.height) ||
    (ball.x + ball.width >= paddleTwo.x &&
      ball.x <= paddleTwo.x + paddleTwo.width &&
      ball.y + ball.height >= paddleTwo.y &&
      ball.y <= paddleTwo.y + paddleTwo.height)
  ) {
    ball.directionX *= -1;
  }

  if (ball.x <= 0 || ball.x + ball.width >= canvas.width) {
    ball.x = (canvas.width - ball.width) / 2;
    ball.y = (canvas.height - ball.height) / 2;
    ball.directionX = createRandomDirection();
    ball.directionY = createRandomDirection();
  }
};

const clearScreen = (ctx) => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const render = (canvas, paddleOne, paddleTwo, ball) => {
  const ctx = canvas.getContext("2d");
  clearScreen(ctx);
  ctx.fillStyle = "white";

  ctx.fillRect(paddleOne.x, paddleOne.y, paddleOne.width, paddleOne.height);
  ctx.fillRect(paddleTwo.x, paddleTwo.y, paddleTwo.width, paddleTwo.height);

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

const gameLoop = (canvas, paddleOne, paddleTwo, ball) => {
  const loop = () => {
    handleInputUpdate(paddleOne, paddleTwo);

    updatePaddlePosition(paddleOne, canvas.height);
    updatePaddlePosition(paddleTwo, canvas.height);

    updateBall(ball, canvas, paddleOne, paddleTwo);
    render(canvas, paddleOne, paddleTwo, ball);

    requestAnimationFrame(loop);
  };

  document.addEventListener("keydown", (event) =>
    handleInput(event, paddleOne, paddleTwo)
  );
  document.addEventListener("keyup", (event) =>
    handleInput(event, paddleOne, paddleTwo)
  );

  loop();
};

const initializeGame = () => {
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

  const ballSpeed = 4;
  const ball = createBall(
    15,
    15,
    (canvas.width - 15) / 2,
    (canvas.height - 15) / 2,
    ballSpeed
  );

  gameLoop(canvas, paddleOne, paddleTwo, ball);
};

initializeGame();
