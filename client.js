// Create a WebSocket connection to the server
const socket = new WebSocket('ws://192.168.1.101:3000'); // Replace with your server's address

// Get references to HTML elements
const canvas = document.getElementById('gameCanvas');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatOutput = document.getElementById('chatOutput');

// Set up the canvas for drawing
const ctx = canvas.getContext('2d');
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let player1Score = 0;
let player2Score = 0;
const paddleSpeed = 5;
let player1SpeedY = 0;
let player2SpeedY = 0;
// Add event listener for the chat input and send button
sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== '') {
        sendMessage(message);
    }
});

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const message = chatInput.value;
        if (message.trim() !== '') {
            sendMessage(message);
        }
    }
});

// Send a chat message to the server
function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        chatInput.value = '';
    }
}

// Handle messages from the server
socket.addEventListener('message', (event) => {
    const message = event.data;
    displayChatMessage(message);
});

// Display a chat message on the screen
function displayChatMessage(message) {
    chatOutput.innerHTML += `<p>${message}</p>`;
}

// Game loop
function gameLoop() {
    movePaddles();
    moveBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}
function movePaddles() {
    // Move player 1 paddle
    if (player1SpeedY !== 0) {
        player1Y += player1SpeedY;
        if (player1Y < 0) {
            player1Y = 0;
        } else if (player1Y + paddleHeight > canvas.height) {
            player1Y = canvas.height - paddleHeight;
        }
    }

    // Move player 2 paddle (if it's a two-player game)
    // Uncomment the following lines if you want a two-player game
     if (player2SpeedY !== 0) {
         player2Y += player2SpeedY;
         if (player2Y < 0) {
             player2Y = 0;
         } else if (player2Y + paddleHeight > canvas.height) {
             player2Y = canvas.height - paddleHeight;
         }
     }
}

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top wall
    if (ballY < 0 && ballSpeedY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with bottom wall
    if (ballY > canvas.height && ballSpeedY > 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles (player 1)
    if (ballX < paddleWidth && ballSpeedX < 0 && ballY > player1Y && ballY < player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball collision with paddles (player 2)
    // Uncomment the following lines if you want a two-player game
    if (ballX > canvas.width - paddleWidth && ballSpeedX > 0 && ballY > player2Y && ballY < player2Y + paddleHeight) {
         ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds (player 1)
    if (ballX < 0) {
        // Player 2 scores a point
        player2Score++;
        resetBall();
    }

    // Ball out of bounds (player 2)
    if (ballX > canvas.width) {
        // Player 1 scores a point
        player1Score++;
        resetBall();
    }
}

function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Uncomment for two-player game

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.font = '24px Arial';
    ctx.fillText(`Player 1: ${player1Score}`, 20, 30);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 180, 30); // Uncomment for two-player game
}

// Function to reset the ball's position
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5; // You can adjust the initial ball speed here
}

// Handle paddle movement using arrow keys (player 1)
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        player1SpeedY = -paddleSpeed;
    } else if (event.key === 'ArrowDown') {
        player1SpeedY = paddleSpeed;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        player1SpeedY = 0;
    }
});

// Handle paddle movement using W and S keys (player 2)
//Uncomment the following lines for two-player game
document.addEventListener('keydown', (event) => {
     if (event.key === 'w') {
         player2SpeedY = -paddleSpeed;
     } else if (event.key === 's') {
         player2SpeedY = paddleSpeed;
     }
 });

 document.addEventListener('keyup', (event) => {
     if (event.key === 'w' || event.key === 's') {
         player2SpeedY = 0;
     }
    })
gameLoop();
