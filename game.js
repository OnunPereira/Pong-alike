var canvas = document.getElementById("gameCanvas");
var canvasContext = canvas.getContext('2d');

const WINNING_SCORE = 3;

var showRoundScreen = false;
var showWinScreen = false;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const PADDLE_DISTANCE = 5;

var ball = {
    x: 50,
    y: 50,
    speedX: 10,
    speedY: 4,
    radius: 10,
    draw() {
        colorCircle(this.x, this.y, this.radius, 'white');
    }
}

var player1 = {
    score: 0,
    paddle: {
        x: PADDLE_DISTANCE,
        y: 250,
        draw() {
            colorRect(this.x, this.y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
        }
    }
}

var player2 = {
    score: 0,
    paddle: {
        x: canvas.width - PADDLE_DISTANCE - PADDLE_THICKNESS,
        y: 250,
        draw() {
            colorRect(this.x, this.y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
        }
    }
}

window.onload = function() {

    const FPS = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/FPS);

    canvas.addEventListener('mousedown', handleMouseClick);

    window.addEventListener('mousemove', function(evt) {
        var mousePos = calculateMousePos(evt);
        player1.paddle.y = mousePos.y - PADDLE_HEIGHT/2;
    });
}

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function handleMouseClick(evt) {
    if (showWinScreen) {
        player1.score = 0;
        player2.score = 0;
        showWinScreen = false;
    } else if (showRoundScreen) { 
        showRoundScreen = false;
    }
}

function ballReset() {
    if (player1.score >= WINNING_SCORE ||
        player2.score >= WINNING_SCORE) {
            showWinScreen = true;
    } else {
        showRoundScreen = true;
    }
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speedX = -ball.speedX;
}

function computerMovement() {

    var paddle2YCenter = player2.paddle.y + (PADDLE_HEIGHT/2); 
    if (paddle2YCenter < ball.y - 35) {
        player2.paddle.y += 6;
    } else if (paddle2YCenter > ball.y + 35) {
        player2.paddle.y -= 6;
    }
}

function moveEverything() {

    if (showWinScreen || showRoundScreen) {
        return;
    }

    computerMovement();

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Reflecting ball on player1's paddle
    if (ball.x < PADDLE_DISTANCE + PADDLE_THICKNESS + ball.radius &&
        ball.y > player1.paddle.y &&
        ball.y < player1.paddle.y + PADDLE_HEIGHT) {

            ball.speedX = -ball.speedX;

            var deltaY = ball.y - (player1.paddle.y + PADDLE_HEIGHT/2);
            ball.speedY = deltaY /3;
    }

    // Reflecting ball on player2's paddle
    if (ball.x > canvas.width - (PADDLE_DISTANCE + PADDLE_THICKNESS + ball.radius) &&
        ball.y > player2.paddle.y &&
        ball.y < player2.paddle.y + PADDLE_HEIGHT) {

            ball.speedX = -ball.speedX;

            var deltaY = ball.y - (player2.paddle.y + PADDLE_HEIGHT/2);
            ball.speedY = deltaY /3;
    }

    if (ball.x < ball.radius) {
        player2.score++;
        ballReset();
    }
    if (ball.x > canvas.width - ball.radius) {
        player1.score++;
        ballReset();
    }
    if (ball.y <= ball.radius) {
        ball.speedY = -ball.speedY;
    }
    if (ball.y > canvas.height - ball.radius) {
        ball.speedY = -ball.speedY;
    }
}

function drawNet() {
    for (var i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width/2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {

    // This is black canvas
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showWinScreen) {

        canvasContext.fillStyle = 'white';

        if (player1.score >= WINNING_SCORE) {
            canvasContext.fillText("Left player won the game!", 350, 200);
        } else if (player2.score >= WINNING_SCORE) {
            canvasContext.fillText("Right player won the game!", 350, 200);
        }
        canvasContext.fillText("Click to restart", 350, 500);
        return;

    } else if (showRoundScreen) {

        canvasContext.fillStyle = 'white';
        canvasContext.fillText("Click to continue", 350, 500);
        return;
    }

    // Draw dashed line
    drawNet();
    // Draw player paddle
    player1.paddle.draw();
    // Draw cpu paddle
    player2.paddle.draw();
    // Draw ball
    ball.draw();

    canvasContext.fillText(player1.score, 100, 100);
    canvasContext.fillText(player2.score, canvas.width - 100, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}
