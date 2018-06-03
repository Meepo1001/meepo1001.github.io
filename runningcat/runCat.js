window.onload = init;
window.onkeydown = onKeyDown;
var cw = 1024, ch = 768;
var context;
var bg11,bg12,bg21,bg22;
var catx=500;
var caty=500;
var terrain;

var gameOver = false;

var catWidth = 120;
var catHeight = 128;

function init()
{


	var canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	bg11 = addImg("bg1.png");
	bg12 = addImg("bg1.png");
	bg21 = addImg("bg2.png");
	bg22 = addImg("bg2.png");

	terrain1 = addImg("terrain/1.png");
	terrain2 = addImg("terrain/2.png");
	terrain3 = addImg("terrain/3.png");

	destination = addImg("destination/2.png");

	creatTerrain();
	createGold();


	bgMusic = loadAudio("music/bgm.mp3");
	bgMusic.play();
	winMusic = loadAudio("music/congratulations.wav");
	loseMusic = loadAudio("music/GameOver.wav");
	goldMusic = loadAudio("music/gold.mp3");
	jumpMusic = loadAudio("music/jump.mp3");
	runeFlightMusic = loadAudio("music/runeFlight.wav");
	runeSpeedMusic = loadAudio("music/runeSpeed.wav");
	fireworkMusic = loadAudio("music/firework.wav");
	
	setInterval(gameLoop, 1000/60);
} 

var time = 0;

var f;
var m = 0;
var musicTime = 0;
function gameLoop()
{ 
	// console.log("t:"+t);
	clearScreen();
	time ++;
	drawSky();
	drawGround();
	drawTerrain();
	testCatTerrain();
	drawRuneSpeed();
	drawRuneFlight();
	drawGold();
	drawTrap();
	// console.log(terrain_2.length);
	if(gameOver == true)
	{
		drawCatOver();
		lose();
		if(musicTime == 0)
		{
			bgMusic.pause();
			loseMusic.play();
		}
		musicTime++;

	}
	else
	{
		drawCatJump();
		drawCatFly();
		drawDestination();
		if(caty>=500)
		{
			drawCatRun();
			m=0;
			jnum = 0; 	//只能连续跳两次
		}

	}
	if(catx > terrain_3[terrain_3.length-1].x + 100)
	{
		gameOver = true;
	}
}

var trapn = 3;
var trapx = 1000;
var trapy = 550;
var trapHeight = 60;
var trapWidth = 132;
var aliveT = 1;
var traps = [];

function drawTrap()
{
	var trap = addImg("trap/trap (" + trapn + ").png");
	for(var i=0; i<terrain_2.length; i++)
	{
		
		if(i%3==0)
		{
			trapx = terrain_2[i].x;


			context.drawImage(trap, trapx, trapy);
			trapx -= 4 * aliveT;
			var hit = hitTest(trapx - catWidth+70, trapy - catHeight, trapWidth , trapHeight + catHeight, catx, caty);
			if(hit)
			{
				gameOver = true;
				// score++;
			}
		}
	}

}



var gn = 1;
var gx = 300;
var gy = 340;
var gHeight = 90;
var gWidth = 60;
var aliveG = 1;
var golds = [];
var score = 0;
function testCatGold()
{
	for(var i = 0;i<golds.length ; i+=7)
	{
		var item = golds[i];
		var hit = hitTest(item.x - catWidth, item.y - catHeight, gWidth , gHeight + catHeight, catx, caty);
		if(hit)
		{
			golds.splice(i, 7);
			score++;
			goldMusic.pause();
			goldMusic.play();
		}
	}
}

var goldWidth = new Array(46, 32, 53, 53, 32, 46, 59);
var angle = 0;
function createGold()
{
	for(var i=0; i<200; i++)
	{
		angle+=30;
		// console.log("angle:" + angle);
		if(angle<=180)
		{
			for(var gn=1; gn<=7; gn++)
			{
				var item = addImg("gold/gold (" + gn + ").png");

				golds.push({item:item, x: gx + 100 * i - 0.5 * goldWidth[gn-1], y:gy - 100* Math.sin(angle*Math.PI/180)});	

			}
		}
		else 
		{
			angle = 0;
		}

	}
}

