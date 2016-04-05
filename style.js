// declare global variables

var ballX = 400;							// ball starting X axis position
var ballY = 300;							// ball starting Y axis position

var ballSpeedX;								// ball speed X axis as determined by user selection
var ballSpeedY = ballSpeedX - 5;			// ball speed Y axis

var leftPaddleY = 100;						// left paddle Y axis starting position
var rightPaddleY = 100;						// right paddle Y axis starting position
var paddleHeight = 100						// paddle height
var paddleThickness = 10;					// paddle thickness

var playerScore = 0;						// player score
var computerScore = 0;						// computer score
var winningScore = 5;						// winning score
var showWinningScreen = false;				// show winner screen when winning score is reached
var fps = 20;								// frames per second for ball animations and canvas renderings


// get DOM elements
var ballSpeedNormal = document.getElementById('normal');
var ballSpeedFast = document.getElementById('fast');
var ballSpeedFaster = document.getElementById('faster');
var ballSpeedReallyFast = document.getElementById('reallyfast');
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = 'black';
ctx.fillRect(0,0, canvas.width, canvas.height);

ctx.fillStyle ='white';
ctx.fillText('CHOOSE A SPEED =>', canvas.width-200, 80);
ctx.fillText('CLICK to START GAME', canvas.width-200, 90);


// set ball speed based on user selection
function getBallSpeed(){
	
	if(ballSpeedNormal.checked){
		
		ballSpeedX = ballSpeedNormal.value;
		ballReset();
		
	} else if(ballSpeedFast.checked){
		
		ballSpeedX = ballSpeedFast.value;
		ballReset();
		
	} else if(ballSpeedFaster.checked){
		
		ballSpeedX = ballSpeedFaster.value;
		ballReset();
		
	} else if(ballSpeedReallyFast.checked){
		
		ballSpeedX = ballSpeedReallyFast.value;
		ballReset();
		
	}
}

getBallSpeed();

// refresh renderings every 20ms
setInterval(function(){
	
	if(!showWinningScreen){
		ballAnimate();			
	}

	drawObjects();
}, fps);


// user paddle controller based on cursor Y position
canvas.addEventListener('mousemove', function(e){
	var mousePos = calculateMousePos(e);
	leftPaddleY = mousePos.y - (paddleHeight/2);

})

// when winner decided, reset scores and wait for click event to start new game
canvas.addEventListener('click', function(){
	
	playerScore = 0;
	computerScore = 0;
	showWinningScreen = false;
})


// draw all canvas objects
function drawObjects(){
	
	// Check to see if game has eneded
	if(showWinningScreen){
		
		ctx.fillStyle = 'white';
		
		if(playerScore >= winningScore){
			centreline('grey');
			centreCircle(100, 'grey');
			centreDot(10, 'yellow');
			
			showWinner("Player Wins", 320, 450, 'white');
			scoreDisplay('Player Score: ', playerScore, 100, 20, 'black');
			scoreDisplay('Computer Score: ', computerScore, canvas.width - 200, 20, 'black');

		} else if (computerScore >= winningScore){
			centreline('grey');
			centreCircle(100, 'grey');
			centreDot(10, 'grey');
			
			showWinner('Computer Wins', 300, 450, 'white');
			scoreDisplay('Player Score: ', playerScore, 100, 20, 'black');
			scoreDisplay('Computer Score: ', computerScore, canvas.width - 200, 20, 'black');
		}

		// Display action to start new game
		ctx.font = '15px sans-serif';
		ctx.fillStyle = 'white'
		ctx.fillText("click to continue", 350, 510);
		return ;
	}


	computerPaddle();

	// fill canvas bg
	ctx.fillStyle = 'black';
	// fillRect(xPos, yPos, width, height)
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// draw left paddle
	drawPaddle(0, leftPaddleY, paddleThickness, paddleHeight, 'white');

	//draw right paddle
	drawPaddle(canvas.width-paddleThickness, rightPaddleY, paddleThickness, paddleHeight, 'white');
	

	//draw centreline
	centreline('white');

	//draw centreCircle
	centreCircle(100, 'white');

	//draw centre dot
	centreDot(10, 'white');

	// draw scores
	scoreDisplay('Player Score: ', playerScore, 100, 20, 'white');
	scoreDisplay('Computer Score: ', computerScore, canvas.width - 200, 20, 'white');

	// draw ball
	drawBall(ballX, ballY, 10, 'white');
	
}


//draw paddle
function drawPaddle(xPos, yPos, paddleWidth, paddleHeight, color){

	ctx.fillStyle = color;
	ctx.fillRect(xPos, yPos, paddleWidth, paddleHeight);
}

// draw scores
function scoreDisplay(text, scoreInput, xPos, yPos, color){

	ctx.fillStyle = color;
	ctx.font = '10px sans-serif';
	ctx.fillText(text + scoreInput, xPos, yPos);

}

