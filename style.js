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
var winningScore = 5;
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


setInterval(function(){
	
	if(!showWinningScreen){
		ballAnimate();			
	}

	drawObjects();
}, fps);



canvas.addEventListener('mousemove', function(e){
	var mousePos = calculateMousePos(e);
	leftPaddleY = mousePos.y - (paddleHeight/2);

})


canvas.addEventListener('click', function(){
	
	playerScore = 0;
	computerScore = 0;
	showWinningScreen = false;
})



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
		
		ballSpeedY = -ballSpeedY;	

	}

}




function ballReset(){

	if(playerScore >= winningScore || computerScore >= winningScore){
		
		showWinningScreen = true;

						scoreDisplay('Player Score: ', playerScore, 100, 30, 'white');
				scoreDisplay('Computer Score: ', computerScore, canvas.width - 200, 30, 'white');
				console.log('win')
	}

	// draw scores

	console.log(computerScore)



	ballX = 400;
	ballY = 300;
	ballSpeedX = -ballSpeedX;
	ballSpeedY = 0;
	rightPaddleY = 300;

};


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

