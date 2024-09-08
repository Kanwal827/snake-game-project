// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Variables
const box = 20; // Size of each block (20x20)
const canvasSize = 400; // Canvas size (400x400)
let snake = [{x: 200, y: 200}]; // Snake initial position
let direction = {x: 0, y: 0}; // Direction of the snake (starts at rest)
let food = getRandomFoodPosition();
let score = 0;
let snakeSpeed = 100; // Default speed (100ms)

// Get elements for settings
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const closeModal = document.getElementById('closeModal');
const speedControl = document.getElementById('speedControl');

// Control snake direction
document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === "ArrowUp" && direction.y === 0) {
        direction = {x: 0, y: -box};
    } else if (event.key === "ArrowDown" && direction.y === 0) {
        direction = {x: 0, y: box};
    } else if (event.key === "ArrowLeft" && direction.x === 0) {
        direction = {x: -box, y: 0};
    } else if (event.key === "ArrowRight" && direction.x === 0) {
        direction = {x: box, y: 0};
    }
}

// Game loop
function gameLoop() {
    if (isGameOver()) {
        alert("Game Over! Final Score: " + score);
        resetGame();
    } else {
        moveSnake();
        if (hasEatenFood()) {
            score += 10;
            document.getElementById('score').innerText = score;
            food = getRandomFoodPosition();
        } else {
            snake.pop(); // Remove the tail unless eating food
        }
        drawEverything();
    }
}

// Move the snake
function moveSnake() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};
    snake.unshift(head); // Add new head
}

// Check if the snake has eaten the food
function hasEatenFood() {
    return snake[0].x === food.x && snake[0].y === food.y;
}

// Check for game over
function isGameOver() {
    // Check if snake hits the wall
    if (snake[0].x < 0 || snake[0].x >= canvasSize || snake[0].y < 0 || snake[0].y >= canvasSize) {
        return true;
    }

    // Check if snake hits itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

// Reset the game after a game over
function resetGame() {
    snake = [{x: 200, y: 200}];
    direction = {x: 0, y: 0};
    score = 0;
    document.getElementById('score').innerText = score;
}

// Draw everything on the canvas
function drawEverything() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#61dafb' : 'white'; // Head in different color
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = '#ff6347'; // Tomato color for food
    ctx.fillRect(food.x, food.y, box, box);
}

// Get random food position
function getRandomFoodPosition() {
    const randomX = Math.floor(Math.random() * (canvasSize / box)) * box;
    const randomY = Math.floor(Math.random() * (canvasSize / box)) * box;
    return {x: randomX, y: randomY};
}

// Start the game loop with customizable speed
let gameInterval = setInterval(gameLoop, snakeSpeed);

// Open the settings modal
settingsButton.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
});

// Close the settings modal
closeModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
});

// Change the snake speed
speedControl.addEventListener('change', (event) => {
    snakeSpeed = parseInt(event.target.value);
    clearInterval(gameInterval); // Stop the current game loop
    gameInterval = setInterval(gameLoop, snakeSpeed); // Start a new game loop with updated speed
});

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === settingsModal) {
        settingsModal.style.display = 'none';
    }
};
