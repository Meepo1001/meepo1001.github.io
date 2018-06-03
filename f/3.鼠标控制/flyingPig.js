window.onload = init;
window.onmousemove = mouseMoveHandler;
var cw = 800, ch = 800;
var context;
var bg1, bg2;
var flyingPig;

function init()
{
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	bg1 = addImg("bg/bg.png");
	bg2 = addImg("bg/bg.png");

	setInterval(gameLoop, 1000/60);
	
} 

var time = 0;
function gameLoop()
{
	time ++; 
	clearScreen();
	drawGround();
	drawFlyingPig();
}



var bgSpeed = 2;
var bg1y = 0;
var bg2y = -800;
function drawGround()
{

	bg1y += bgSpeed;
	bg2y += bgSpeed;
	if(bg1y > 800)
	{
		bg1y = 0;	
	}
	if(bg2y > 0)
	{
		bg2y = -800;	
	}
	context.drawImage(bg1, 0, bg1y, cw, ch);
	context.drawImage(bg2, 0, bg2y, cw, ch);
}

var fpn = 1;
var flyingPigX = 0.5 * cw;
var flyingPigY = ch - 200;
var flyingPigWidth = new Array(62, 54, 52 , 45, 40);
var flyingPigHeight = 54;
function drawFlyingPig()
{
	
	flyingPig = addImg("flyingPig/2/flyingPig (" + fpn + ").png");
	// flyingPigX = 0.5 * cw - 0.5 * flyingPigWidth[fpn-1];
	
	context.drawImage(flyingPig, flyingPigX, flyingPigY);
	if(time % 5 == 0)
	{
		fpn++;
		if(fpn > 5)
		{
			fpn = 1;
		}
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

function mouseMoveHandler(e)
{
	flyingPigX = e.x - flyingPigWidth[fpn-1]/2;
	flyingPigY = e.y - flyingPigHeight/2;
	console.log(flyingPigX);
}