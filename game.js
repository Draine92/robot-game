const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Settings
const tileSize = 40;
const cols = canvas.width / tileSize;
const rows = canvas.height / tileSize;

// Game state
let player = { x: 1, y: 1 };
let brokenRobots = [{ x: 18, y: 13 }];
let parts = [{ x: 10, y: 5 }];
let maze = [];

// Generate maze: 0 = path, 1 = wall
function generateMaze() {
  maze = [];
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      if (
        x === 0 || y === 0 || x === cols - 1 || y === rows - 1 || 
        Math.random() < 0.1
      ) {
        row.push(1); // wall
      } else {
        row.push(0); // open path
      }
    }
    maze.push(row);
  }

  // Ensure path to robot
  maze[player.y][player.x] = 0;
  brokenRobots.forEach(r => maze[r.y][r.x] = 0);
  parts.forEach(p => maze[p.y][p.x] = 0);
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw maze
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) drawTile(x, y, "#444");
    }
  }

  // Draw parts
  parts.forEach(p => drawTile(p.x, p.y, "yellow"));

  // Draw broken robots
  brokenRobots.forEach(r => drawTile(r.x, r.y, "red"));

  // Draw player
  drawTile(player.x, player.y, "cyan");
}

function move(dx, dy) {
  let newX = player.x + dx;
  let newY = player.y + dy;

  if (
    newX >= 0 && newX < cols &&
    newY >= 0 && newY < rows &&
    maze[newY][newX] === 0
  ) {
    player.x = newX;
    player.y = newY;

    // Check part pickup
    for (let i = 0; i < parts.length; i++) {
      if (parts[i].x === player.x && parts[i].y === player.y) {
        parts.splice(i, 1);
        break;
      }
    }

    // Check robot repair
    for (let i = 0; i < brokenRobots.length; i++) {
      if (brokenRobots[i].x === player.x && brokenRobots[i].y === player.y) {
        if (parts.length === 0) {
          brokenRobots.splice(i, 1);
          if (brokenRobots.length === 0) nextLevel();
        }
        break;
      }
    }
  }

  drawGame();
}

function nextLevel() {
  alert("Level Complete! Starting next...");
  player = { x: 1, y: 1 };
  parts.push({ x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) });
  brokenRobots.push({ x: cols - 2, y: rows - 2 });
  generateMaze();
  drawGame();
}

// Keyboard input
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move(0, -1);
  if (e.key === "ArrowDown") move(0, 1);
  if (e.key === "ArrowLeft") move(-1, 0);
  if (e.key === "ArrowRight") move(1, 0);
});

// Touch controls
document.getElementById("upBtn").addEventListener("click", () => move(0, -1));
document.getElementById("downBtn").addEventListener("click", () => move(0, 1));
document.getElementById("leftBtn").addEventListener("click", () => move(-1, 0));
document.getElementById("rightBtn").addEventListener("click", () => move(1, 0));

generateMaze();
drawGame();
