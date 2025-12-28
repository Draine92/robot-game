const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const partsCountEl = document.getElementById("partsCount");
const statusMessage = document.getElementById("statusMessage");

// ---------------- GAME STATE ----------------

const player = {
  x: 50,
  y: 50,
  size: 20,
  speed: 3,
  parts: 0
};

const part = {
  x: 300,
  y: 200,
  size: 14,
  collected: false
};

const brokenRobot = {
  x: 600,
  y: 350,
  size: 25,
  fixed: false,
  requiredParts: 1
};

const keys = {};

// ---------------- INPUT ----------------

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// ---------------- GAME LOOP ----------------

function update() {
  movePlayer();
  checkCollisions();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawPart();
  drawBrokenRobot();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ---------------- LOGIC ----------------

function movePlayer() {
  if (keys["ArrowUp"] || keys["w"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += player.speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Keep inside canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function checkCollisions() {
  // Collect part
  if (!part.collected && isColliding(player, part)) {
    part.collected = true;
    player.parts += 1;
    partsCountEl.textContent = player.parts;
    statusMessage.textContent = "Picked up a robot part!";
  }

  // Fix robot
  if (!brokenRobot.fixed && isColliding(player, brokenRobot)) {
    if (player.parts >= brokenRobot.requiredParts) {
      brokenRobot.fixed = true;
      player.parts -= brokenRobot.requiredParts;
      partsCountEl.textContent = player.parts;
      statusMessage.textContent = "Robot repaired! 🤖✨";
    } else {
      statusMessage.textContent = "This robot needs a part!";
    }
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// ---------------- DRAWING ----------------

function drawPlayer() {
  ctx.fillStyle = "#4fc3f7";
  ctx.fillRect(player.x, player.y, player.size, player.size);
  ctx.fillStyle = "#fff";
  ctx.fillText("🚀", player.x - 2, player.y + 18);
}

function drawPart() {
  if (part.collected) return;
  ctx.fillStyle = "#ffeb3b";
  ctx.fillRect(part.x, part.y, part.size, part.size);
  ctx.fillText("🧩", part.x - 2, part.y + 14);
}

function drawBrokenRobot() {
  if (brokenRobot.fixed) {
    ctx.fillStyle = "#6cff6c";
    ctx.fillRect(brokenRobot.x, brokenRobot.y, brokenRobot.size, brokenRobot.size);
    ctx.fillText("🤖", brokenRobot.x - 4, brokenRobot.y + 22);
  } else {
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(brokenRobot.x, brokenRobot.y, brokenRobot.size, brokenRobot.size);
    ctx.fillText("⚡", brokenRobot.x, brokenRobot.y + 20);
  }
}

// ---------------- START ----------------
gameLoop();