var gdn = 0;
function drawGold()
{
	var item = new Image();
	for(var i=0; i<golds.length; i+=7)
	{
		item = golds[i+gdn];
		context.drawImage(item.item, item.x, item.y);
	}

	for(var i=0; i<golds.length; i++)
	{
		item = golds[i];
		item.x -= 4 * aliveG;
	}
	
	if(time % 5 == 0)
	{
		gdn++;
		if(gdn > 6)
		{
			gdn = 0;
		}
	}

	context.fillStyle = "white";
	context.font = "20px Verdana";
	context.fillText("score:"+score, 900, 50);
	testCatGold();
	
	
}

var rfn = 1;
var rfy = 350;
var rfx = 5500;
var rfWidth = 50;
var rfHeight = 50;
var aliveF = 1;
function drawRuneFlight()
{
	rfx -= 4 * aliveF;
	runeFlight = addImg("rune/runeflight (" + rfn + ").png");
	context.drawImage(runeFlight, rfx-0.5 * runeFlight.width, rfy);
	if(time % 5 == 0)
	{
		rfn++;
		if(rfn > 7)
		{
			rfn = 1;
		}
	}

	testCatRuneFlight();
	function testCatRuneFlight()
	{
		var hit = hitTest(rfx - catWidth, rfy - catHeight, rfWidth , rfHeight + catHeight, catx, caty);
		if(hit)
		{
			tool = 1;
			rfx = 120;
			rfy = 10;
			aliveF = 0;
			runeFlightMusic.play();
			// congratulations();
		}
	}
	
}

var rsn = 1;
var rsy = 450;
var rsx = 2500;
var rsWidth = 50;
var rsHeight = 50;
var alive = 1;
function drawRuneSpeed()
{
	rsx -= 4 * alive;
	runeSpeed = addImg("rune/runespeed (" + rsn + ").png");
	context.drawImage(runeSpeed, rsx-0.5 * runeSpeed.width, rsy);
	if(time % 5 == 0)
	{
		rsn++;
		if(rsn > 7)
		{
			rsn = 1;
		}
	}

	testCatRuneSpeed();
	function testCatRuneSpeed()
	{
		var hit = hitTest(rsx - catWidth, rsy - catHeight, rsWidth , rsHeight + catHeight, catx, caty);
		if(hit)
		{
			tSpd = 8;
			bg1Speed = -2;
			bg2Speed = -8;
			rsx = 50;
			rsy = 10;
			alive = 0;
			aliveF = 2;
			aliveG = 2;
			runeSpeedMusic.play();
			bgMusic.pause();
			bgMusic.playbackRate = 1.5;
			bgMusic.play();
			// congratulations();
		}
	}
	
}
var gNum = 0;
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
	context.fillRect(0, 0, 1366, 768);
	context.save();

	// context.font = "200px 仿宋";
	context.font = "100px Verdana";
	context.textAlign = "center";
	context.shadowBlur = 40;
	context.shadowColor = "white";
	context.fillStyle = "white";

	context.fillStyle = "rgba(255, 255, 255," + context.globalAlpha +")";
	context.fillText("GAME OVER", cw * 0.5, ch * 0.5);
	context.fillText("SCORE:"+score, cw * 0.5, ch * 0.5+100);

	// console.log(context.globalAlpha);
	
	context.restore();
}

function drawDestination()
{
	// destination = addImg("run/run0.png");
	var dx = terrain_3[terrain_3.length-1].x;
	var dy = 450;
	context.drawImage(destination, dx-250, dy);
	// console.log("dx:"+dx);
	// console.log("dy:"+dy);
	var desWidth = 120;
	var desHeight = 128;
	testCatDestination();
	function testCatDestination()
	{
		var hit = hitTest(dx - catWidth, dy - catHeight, desWidth , desHeight + catHeight, catx, caty);
		if(hit)
		{
			tSpd = 0;
			bg1Speed = 0;
			bg2Speed = 0;
			aliveG = 0;
			congratulations();
			winMusic.play();
			fireworkMusic.play();
		}
	}
}

