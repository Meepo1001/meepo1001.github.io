window.onload = init;
window.onmousemove = MouseMoveHandler ;
var cw = 1024, ch = 768;
var context;

var board;
var boardx = 0; 
var boardy = 680;

var ball;
var ballx = 400;
var bally = 400;

var vx = 4;
var vy = 4;

var bricks = [];
var brickWidth = 198;
var brickHeight = 70;
var brickPositionx = 20;
var brickPositiony = 95;

var DoorW = 512;
var DoorH = 768;

var gameOver = false;

var musicTime = 0;

function init()
{
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");

	
	bg = addImg("./bg.jpg");
	board = addImg("./board.png");
	ball = addImg("./littleball.png");

	Door1 = addImg("opening/door1.png");
	Door2 = addImg("opening/door2.png");
	Doorframe = addImg("opening/doorframe.png");
	Cloud1 = addImg("opening/cloud1.png");
	Cloud2 = addImg("opening/cloud2.png");

	winner = addImg("win.png");
	loser = addImg("lose.png");

	emitMusic = loadAudio("fireEffect3.mp3");
	clearMusic = loadAudio("explodeEffect2.m4a");
	bgMusic = loadAudio("bgm3.mp3");
	bgMusic.play();
	winMusic = loadAudio("win.mp3");
	loseMusic = loadAudio("lose.mp3");

	createBricks();

	setInterval(gameLoop, 1000/60);
} 

var num = 0;
function lose()
{
	if(num == 0)
	{
		context.globalAlpha = 0.5;
		num++;		
	}
	else
	{
		drawLose();
	}
}

function drawLose()
{
	
	context.globalAlpha += 0.005;
	context.fillStyle = "black";
	context.fillRect(0, 0, 1366, 768);
	context.save();

	context.font = "200px 仿宋";
	// context.font = "300px Verdana";
	context.textAlign = "center";
	context.shadowBlur = 40;
	context.shadowColor = "white";
	context.fillStyle = "white";

	context.fillStyle = "rgba(255, 255, 255," + context.globalAlpha +")";
	context.fillText("失败", cw * 0.5, ch * 0.5);

	// console.log(context.globalAlpha);
	context.restore();
}

function drawWin()
{
	context.drawImage(winner, cw/4, ch/4, cw/2, ch/2);
}


function win()
{
	closeDoor();
	if(cx == 512)
	{
		drawWin();
	}

}

var cx = 0;
function closeDoor()
{
	cx += 2;
	if(cx >= 512)
	{
		cx = 512;
	}
	context.drawImage(Door1, cx-512, 0, DoorW, DoorH);
	context.drawImage(Door2, 1024-cx, 0, DoorW, DoorH);

}

function drawBg()
{
	context.drawImage(bg, 0, 0, 1024, 768);
	context.drawImage(board, boardx, boardy);
}

function drawCloud()
{
	context.drawImage(Cloud1, 0, 0, DoorW, DoorH);
	context.drawImage(Cloud2, 512, 0, DoorW, DoorH);
}


function openDoor()
{

	context.drawImage(Door1, x, 0, DoorW, DoorH);
	context.drawImage(Door2, 512-x, 0, DoorW, DoorH);
}

function openDoorframe()
{

	context.drawImage(Doorframe, x, 0, DoorW, DoorH);
	context.drawImage(Doorframe, 512-x, 0, DoorW, DoorH);
}

function openCloud()
{

	context.drawImage(Cloud1, x2, 0, DoorW, DoorH);
	context.drawImage(Cloud2, 512-x2, 0, DoorW, DoorH);
}

function testBallBrick()
{
	for(var i = bricks.length - 1; i >= 0; i--)
	{
		var item = bricks[i];
		var hit = hitTest(item.x - ball.width, item.y - ball.height, brickWidth + ball.width, brickHeight + ball.height, ballx, bally);
		if(hit)
		{
			bricks.splice(i, 1);
			vy = -vy;
			clearMusic.play();
		}

	}
}

function updateBricks()
{
	for(var i=0; i<bricks.length; i++)
	{
		var item = bricks[i];
		context.drawImage(item.item, item.x, item.y);

	}
}

function createBricks()
{
	for(var i=0; i<5; i++)
	{
		for(var j=0; j<4; j++)
		{
			var item = addImg("bricks/brick"+rnd(0,7)+".png");
			bricks.push({item:item, x: brickPositionx + brickWidth*i, y:brickPositiony + brickHeight*j});
		}
	}
}

function testBallBoard()
{
	// var hit = hitTest(boardx - 60, boardy - 62, 242 + 60, 18 + 62, ballx, bally);
	var hit = hitTest(boardx - ball.width, boardy - ball.height, board.width + ball.width, board.height + ball.height, ballx, bally);
	if(hit)
	{
		bally = boardy - ball.height;
		vy = -vy;
		emitMusic.play();
	}
}

function hitTest(x1, y1, w1, h1, x2, y2)
{
	if(x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1)
	{
		return true;
	}
	else return false;
} 

function updateBall()
{
	ballx += vx;
	bally += vy;

	if(ballx<0)
	{
		ballx = 0;
		vx = -vx;
	}
	else if(ballx > cw-ball.width)
	{
		ballx =  cw-ball.height;
		vx = -vx;
	}
	else if(bally<0)
	{
		bally = 0;
		vy = -vy;
	}
	else if(bally > ch-ball.height)
	{
		gameOver = true;
	}

	context.drawImage(ball, ballx, bally);
}

function MouseMoveHandler(e)
{
	boardx = e.x - board.width/2;
}

var x = 0, x2 = 0;
function gameLoop()
{
	clearScreen();
	drawBg();
	if(gameOver == false)
	{
		if(bricks.length > 0)
		{
			
			x-=2;
			if(x > -512)
			{
				openDoor();
				openCloud();	
				if(x < -200)
				{
					x2-=2;
				}
				openDoorframe();	
			}
			else if(x> -712)
			{
				openCloud();
				x2-=2;
			}
			else
			{
				context.drawImage(bg, 0, 0, 1024, 768);
				context.drawImage(board, boardx, boardy);

				updateBall();
				testBallBoard();

				updateBricks();
				testBallBrick();
			}
		}
		else
		{
			win();
			if(musicTime == 0)
			{
				bgMusic.pause();
				winMusic.play();
			}
			musicTime++;
		}
		
	}
	else
	{
		lose();
		if(musicTime == 0)
		{
			bgMusic.pause();
			loseMusic.play();
		}
		musicTime++;
		
	}

}

function clearScreen()
{
	context.clearRect(0, 0, cw, ch);
}

function addImg(url)
{
	var img = new Image();
	img.src = url;
	return img;
}


function rnd(min, max)
{
	var result = min + (max - min) * Math.random();
	return Math.floor(result);
}

function loadAudio(url)
{
	var au = new Audio();
	au.src = url;
	return au;
}