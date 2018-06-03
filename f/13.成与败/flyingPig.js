window.onload = init;
window.onmousemove = mouseMoveHandler;
var cw = 800, ch = 800;
var context;
var bg1, bg2;
var flyingPig;
var flyingPigHP = 6;
var gameOver = false;

var score = 0;

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
var mode = 1;
function gameLoop()
{
	
	// console.log(time);
	if(gameOver == false)
	{
		time ++; 
		clearScreen();
		drawGround();
		drawFlyingPig();
		shootMode(mode);

		createEnemy();
		testBulletEnemy();
		testPlayerEnemy();
		drawExplosion();

		drawRune();

		// drawHp();
		drawPlayerHp();
		drawBossHp();
		if(time > 5000)
		{
			drawBoss();
		}
		if(bossHP<1)
		{
			win();
		}
	}
	else lose();	
}

var gNum = 0;
var wx = cw;
function win()
{
	time = 0;
	bgSpeed = 0;
	aliveF = 0;
	if(gNum == 0)
	{
		context.globalAlpha = 0.4;
		gNum++;		
	}
	else
	{
		context.globalAlpha += 0.005;
		context.fillStyle = "black";
		context.fillRect(0, 0, cw, ch);
		if(context.globalAlpha >= 0.8)
		{
			context.globalAlpha = 0.8;
		}
		var winner = addImg("win/win.png");
		wx -= 10;
		if(wx <= 50)
		{
			wx = 50;
		}
		context.save();
		context.globalAlpha = 1;
		// context.drawImage(winner, wx, -30);
		if(wx <= 50)
		{
			var text = addImg("win/text.png");
			context.drawImage(text,100,500,600,300);
			context.font = "50px 微软雅黑";
			// context.textAlign = "center";
			context.fillStyle = "white";

			context.fillText("恭喜你击败了大魔王", 150, 580);
			context.fillText("你的得分是:"+score, 150, 580+60);
			context.fillText("超越了99%的飞猪", 150, 580+120);
		}
		context.drawImage(winner, wx, -30);

		context.restore();
	}
}

// var gNum = 0;
function lose()
{
	if(gNum == 0)
	{
		context.globalAlpha = 0.5;
		gNum++;		
	}
	else
	{
		drawLose();
		// console.log("gNum:"+gNum);
	}
}

function drawLose()
{
	
	context.globalAlpha += 0.005;
	context.fillStyle = "black";
	context.fillRect(0, 0, cw, ch);
	context.save();

	context.font = "100px Verdana";
	context.textAlign = "center";
	context.shadowBlur = 40;
	context.shadowColor = "white";
	context.fillStyle = "white";

	context.fillStyle = "rgba(255, 255, 255," + context.globalAlpha +")";
	context.fillText("GAME OVER", cw * 0.5, ch * 0.5);
	context.fillText("SCORE："+score, cw * 0.5, ch * 0.5+150);
	
	context.restore();
}

var bn = 1;
var by = 0;
var bx = 550;
var bWidth = 50;
var bHeight = 50;
var spdx = 2;
var spdy = 0;
var bossHP = 10000;

