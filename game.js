const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
  x: 50,
  y: 50,
  size: 40,
  color: 'cyan'
};

// Prevent iPad zooming/double-tap
document.addEventListener('touchstart', function(e) {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });

let lastTouch = 0;
document.addEventListener('touchend', function(e) {
  const now = new Date().getTime();
  if (now - lastTouch <= 300) e.preventDefault();
  lastTouch = now;
}, false);

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateGame() {
  clearCanvas();
  drawPlayer();
}

function movePlayer(dx, dy) {
  player.x += dx;
  player.y += dy;
  updateGame();
}

// Arrow key support
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer(0, -10);
  if (e.key === 'ArrowDown') movePlayer(0, 10);
  if (e.key === 'ArrowLeft') movePlayer(-10, 0);
  if (e.key === 'ArrowRight') movePlayer(10, 0);
});

// Button support for tablets
document.getElementById('upBtn').addEventListener('click', () => movePlayer(0, -10));
document.getElementById('downBtn').addEventListener('click', () => movePlayer(0, 10));
document.getElementById('leftBtn').addEventListener('click', () => movePlayer(-10, 0));
document.getElementById('rightBtn').addEventListener('click', () => movePlayer(10, 0));

updateGame();
