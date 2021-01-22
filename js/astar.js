var canvas;
var ctx;
var FPS = 50;

//map
var col = 50;
var arrow = 50
var scenary; //matriz

//tiles
var widthT;
var heightT;


function start() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    //calc tile size
    widthT = parseInt(canvas.width / col);
    heightT = parseInt(canvas.height / arrow);

    scenary = createArray2D(arrow, col);
    setInterval(function () {
        main();
    }, 1000 / FPS);


}

function createArray2D(arrows, columns) {
    var obj = new Array(arrows);
    for (i = 0; i < arrows; i++) {
        obj[i] = new Array(columns)
    }
    return obj;
}

function main() {
    console.log("paso");
}

function tile(x, y) {
    this.x = x;
    this.y = y;

    //Type (obstaclce = 1; clean = 0)
    this.type = 0;
    var random = Math.floor(Math.random() * 5);
    if (random === 1) {
        this.type = 1;
    }
    //weigth
}

