window.onload = init;
window.onmousemove = mouseMoveHandler;
var cw = 800, ch = 800;
var context;
var bg1, bg2;
var flyingPig;

var gameOver = false;

function init()
{
	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	bg1 = addImg("bg/bg.png");
	bg2 = addImg("bg/bg.png");

	addExplosionImgs();
	setInterval(gameLoop, 1000/60);
	
} 

var time = 0;
function gameLoop()
{
	time ++; 
	clearScreen();
	drawGround();
	drawFlyingPig();
	shootMode(1);

	createEnemy();
	testBulletEnemy();
	testPlayerEnemy();
	drawExplosion();
	
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
var flyingPigHP = 20;
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
function shoot(x, y)
{
	if(time % 20 == 0)
	{
		var bullet = {};
		bullet.img = addImg("bullet/bullet (2).png");
		bullet.x = flyingPigX + 14 + x;
		bullet.y = flyingPigY - 14 + y;
		bullet.vx = 0;
		bullet.vy = -1;
		bullet.dmg = 20;

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

function shootMode(m)
{
	switch(m)
	{
		case 1:shoot(0,0);break;
		case 2:
		shoot(0,0);
		shoot(-15,10);
		shoot(15,10);
		break;
		case 3:
		shoot(0,0);
		shoot(-15,10);
		shoot(15,10);
		shoot(-30,20);
		shoot(30,20);
		break;
		case 4:
		shoot(0,0);
		shoot(-15,10);
		shoot(15,10);
		shoot(-30,20);
		shoot(30,20);
		shoot(-45,20);
		shoot(45,20);
		break;
		case 5:
		shoot(0,0);
		shoot(-15,10);
		shoot(15,10);
		shoot(-30,20);
		shoot(30,20);
		shoot(-45,20);
		shoot(45,20);
		shoot(-100,40);
		shoot(100,40);
		break;
	}
}

var enemyArr = [];

function createEnemy()
{
	if(time % 10 == 0)
	{
		var enemy = {};
		var i = Math.floor(Math.random() * 4)+1;
		enemy.img = addImg("enemy/E (" + i + ").png");
		enemy.x = (cw - 250) * Math.random();//优化敌机边界
		enemy.y = -50;
		enemy.vx = 0;
		// enemy.vy = 1 + 5 * Math.random();
		enemy.vy = 2 + 0.5 * i;
		// enemy.hp = 100;
		enemy.hp = 20 + 20 * i;
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

			context.drawImage(enemy.img, enemy.x, enemy.y, enemy.width, enemy.height);
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
			// console.log(enemyArr.length);
			if(hit)
			{
				playerBullets.splice(i, 1);
				enemy.hp -= bullet.dmg;
				if(enemy.hp <= 0)
				{
					enemyArr.splice(j, 1);
					explode(enemy.x, enemy.y);
				} 
				break;
			}
		}
	}
}

function testPlayerEnemy()
{
	
	for(var i = enemyArr.length - 1; i >= 0; i--)
	{
		var enemy = enemyArr[i];

		var hit = hitTest();
		function hitTest()
		{
			return hitTestPoint(enemy.x, enemy.y, enemy.width, enemy.height,flyingPigX, flyingPigY );				
		}

		if(hit)
		{
			enemyArr.splice(i, 1);
			flyingPigHP -= 1;
			console.log(flyingPigHP);
			explode(flyingPigX, flyingPigY);

			if(flyingPigHP <= 0)
			{
				gameOver = true;

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

var explosionImgs = [];
function addExplosionImgs()
{
	for(var n = 1; n < 8; n++)
	{	
		var img = addImg("./explosion/1/explosion (" + n + ").png");
		explosionImgs.push(img);
	}
}

var explosionArr = [];
function explode(x, y)
{
	var explosion = {x: x, y:y, crtIndex: 1};
	explosionArr.push(explosion);
}

function drawExplosion()
{
	for(var i = explosionArr.length - 1; i >= 0; i--)
	{
		var explosion = explosionArr[i];
		if(explosion.crtIndex >= 7)
		{
			explosionArr.splice(i, 1);
			continue;
		}
		var img = explosionImgs[explosion.crtIndex];
		context.drawImage(img, explosion.x - img.width/2, explosion.y - img.height/2);
		if(time % 3 == 0)explosion.crtIndex++;
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
}