window.onload = init;
var cw = 800, ch = 800;
var context;
var bg1, bg2;
function init()
{
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	bg1 = addImg("bg/bg.png");
	bg2 = addImg("bg/bg.png");

	setInterval(gameLoop, 1000/60);
} 

function gameLoop()
{ 
	clearScreen();
	drawGround();
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

