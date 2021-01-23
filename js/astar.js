var canvas;
var ctx;
var FPS = 50;

//map
var cols = 50;
var arrows = 50
var scenary; //matriz

//tiles
var widthT;
var heightT;
const wall = "#000000";
const ground = "#777777";


function start() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    //calc tile size
    widthT = parseInt(canvas.width / cols);
    heightT = parseInt(canvas.height / arrows);

    scenary = createArray2D(arrows, cols);
    setInterval(function () {
        main();
    }, 1000 / FPS);

    //add the objets tiles
    for (i = 0; i < arrows; i++) {
        for (j = 0; j < cols; j++) {
            scenary[i][j] = new tile(i, j);
        }
    }
}

function drawnScenary() {

    for (i = 0; i < cols; i++) {
        for (j = 0; j < arrows; j++) {
            scenary[i][j].drawn();
        }
    }
}

function createArray2D(a, c) {
    var obj = new Array(a);
    for (i = 0; i < a; i++) {
        obj[i] = new Array(c)
    }
    return obj;
}

function main() {

    drawnScenary();

}

function tile(x, y) {
    this.x = x;
    this.y = y;

    //Type (obstacle = 1; clean = 0)
    this.type = 0;
    var random = Math.floor(Math.random() * 5);
    if (random == 1) {
        this.type = 1;
    }
    //weigths
    this.f = 0; //total cost of the move (g+h)
    this.g = 0; //steps
    this.h = 0; //heuristic

    this.neighbours = [];
    this.parents = null;

    this.drawn = function () {
        var color;
        if (this.type == 0)
            color = ground;
        else {
            color = wall;
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x * widthT, this.y * heightT, widthT, heightT);
    }

}

