window.onload = init;

var cw = 600, ch = 800;
var context;
var bg1, bg2;
function init()
{
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	


	setInterval(gameLoop, 1000/60);
} 

function gameLoop()
{ 
	clearScreen();
	drawBackground();
	drawRoleL();
	drawRoleR();
}

var roleW = 115;
var roleH = 125;



var x1 = 0;
var y1 = 0;
var n1 = 1;
var speed1 = 2;
function drawRoleL()
{
	// var role = addImg("role/role (1).png");
	if(x1>cw)
	{
		n1 = Math.floor(Math.random() * 12) + 1;
		x1 = 0;
		y1 = 0;
		speed1 = Math.floor(Math.random() * 4) + 2; 
	}
	
	var role = addImg("role/role ("+ n1 + ").png");
	context.drawImage(role,x1,y1);
	x1+=speed1;
}

var x2 = 0;
var y2 = 200;
var n2 = 12;
var speed2 = 2;
function drawRoleR()
{
	// var role = addImg("role/role (1).png");
	if(x2<0)
	{
		n2 = Math.floor(Math.random() * 12) + 1;
		x2 = cw;
		y2 = 200;
		speed2 = Math.floor(Math.random() * 4) + 2;
	}
	
	var role = addImg("role/role ("+ n2 + ").png");
	context.drawImage(role,x2,y2);
	x2-=speed2;
}

function drawBackground()
{
	bg = addImg("bg/bg.png");
	context.drawImage(bg,0,0,cw,ch);
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

