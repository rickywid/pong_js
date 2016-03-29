var canvas;
var canvasContext;

//Ball 
var ballX = 400;			// set ball starting X position
var ballSpeedX = 15;		// set ball X speed 
var ballY = 300;				// set ball starting Y position
var ballSpeedY = 4;			// set ball Y speed 

//Paddle
var paddle1Y = 250;			// set paddle1 starting Y position (From middle point of paddle)
var paddle2Y = 250;			// set paddle2 starting Y position (From middle point of paddle)
var paddleThickness = 10;	// set paddle height
var paddleHeight = 100;		// set paddle height

// Player Scores
var player1Score = 0;
var player2Score = 0;
var winningScore = 1;
var showingWinScreen = false;




// execute once window loaded
window.onload = function() {

	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;

	// Create a setInterval for ball and paddle animation
	setInterval(function(){

		moveEverything();	
		drawEverything();

	}, 1000/framesPerSecond);


	canvas.addEventListener('mousedown', handleMouseClick);

	// update paddle1Y Y position
	canvas.addEventListener('mousemove', function(evt){

		var mousePos = calculateMousePos(evt);

		//Make cursor position to be aligned to the centre of the left paddle and use mouse Y coordinates as paddle1Y Y position
		paddle1Y = mousePos.y - (paddleHeight/2);
	})


	function computerMovement(){

		// Get the center position of the AI paddle
		// Make the center of the AI paddle follow the ball
		var paddle2YCenter = paddle2Y + (paddleHeight/2);

		// Check if the AI paddle Y position is less than the ball position
		// Reduce paddle stutter by stopping any paddle movement when ball Y position is 35px above the middle of the paddle position
		if(paddle2YCenter < ballY-35){
			
			paddle2Y += 6;

		} else if(paddle2YCenter > ballY+35){

			// Reduce paddle stutter by stopping any paddle movement when ball Y position is 35px below the middle of the paddle position
			paddle2Y -= 6;

		}
	}


	// execute every 300ms
	function moveEverything(){

		// Stop game from replaying if game has eneded
		if(showingWinScreen){
			return;
		}

		computerMovement();

		ballX = ballX + ballSpeedX;
		ballY = ballY + ballSpeedY;

		// Check to see if ball leaves right side of canvas
		if(ballX > canvas.width){

			// Check to see if ball contacts right  paddle
			if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight){

				var deltaY = ballY - (paddle2Y + (paddleHeight/2))
				ballSpeedY = deltaY * 0.35;


				ballSpeedX = -ballSpeedX; //-(-15)  Flip direction		

			} else {

				player2Score++;
				ballReset();
			}			
		}

		// Check to see if ball leaves left side of canvas
		if(ballX < 0){

			// check if ball hits left paddle
			// paddle1Y Y position is determined from the middle of the paddle as stated on line 29
			if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight){

				var deltaY = ballY - (paddle1Y+(paddleHeight/2));
				ballSpeedY = deltaY * 0.35;
				//console.log("ballY: " + ballY);
				//console.log("deltaY: " + deltaY);
				//console.log("paddle1yyy: " + paddle1Y);
				//console.log("ballspeedY: " + ballSpeedY);
				//console.log("-----------------");

				ballSpeedX = -ballSpeedX; 
			} else {

				// If ball does not contact paddle (leaves the left side of the canvas), reset ball & add update player score
				player1Score++;
				ballReset();
			}
		}

		// prevent ball from leaving top side of canvas
		if(ballY < 0){

			ballSpeedY = -ballSpeedY; 
		}

		// prevent ball from leaving bottom side of canvas
		if(ballY > canvas.height){
			ballSpeedY = -ballSpeedY; 
		}

	}


	// Draw Centerline 
	function drawNet() {
		for(var i = 10; i < canvas.width; i += 40) {
			colorRect(canvas.width/2-1, i, 2, 20, 'white');
		}
	}

	// Execute every 300ms
	function drawEverything(){
		
		// Cover canvas with black background color
		colorRect(0, 0, canvas.width, canvas.height, 'black');

		// Check to see if game has eneded
		if(showingWinScreen){
			
			canvasContext.fillStyle = 'white';
			
			if(player1Score >= winningScore){

				canvasContext.fillText("Player 1 Wins", 370, 310);

			} else if (player2Score >= winningScore){
				
				canvasContext.fillText("Player 2 Wins", 370, 410);	

			}

			// Display action to start new game
			canvasContext.fillText("click to continue", 365, 510);
			return ;
		}

		// Fill canvas color
		colorRect(0, 0, canvas.width, canvas.height, 'black');

		// Draw the center line
		drawNet();

		// Draw left paddle
		colorRect(0, paddle1Y, paddleThickness, 100, 'white');

		//draw right paddle
		colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, 100, 'white');

		// Draw ball
		drawCircle(ballX, ballY, 10, 'white');

		// Display Score  - context.fillText(text, xPos, yPos, maxWidth(optional));
		// If no fillStyle assigned, will inherit from currently set fill color
		canvasContext.fillText(player1Score, 100, 100);
		canvasContext.fillText(player2Score, canvas.width-150, 100);

	}

	function drawCircle(centerX, centerY, radius, drawColor){
		canvasContext.fillStyle = drawColor;
		// The beginPath() method begins a path, or resets the current path.
		canvasContext.beginPath(); 
		// ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
		canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); 
		// The fill() method fills the current drawing (path). The default color is black.
		canvasContext.fill(); 
	}


	function colorRect(leftX, topY, width, height, drawColor){

		// Position & Size of Canvas (Xpos, Ypos, rectWidth, rectHeight)
		canvasContext.fillStyle = drawColor;
		canvasContext.fillRect(leftX, topY, width, height);
	}

	function calculateMousePos(evt){
		
		// Get the canvas location regardless of viewport size to find mouseX pos and mouseY pos

		// The Element.getBoundingClientRect() method returns the size 
		// of an element and its position relative to the viewport.
		// rect = { x: 8, y: 8, width: 800, height: 600, top: 8, right: 808, bottom: 608, left: 8 }
		var rect = canvas.getBoundingClientRect();
		
		// .documentElement returns the Document Element of the document (the <html> element)
		var root = document.documentElement;

		// The clientX property returns the horizontal coordinate (according to the client area) 
		// of the mouse pointer when a mouse event was triggered.
		// scrollLeft sets or returns the number of pixels an element's content scrolled horizontally
		var mouseX = evt.clientX - rect.left - root.scrollLeft;
		
		// The clientY property returns the vertical coordinate (according to the client area) 
		// of the mouse pointer when a mouse event was triggered.		
		// scrollTop sets or returns the number of pixels an element's content scrolled vertically
		var mouseY = evt.clientY - rect.top - root.scrollTop;

		console.log("evt.clientX: " + evt.clientX);
		console.log("rect.left: " + rect.left);
		console.log("root.scrollLeft: " + root.scrollTop);

		// return x, y mouse coordinates
		return {
			x: mouseX,
			y: mouseY
		};
	}

	//Reset ball position if ball leaves canvas
	function ballReset(){

		// Check player scores
		if(player1Score >= winningScore || player2Score >= winningScore){

			showingWinScreen = true;

		}

		// Set ball to move in opposite direction it was currently set
		ballSpeedX = -ballSpeedX;


		ballX = canvas.width/2;
		ballY = canvas.height /2;
	}

	//Wait for user to click to begin new game
	function handleMouseClick() {

		if(showingWinScreen){
			player1Score = 0;
			player2Score = 0;
			showingWinScreen = false
		}

	}

}


