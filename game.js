const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let level = 1;
let tileSize = 40;
let player = { x: 1, y: 1 };
let parts = [];
let robots = [];
let collected = 0;
let fixed = 0;
let totalRobots = 0;
let maze = [];

function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1)
  );

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      maze[y][x] = Math.random() > 0.2 ? 0 : 1; // 0 = open, 1 = wall
    }
  }

  maze[1][1] = 0;
  return maze;
}

function placeEntities() {
  parts = [];
  robots = [];
  let count = level + 2;

  for (let i = 0; i < count; i++) {
    let part, robot;
    do {
      part = { x: rand(2, 18), y: rand(2, 13) };
    } while (maze[part.y][part.x] === 1);
    do {
      robot = { x: rand(2, 18), y: rand(2, 13), fixed: false };
    } while (maze[robot.y][robot.x] === 1 || (robot.x === part.x && robot.y === part.y));

    parts.push(part);
    robots.push(robot);
  }

  collected = 0;
  fixed = 0;
  totalRobots = count;
  updateUI();
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 1) {
        ctx.fillStyle = '#555';
        ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
  }

  for (let part of parts) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(part.x * tileSize + 20, part.y * tileSize + 20, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  for (let robot of robots) {
    ctx.fillStyle = robot.fixed ? 'green' : 'red';
    ctx.fillRect(robot.x * tileSize + 10, robot.y * tileSize + 10, 20, 20);
  }

  ctx.fillStyle = 'cyan';
  ctx.fillRect(player.x * tileSize + 5, player.y * tileSize + 5, 30, 30);
}

function move(direction) {
  let dx = 0, dy = 0;
  if (direction === 'left') dx = -1;
  if (direction === 'right') dx = 1;
  if (direction === 'up') dy = -1;
  if (direction === 'down') dy = 1;

  let newX = player.x + dx;
  let newY = player.y + dy;

  if (maze[newY][newX] === 0) {
    player.x = newX;
    player.y = newY;
    checkCollisions();
    draw();
  }
}

function checkCollisions() {
  // Pick up parts
  parts = parts.filter(part => {
    if (part.x === player.x && part.y === player.y) {
      collected++;
      updateUI();
      return false;
    }
    return true;
  });

  // Fix robots
  for (let robot of robots) {
    if (!robot.fixed && robot.x === player.x && robot.y === player.y && collected > 0) {
      robot.fixed = true;
      fixed++;
      collected--;
      updateUI();
    }
  }

  if (fixed === totalRobots) {
    setTimeout(() => {
      level++;
      startLevel();
    }, 500);
  }
}

function updateUI() {
  document.getElementById('level').innerText = level;
  document.getElementById('parts').innerText = collected;
  document.getElementById('fixed').innerText = fixed;
  document.getElementById('total').innerText = totalRobots;
}

function startLevel() {
  maze = generateMaze(20, 15);
  player = { x: 1, y: 1 };
  placeEntities();
  draw();
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') move('left');
  if (e.key === 'ArrowRight') move('right');
  if (e.key === 'ArrowUp') move('up');
  if (e.key === 'ArrowDown') move('down');
});

startLevel();
