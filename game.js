const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 100, y: 100, size: 40, speed: 10 };

// Sample game render
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // TODO: Draw maze, broken parts, bots
}

function movePlayer(dx, dy) {
  player.x += dx * player.speed;
  player.y += dy * player.speed;
  drawGame();
}

// Button events
document.getElementById("upBtn").addEventListener("click", () => movePlayer(0, -1));
document.getElementById("downBtn").addEventListener("click", () => movePlayer(0, 1));
document.getElementById("leftBtn").addEventListener("click", () => movePlayer(-1, 0));
document.getElementById("rightBtn").addEventListener("click", () => movePlayer(1, 0));

// Initial draw
drawGame();
