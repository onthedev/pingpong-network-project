const socket = new WebSocket('ws://192.168.1.101:3000');

const canvas = document.getElementById('gameCanvas');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatOutput = document.getElementById('chatOutput');

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


function sendMessage(message) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
        chatInput.value = '';
    }
}

socket.addEventListener('message', (event) => {
    const message = event.data;
    displayChatMessage(message);
});

function displayChatMessage(message) {
    chatOutput.innerHTML += `<p>${message}</p>`;
}

function gameLoop() {
    movePaddles();
    moveBall();
    drawGame();
    requestAnimationFrame(gameLoop);
}
function movePaddles() {
    if (player1SpeedY !== 0) {
        player1Y += player1SpeedY;
        if (player1Y < 0) {
            player1Y = 0;
        } else if (player1Y + paddleHeight > canvas.height) {
            player1Y = canvas.height - paddleHeight;
        }
    }


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

    if (ballY < 0 && ballSpeedY < 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballY > canvas.height && ballSpeedY > 0) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX < paddleWidth && ballSpeedX < 0 && ballY > player1Y && ballY < player1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

  
    if (ballX > canvas.width - paddleWidth && ballSpeedX > 0 && ballY > player2Y && ballY < player2Y + paddleHeight) {
         ballSpeedX = -ballSpeedX;
    }

    if (ballX < 0) {
        player2Score++;
        resetBall();
    }

    if (ballX > canvas.width) {
        player1Score++;
        resetBall();
    }
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight); // Uncomment for two-player game

    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '24px Arial';
    ctx.fillText(`Player 1: ${player1Score}`, 20, 30);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 180, 30); // Uncomment for two-player game
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = 5; 
}

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