var time2 = 0;
function drawBoss()
{
	if(time % 100 == 0)
	{
		spdx = 2+Math.floor(10*Math.random());
		spdy = 2+Math.floor(10*Math.random());
	}

	bx += spdx;
	by += spdy;

	boss = addImg("boss/boss (" + bn + ").png");

	context.drawImage(boss, bx-0.5 * boss.width, by-0.5 * boss.height);
	if(time % 5 == 0)
	{
		bn++;
		if(bn > 10)
		{
			bn = 1;
		}
	}
	if(bx < 0)
	{
		spdx = -spdx;
	}
	if(by < 0)
	{
		spdy = -spdy;
	}
	if(bx > cw-boss.width/2)
	{
		spdx = -spdx;
		bx = cw-boss.width/2;
	}
	if(by > ch-boss.height/2)
	{
		spdy = -spdy;
		by = ch-boss.height/2;
	}

	testPlayerBoss();
	function testPlayerBoss()
	{
		var hit = hitTest();
		function hitTest()
		{
			return hitTestPoint(bx - flyingPigWidth[fpn], by - flyingPigHeight, bWidth, bHeight + flyingPigHeight,flyingPigX, flyingPigY );				
		}
		
		time2++;
		// console.log(time2);
		if(time2>120)//当受到攻击时间隔2s再次检测是否受到攻击
		{
			if(hit)
			{
				bossHP-=100;
				flyingPigHP-=1;
				if(flyingPigHP < 1)
				{
					gameOver = true;
				}
				mode --;
				if(mode < 1)
				{
					mode = 1;
				}
				time2 = 0;
			}
		}

		
	}

	testBulletBoss();
	function testBulletBoss()
	{
		for(var i = playerBullets.length - 1; i >= 0; i--)
		{
			var bullet = playerBullets[i];

			var hit = hitTest();
			function hitTest()
			{
				return hitTestPoint(bx - 50, by - 50, bWidth, bHeight + 50,bullet.x, bullet.y );				
			}
			
			if(hit)
			{
				bossHP -= bullet.dmg;
				explode(bx, by);
				playerBullets.splice(i, 1);

				break;
			}
		}
	}
}


function drawPlayerHp()
{
	var player = addImg("flyingPig/2/flyingPig (1).png");
	var playerHp = addImg("hp/playerHp.png");
	var x = flyingPigHP/6 * playerHp.width;
	context.drawImage(playerHp, 0, 0, x, playerHp.height, cw-playerHp.width/7, 20, x/7, playerHp.height/7);
	context.drawImage(player, cw-playerHp.width/7-60, 0);
}


function drawBossHp()
{
	var boss = addImg("boss/boss 0.png");
	var bossHp = addImg("hp/bossHp.png");
	var x = bossHP/10000 * bossHp.width;
	context.drawImage(bossHp, 0, 0, x, bossHp.height, 0, 20, x/7, bossHp.height/7);
	context.drawImage(boss, bossHp.width/7-10, 0, 100, 66);
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
// var flyingPigHP = 6;
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
		case 6:
		shoot(0,0);
		shoot(-15,10);
		shoot(15,10);
		shoot(-30,20);
		shoot(30,20);
		shoot(-45,20);
		shoot(45,20);
		shoot(-100,40);
		shoot(100,40);

		shoot(0,10);
		shoot(-15,20);
		shoot(15,20);
		shoot(-30,30);
		shoot(30,30);
		shoot(-45,30);
		shoot(45,30);
		shoot(-100,50);
		shoot(100,50);
		break;
	}
}

var enemyArr = [];
var enc = 50;
function createEnemy()
{
	if (time % 500 == 0) enc -= 5;//优化敌机数量
	if (enc < 10) enc = 10;
	if(time % enc == 0)
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
					score++;
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
			mode--;
			if(mode < 1)
			{
				mode = 1;
			}
			// console.log(flyingPigHP);
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

var rn = 1;
var ry = 0;
var rx = 500;
var rWidth = 50;
var rHeight = 50;
var aliveF = 1;
function drawRune()
{
	ry += 4 * aliveF;
	rune = addImg("rune/rune (" + rn + ").png");
	context.drawImage(rune, rx-0.5 * rune.width, ry);
	if(time % 5 == 0)
	{
		rn++;
		if(rn > 7)
		{
			rn = 1;
		}
	}

	testPlayerRune();
	function testPlayerRune()
	{
		var hit = hitTest();
		function hitTest()
		{
			return hitTestPoint(rx - flyingPigWidth[fpn], ry - flyingPigHeight, rWidth, rHeight + flyingPigHeight,flyingPigX, flyingPigY );				
		}
		// var hit = hitTest(rx - flyingPigWidth[fpn], ry - flyingPigHeight, rWidth , rHeight + flyingPigHeight, flyingPigX, flyingPigY);
		if(hit)
		{
			mode++;

			ry = -Math.floor(Math.random() * 2000);
			rx = Math.floor(50 + Math.random() * (cw-50));
			
			if(mode > 6)
			{
				mode = 6;
			}
		}
		if(ry > ch)
		{
			ry = -Math.floor(Math.random() * 2000);
			rx = Math.floor(50 + Math.random() * (cw-50));
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
}