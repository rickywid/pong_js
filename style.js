var canvas;
var ctx;
var ballX = 400;
var ballY = 300;

var ballSpeedX;
var ballSpeedY = ballSpeedX - 5;

var leftPaddleY = 100;
var rightPaddleY = 100;
var paddleHeight = 100
var paddleThickness = 10;

var playerScore = 0;
var computerScore = 0;
var winningScore = 10;
var showWinningScreen = false;
var fps = 20;

var ballSpeedNormal = document.getElementById('normal');
var ballSpeedFast = document.getElementById('fast');
var ballSpeedFaster = document.getElementById('faster');
var ballSpeedReallyFast = document.getElementById('reallyfast');



canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0,0, canvas.width, canvas.height);

ctx.fillStyle ='white';
ctx.fillText('CHOOSE A SPEED =>', canvas.width-200, 80);
ctx.fillText('CLICK to START GAME', canvas.width-200, 90);

function centreline(){
	ctx.fillStyle = '#aaa';
	for(var i = 10; i <= canvas.height; i+= 40){
		ctx.fillRect(canvas.width/2, i, 2, 20);
	}
}

function centreCircle(){
	ctx.strokeStyle = '#aaa';
	ctx.beginPath();
	ctx.arc(canvas.width/2, canvas.height/2, 100, 0 , Math.PI *2);
	ctx.stroke();
}

function getBallSpeed(){
	if(ballSpeedNormal.checked){
		ballSpeedX = ballSpeedNormal.value;
		console.log('selected')
	} else if(ballSpeedFast.checked){
		ballSpeedX = ballSpeedFast.value;
		console.log('selected')
	} else if(ballSpeedFaster.checked){
		ballSpeedX = ballSpeedFaster.value;
		console.log('selected')
	} else if(ballSpeedReallyFast.checked){
		ballSpeedX = ballSpeedReallyFast.value;
		console.log('selected')
	}
}

centreline();
centreCircle();
getBallSpeed();


// click to start game
canvas.addEventListener('click', function(){

	if(ballSpeedX === undefined){

	}

	
	canvas.addEventListener('mousemove', function(e){
		var mousePos = calculateMousePos(e);
		leftPaddleY = mousePos.y - (paddleHeight/2);

	})


	canvas.addEventListener('click', function(){
		
		playerScore = 0;
		computerScore = 0;
		showWinningScreen = false;
	})


		

	setInterval(function(){
		ballAnimate();
		drawObjects();
	}, fps);


	function ballAnimate(){
		ballX = ballX + ballSpeedX;	
		ballY = ballY + ballSpeedY;	
		var leftPaddleYBottom = leftPaddleY + paddleHeight;
		var rightPaddleYBottom = rightPaddleY + paddleHeight;


		//check to see if ball leaves left side of canvas
		if(ballX < paddleThickness){

			//check if ball hits left paddle
			if(ballY < leftPaddleYBottom && ballY > leftPaddleY){

				var delta = ballY - (leftPaddleY + (paddleHeight/2));
				ballSpeedX = -ballSpeedX;
				ballSpeedY = delta * 0.1;
				

			} else {
				computerScore++;

				ballReset();
			}
		}

		//check to see if ball leaves right side of canvas 
		if(ballX > canvas.width){

			//check if ball hits right paddle
			if(ballY < rightPaddleYBottom && ballY > rightPaddleY && ballX > canvas.width-paddleThickness){

				var delta = ballY - (rightPaddleY + (paddleHeight/2));
				ballSpeedX = -ballSpeedX;
				ballSpeedY = delta * 0.1;

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
			console.log(ballSpeedY)
			ballSpeedY = -ballSpeedY;	



		}

	}

	function ballReset(){

		if(playerScore >= winningScore || computerScore >= winningScore){
			showWinningScreen = true;

		}

		ballX = 400;
		ballY = 300;
		ballSpeedX = -ballSpeedX;
		ballSpeedY = 4;
		rightPaddleY = 300;

	};

	function drawObjects(){
		
		// Check to see if game has eneded
		if(showWinningScreen){
			
			ctx.fillStyle = 'white';
			
			if(playerScore >= winningScore){

				ctx.fillText("Player 1 Wins", 370, 310);

			} else if (computerScore >= winningScore){
				
				ctx.fillText("Computer Wins", 370, 410);	

			}

			// Display action to start new game
			ctx.fillText("click to continue", 365, 510);
			return ;
		}


		computerPaddle();

		// fill canvas bg
		ctx.fillStyle = 'black';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// draw left paddle
		ctx.fillStyle = 'white';
		ctx.fillRect(0, leftPaddleY, paddleThickness, paddleHeight);

		//draw right paddle
		ctx.fillRect(canvas.width-paddleThickness, rightPaddleY, paddleThickness, paddleHeight)
		

		//draw centreline
		centreline();

		//draw centreCircle
		centreCircle();

		// draw scores
		ctx.fillText('Player Score: ' + playerScore, 100, 50);
		ctx.fillText('Computer Score: ' + computerScore, canvas.width - 200, 50);

		// draw ball
		ctx.fillStyle = 'yellow';
		ctx.beginPath();
		ctx.arc(ballX, ballY, 10, 0, Math.PI *2);
		ctx.fill();		
	}


	function computerPaddle(){

		var paddleMid = rightPaddleY + (paddleHeight/2);


			if((rightPaddleY - paddleHeight) > canvas.height){
				
				rightPaddleY = 550;
			}

		//if ball is below midpoint of paddle plus 35px them move paddle down by 5px
		if(paddleMid < ballY+35) {


			rightPaddleY += 3;
		//if ball is above midpoint of paddle plus 35px them move paddle up by 5px
		} else if(paddleMid > ballY-35){
			rightPaddleY -= 3;
		}

	}

	function centreline(){
		for(var i = 10; i <= canvas.height; i+= 40){
			ctx.fillRect(canvas.width/2, i, 2, 20);
		}
	}

	function centreCircle(){
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.arc(canvas.width/2, canvas.height/2, 100, 0 , Math.PI *2);
		ctx.stroke();
	}

	function calculateMousePos(e){
		
		// make cursor position to be within the canvas area regardless of viewport size

		var rect = canvas.getBoundingClientRect();
		var htmlEl = document.documentElement;

		var mouseX = e.clientX - rect.left - htmlEl.scrollLeft;
		var mouseY = e.clientY - rect.top - htmlEl.scrollTop;

		return {
			x: mouseX,
			y: mouseY
		}
	}

});