var fwn = 1;
var ranx = 300;
var rany = 300;
function congratulations()
{
	tSpd = 0;
	bg1Speed = 0;
	bg2Speed = 0;

	context.save();
	context.font = "80px Verdana";
	context.textAlign = "center";
	context.shadowBlur = 20;
	context.shadowColor = "white";
	context.fillStyle = "orange";

	// context.fillStyle = "rgba(255, 255, 255," + context.globalAlpha +")";
	context.fillText("CONGRATUTIONS!", cw * 0.5, ch * 0.5);
	context.restore();

	fireworks = addImg("fireworks/fireworks3 (" + fwn + ").png");
	context.drawImage(fireworks, ranx, rany, 150, 150);
	context.drawImage(fireworks, ranx + 500, rany + 500, 250, 250);
	context.drawImage(fireworks, ranx - 500, rany + 500, 170, 170);
	// console.log("ranx:"+ranx);
	// console.log("rany:"+rany);
	if(time % 10 == 0)
	{
		fwn++;
		if(fwn > 5)
		{
			fwn = 1;
			ranx = 102 * Math.floor(10 * Math.random());
			rany = 76 * Math.floor(10 * Math.random());
		}

	}


}


function testCatTerrain()
{
	for(var i=0; i<terrain_3.length; i++)
	{
		var item3 = terrain_3[i];
		var item3width = 82;
		var disx = item3.x+item3width;
		var disy = item3.y;

		var disWidth = 50 * rand[i+1] + 50;
		var disHeight = 168;

		// var hit = hitTest(boardx - 60, boardy - 62, 242 + 60, 18 + 62, ballx, bally);
		
		var hit = hitTest(disx - 30, disy - catHeight, disWidth + 10, disHeight + catHeight, catx, caty);
		if(hit)
		{
			gameOver = true;
			tSpd = 0;
			bg1Speed = 0;
			bg2Speed = 0;
		}

	}
	// console.log(" ");
}

function hitTest(x1, y1, w1, h1, x2, y2)
{
	if(x2 >= x1 && x2 <= x1 + w1 && y2 >= y1 && y2 <= y1 + h1)
	{
		return true;
	}
	else return false;
}

var on = 1;
function drawCatOver()
{
	t=0;		//over的时候不能跳
	m=0;
	tool = 0;   //over的时候也不能飞

	cat = addImg("over/" + on + ".png");
	context.drawImage(cat, catx, caty);
	if(time % 6 == 0)
	{
		on++;
		if(on > 3)
		{
			on = 3;
		}
		
	}
	catx+=2;
	caty+=10;
}

var tx=500,ty=600;
var tSpd = 4;

var oldTx = 0;

var terrain_1 = [];
var terrain_2 = [];
var terrain_3 = [];

function drawTerrain()
{

	for(var i=0; i<terrain_1.length; i++)
	{
		var item1 = terrain_1[i];
		context.drawImage(item1.item1, item1.x, item1.y);
		item1.x -= tSpd;
	}
	// console.log("terrain_2.length:"+terrain_2.length);
	for(var i=0; i<terrain_2.length; i++)
	{
		var item2 = terrain_2[i];
		for(var k=0; k<num;k++)
		{
			for(var tn=1;tn<=rand[k];tn++)
			{
				context.drawImage(item2.item2, item2.x, item2.y);
			}
		}
		item2.x -= tSpd;
	}
	
	for(var i=0; i<terrain_3.length; i++)
	{
		var item3 = terrain_3[i];
		context.drawImage(item3.item3, item3.x, item3.y);
		item3.x -= tSpd;
	}
}

