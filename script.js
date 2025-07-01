const size = 20;
let map = [], inventory = [], floor = 1;
let player = { x: 1, y: 1, hp: 3 };
let enemies = [];
let itemsMap = {};
let stair = { x: 18, y: 18 };

function generateMap() {
  map = [];
  itemsMap = {};
  enemies = [];

  for (let y = 0; y < size; y++) {
    map[y] = [];
    for (let x = 0; x < size; x++) {
      const isWall = x === 0 || y === 0 || x === size - 1 || y === size - 1 || (Math.random() < 0.2 && !(x === 1 && y === 1));
      map[y][x] = isWall ? 'wall' : 'floor';
    }
  }

  // Place items
  for (let i = 0; i < 3; i++) {
    let x = rand(1, size - 2), y = rand(1, size - 2);
    itemsMap[`${x},${y}`] = i % 2 === 0 ? "potion" : "sword";
    map[y][x] = 'item';
  }

  // Place enemies (increasing with floor)
  for (let i = 0; i < floor + 1; i++) {
    let x = rand(2, size - 3), y = rand(2, size - 3);
    enemies.push({ x, y });
    map[y][x] = 'enemy';
  }

  // Place stair
  stair = { x: rand(5, size - 5), y: rand(5, size - 5) };
  map[stair.y][stair.x] = 'stair';

  // Place player
  player.x = 1; player.y = 1;
  map[player.y][player.x] = 'player';
}

function draw() {
  const game = document.getElementById('game');
  game.innerHTML = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cell = document.createElement('div');
      cell.className = `cell ${map[y][x]}`;
      game.appendChild(cell);
    }
  }
  document.getElementById('items').textContent =
    `Floor: ${floor} | HP: ${player.hp} | ` + (inventory.length ? inventory.join(", ") : "Empty");
}

function move(dx, dy) {
  const newX = player.x + dx;
  const newY = player.y + dy;
  const dest = map[newY][newX];
  if (dest === 'wall') return;

  if (dest === 'enemy') {
    if (inventory.includes("sword")) {
      enemies = enemies.filter(e => !(e.x === newX && e.y === newY));
      map[newY][newX] = 'floor';
    } else {
      alert("You were defeated by an enemy!");
      location.reload();
      return;
    }
  }

  if (dest === 'item') {
    const key = `${newX},${newY}`;
    const found = itemsMap[key];
    if (found) inventory.push(found);
    delete itemsMap[key];
  }

  if (dest === 'stair') {
    floor++;
    generateMap();
    draw();
    return;
  }

  map[player.y][player.x] = 'floor';
  player.x = newX;
  player.y = newY;
  map[player.y][player.x] = 'player';
  draw();
}

function useItem() {
  const idx = inventory.indexOf("potion");
  if (idx !== -1) {
    inventory.splice(idx, 1);
    player.hp = Math.min(player.hp + 1, 5);
    draw();
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('keydown', e => {
  if (e.key === 'w') move(0, -1);
  if (e.key === 's') move(0, 1);
  if (e.key === 'a') move(-1, 0);
  if (e.key === 'd') move(1, 0);
  if (e.key === 'i') useItem();
});

generateMap();
draw();