// show winner
function showWinner(text, xPos, yPos, color){

		ctx.fillStyle = color;
		ctx.font = '30px Arial';
		ctx.fillText(text, xPos, yPos);
}

// draw ball
function drawBall(xPos, yPos, radius, color){

	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(xPos, yPos, radius, 0, Math.PI *2);
	ctx.fill();
}


// ballAnimate will animate every 20ms as set in setInterval line 70
function ballAnimate(){

	ballX = ballX + ballSpeedX;	
	ballY = ballY + ballSpeedY;	
	var leftPaddleYBottom = leftPaddleY + paddleHeight;
	var rightPaddleYBottom = rightPaddleY + paddleHeight;


	//check to see if ball leaves left side of canvas
	if(ballX < paddleThickness){

		//check if ball hits left paddle
		if(ballY < leftPaddleYBottom && ballY > leftPaddleY){

			// determine ball deflection angle based on paddle contact area
			// further away the ball makes contact from midpoint of paddle, greater the angle deflection
			var delta = ballY - (leftPaddleY + (paddleHeight/2));
			ballSpeedX = -ballSpeedX;
			ballSpeedY = delta * 0.17;
			

		} else {
			
			computerScore++;
			ballReset();
		}
	}

	//check to see if ball leaves right side of canvas 
	if(ballX > canvas.width){

		//check if ball hits right paddle
		if(ballY < rightPaddleYBottom && ballY > rightPaddleY && ballX > canvas.width-paddleThickness){

			// determine ball deflection angle based on paddle contact area
			// further away the ball makes contact from midpoint of paddle, greater the angle deflection
			var delta = ballY - (rightPaddleY + (paddleHeight/2));
			ballSpeedX = -ballSpeedX;
			ballSpeedY = delta * 0.17;

		} else {

			playerScore++;	
			ballReset();

		}
	}	


	// bounce ball off bottom of canvas
	if(ballY >= canvas.height){

		ballSpeedY = -ballSpeedY;	
	
	}
	// bounce ball off top of canvas
	if(ballY <= 0){
		
		ballSpeedY = -ballSpeedY;	

	}
}


function ballReset(){

	if(playerScore >= winningScore || computerScore >= winningScore){
		
		showWinningScreen = true;

			scoreDisplay('Player Score: ', playerScore, 100, 30, 'white');
			scoreDisplay('Computer Score: ', computerScore, canvas.width - 200, 30, 'white');
	}

	// draw scores
	ballX = 400;
	ballY = 300;
	ballSpeedX = -ballSpeedX;
	ballSpeedY = 0;
	rightPaddleY = 300;

};


function computerPaddle(){

	// rightPaddleY(yPos) + (paddleHeight(100)/2)
	var paddleMid = rightPaddleY + (paddleHeight/2);

	// Check if the AI paddle Y position (mid paddle) is less than the ball position
	// Move paddle 4px down if ball Y position is 35px below the middle of the paddle position
	if(paddleMid < ballY+35) {

		rightPaddleY += 4;

	// Check if the AI paddle Y position (mid-paddle) is greater than the ball position
	// Move paddle 4px up if ball Y position is 35px above the middle of the paddle position
	} else if(paddleMid > ballY-35){
	
		rightPaddleY -= 4;
	}
}


function centreline(color){

	for(var i = 10; i <= canvas.height; i+= 40){
		ctx.fillStyle = color;
		ctx.fillRect(canvas.width/2, i, 2, 20);
	
	}
}

function centreCircle(radius, color){

	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, radius, 0 , Math.PI *2);
	ctx.stroke();
}

function centreDot(radius, color){

	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, radius, 0 , Math.PI *2);
	ctx.fill();
}

function calculateMousePos(e){

	// Get the canvas location regardless of viewport size to find mouseX pos and mouseY pos

	// The Element.getBoundingClientRect() method returns the size 
	// of an element and its position relative to the viewport.
	// rect = { x: 8, y: 8, width: 800, height: 600, top: 8, right: 808, bottom: 608, left: 8 }

	var rect = canvas.getBoundingClientRect();

	// .documentElement returns the Document Element of the document (the <html> element)
	var htmlEl = document.documentElement;

	// The clientX property returns the horizontal coordinate (according to the client area) 
	// of the mouse pointer when a mouse event was triggered.
	// scrollLeft sets or returns the number of pixels an element's content scrolled horizontally
	var mouseX = e.clientX - rect.left - htmlEl.scrollLeft;

	// The clientY property returns the vertical coordinate (according to the client area) 
	// of the mouse pointer when a mouse event was triggered.		
	// scrollTop sets or returns the number of pixels an element's content scrolled vertically	
	var mouseY = e.clientY - rect.top - htmlEl.scrollTop;

	return {
		x: mouseX,
		y: mouseY
	}
}

