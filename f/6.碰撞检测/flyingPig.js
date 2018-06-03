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
	shoot();
	createEnemy();
	testBulletEnemy();
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

var playerBullets = [];
function shoot()
{
	if(time % 5 == 0)
	{
		var bullet = {};
		bullet.img = addImg("bullet/bullet (2).png");
		bullet.x = flyingPigX +14;
		bullet.y = flyingPigY -14;
		bullet.vx = 0;
		bullet.vy = -8;

		playerBullets.push(bullet);
	}

	drawPlayerBullets();
	function drawPlayerBullets()
	{
		for(var i = playerBullets.length - 1; i >= 0; i--)
		{
			var bullet = playerBullets[i];
			bullet.x += bullet.vx;
			bullet.y += bullet.vy;

			if(bullet.y < 20)
			{
				playerBullets.splice(i,1);
			}

			context.drawImage(bullet.img, bullet.x, bullet.y, 20, 20);
		}
	}
}

var enemyArr = [];

function createEnemy()
{
	if(time % 15 == 0)
	{
		var enemy = {};
		var i = Math.floor(Math.random() * 4)+1;
		enemy.img = addImg("enemy/E (" + i + ").png");
		enemy.x = cw * Math.random();
		enemy.y = -50;
		enemy.vx = 0;
		enemy.vy = 1 + 5 * Math.random();
		enemy.hp = 100;
		enemy.width = enemy.img.width;
		enemy.height = enemy.img.height;

		enemyArr.push(enemy);
	}
	drawEnemy();
	function drawEnemy()
	{
		for(var i = enemyArr.length - 1; i >= 0; i--)
		{
			var enemy = enemyArr[i];

			enemy.x += enemy.vx;
			enemy.y += enemy.vy;

			context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width*0.5, enemy.height*0.5);
		}
	}
}


function testBulletEnemy()
{
	for(var i = playerBullets.length - 1; i >= 0; i--)
	{
		var bullet = playerBullets[i];
		for(var j = enemyArr.length - 1; j >= 0; j--)
		{
			var enemy = enemyArr[j];
			var hit = hitTestObject(enemy, bullet);
			if(hit)
			{
				playerBullets.splice(i, 1);
				enemyArr.splice(j, 1);
				break;
			}
		}
	}
}

function hitTestObject(obj1, obj2)
{
	return hitTestPoint(obj1.x, obj1.y, obj1.img.width, obj1.img.height,obj2.x, obj2.y );
}

function hitTestPoint(x1, y1, w1, h1, x2, y2)
{
	if(x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1)
	{
		return true;
	}
	else return false;
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
}