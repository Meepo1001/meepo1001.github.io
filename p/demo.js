window.onload = init;
var bg;
var ctx;
function init()
{
	var canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	
	bg = addImg("bg.png");
	setInterval(draw, 1000/60);
}

function addImg(url)
{
	var img = new Image();
	img.src = url;
	return img;
}

function draw()
{
	ctx.drawImage(bg, 0, 0);
}