var rand = [];
var num = 6;
currentTx = 100;
var ran = 0;
function creatTerrain()
{
	terrain2.onload = function()
	{
		for(var i=0; i<num;i++)
		{
			rand.push(ran);
			distance = 50 * ran + 50;
			// distance = 50 ;

			// console.log("distance:"+distance);
			var item1 = addImg("terrain/1.png");
			var item2 = addImg("terrain/2.png");
			var item3 = addImg("terrain/3.png");

			var long = terrain1.width + ran*terrain2.width + terrain3.width;
			currentTx = oldTx+long+distance;
			oldTx = currentTx;

			// ran = Math.floor(4*Math.random());	
			ran = Math.floor(10*Math.random());	
			

			terrain_1.push({item1:item1, x: currentTx-terrain1.width, y:ty});

			// console.log("item1:"+(currentTx-terrain1.width));

			for(var tn=1;tn<=ran;tn++)
			{
				terrain_2.push({item2:item2, x: (tn-1)*terrain2.width + currentTx, y:ty});
				// console.log("item2:"+((tn-1)*terrain2.width + currentTx));
			}

			terrain_3.push({item3:item3, x: (tn-1)*terrain2.width + currentTx, y:ty});

			// console.log("item3:"+((tn-1)*terrain2.width + currentTx));

		}
	}
}
var rn = 0;

function drawCatRun()
{
	
	cat = addImg("run/" + rn + ".png");
	context.drawImage(cat, catx, caty);
	if(time % 6 == 0)
	{
		if(rn == 0)
		{
			rn = 1;
		}
		else rn=0;
	}
	
}

var jn = 0;
var t;
var m=0;

function drawCatJump()
{
	if(t>0)
	{
		m=1;
		t--;
		caty-=4;
		cat = addImg("jump/" + jn + ".png");
		context.drawImage(cat, catx, caty);
		if(time % 5 == 0)
		{
			jn++;
			if(jn>2)jn=2;
		}
	}
	else if(m>0 && caty<500)
	{
		caty+=4;
		cat = addImg("jump/" + 3 + ".png");
		context.drawImage(cat, catx, caty);
	}
	
}

var fn = 1;
var flyTime = 100;
var tool = 0;
var n = 0;
function drawCatFly()
{

	if(tool == 1)
	{
		t=0;		//飞的时候不能跳
		m=0;

		flyTime--;
		if(flyTime > 0)
		{
			caty=300;
			cat = addImg("fly/" + fn + ".png");
			context.drawImage(cat, catx, caty);
			if(time % 5 == 0)
			{
				fn++;
				if(fn>2)fn=1;
				// console.log(flyTime);
			}
		}
		else if(caty<500) 
		{
			caty+=4;
			cat = addImg("jump/" + 3 + ".png");
			context.drawImage(cat, catx, caty);

			// console.log(h);
		}
		else
		{
			tool=0;
			flyTime=100;
		}
	}
	
	
}



var bg1Speed = -1;
var bg11X = 0;
var bg12X = 1024;
function drawSky()
{

	bg11X += bg1Speed;
	bg12X += bg1Speed;
	if(bg11X < -1024)
	{
		bg11X = 0;	
	}
	if(bg12X < 0)
	{
		bg12X = 1024;	
	}
	context.drawImage(bg11, bg11X, 0, 1024, 500);
	context.drawImage(bg12, bg12X, 0, 1024, 500);
}

var bg2Speed = -4;
var bg21X = 0;
var bg22X = 1024;
function drawGround()
{

	bg21X += bg2Speed;
	bg22X += bg2Speed;
	if(bg21X < -1024)
	{
		bg21X = 0;	
	}
	if(bg22X < 0)
	{
		bg22X = 1024;	
	}
	context.drawImage(bg21, bg21X, 300, 1024, 468);
	context.drawImage(bg22, bg22X, 300, 1024, 468);
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
var jnum = 0;
function onKeyDown(e)
{

	switch(e.keyCode)
	{
		// case 32:t=50;		//空格
		case 32:
				jump();
				jumpMusic.play();		//空格

		break;

		// case 70:tool = 1;	//f
		// break;

		case 65:catx-=10;
		break;

		case 68:catx+=10;
		break;

	}
	
	function jump()
	{
		jnum++;
		if(jnum<=2)
		{
			t=50;
		}
	}
}

function loadAudio(url)
{
	var au = new Audio();
	au.src = url;
	return au;
}