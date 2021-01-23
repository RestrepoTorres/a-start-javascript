var canvas;
var ctx;
var FPS = 50;

//map vars
var cols = 50;
var rows = 50;
var worldMap;

//tiles vars
var widthTile;
var heigthTile;
const wall = '#000000';
const road = '#777777';


//route vars
var start;
var end;
var openSet = [];
var closedSet = [];
var bestRoute = [];
var finished = false;


function createArray(f, c) {
    var obj = new Array(f);
    for (i = 0; i < f; i++) {
        obj[i] = new Array(c);
    }
    return obj;
}


function heuristic(a, b) {
    var x = Math.abs(a.x - b.x);
    var y = Math.abs(a.y - b.y);

    var dist = x + y;

    return dist;
}


function deleteFromArray(array, element) {
    for (i = array.length - 1; i >= 0; i--) {
        if (array[i] == element) {
            array.splice(i, 1);
        }
    }
}


function Tile(x, y) {

    //position
    this.x = x;
    this.y = y;

    //Type (1 for wall, 0 for clean road)
    this.type = 0;

    var random = Math.floor(Math.random() * 5);
    if (random == 1)
        this.type = 1;

    //cost of the movement
    this.f = 0;  // g+h
    this.g = 0;  //number of steps
    this.h = 0;  //heuristic

    this.neighbours = [];
    this.padre = null;


    //calc the neighbours
    this.addNeighbours = function () {
        if (this.x > 0)
            this.neighbours.push(worldMap[this.y][this.x - 1]);

        if (this.x < rows - 1)
            this.neighbours.push(worldMap[this.y][this.x + 1]);

        if (this.y > 0)
            this.neighbours.push(worldMap[this.y - 1][this.x]);

        if (this.y < cols - 1)
            this.neighbours.push(worldMap[this.y + 1][this.x]);
    }


    //drawn the color of the tile
    this.drawn = function () {
        var color;

        if (this.type == 0)
            color = road;

        if (this.type == 1)
            color = wall;
        ctx.fillStyle = color;
        ctx.fillRect(this.x * widthTile, this.y * heigthTile, widthTile, heigthTile);
    }


    //drawn openSet
    this.drawnOS = function () {
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.x * widthTile, this.y * heigthTile, widthTile, heigthTile);

    }

    //drawn closedSet
    this.drawnCS = function () {
        ctx.fillStyle = '#800000';
        ctx.fillRect(this.x * widthTile, this.y * heigthTile, widthTile, heigthTile);
    }


    //drawn the road followed
    this.drawnRoad = function () {
        ctx.fillStyle = 'green';  //cyan
        ctx.fillRect(this.x * widthTile, this.y * heigthTile, widthTile, heigthTile);
    }


}


function start() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    //calc the tile size
    widthTile = parseInt(canvas.width / cols);
    heigthTile = parseInt(canvas.height / rows);

    //created a matrix
    worldMap = createArray(rows, cols);

    //created the tiles objects
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            worldMap[i][j] = new Tile(j, i)
        }
    }

    //add the neighbours for every tile
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            worldMap[i][j].addNeighbours();
        }
    }

    //create the origin and the end coordinates
    start = worldMap[0][0];
    end = worldMap[cols - 1][rows - 1];

    //start the openSet with the beginning coordinate
    openSet.push(start);


    setInterval(function () {
        main();
    }, 0 / FPS);
}


function drawnMap() {
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            worldMap[i][j].drawn();
        }
    }


    for (i = 0; i < openSet.length; i++) {
        openSet[i].drawnOS();
    }


    for (i = 0; i < closedSet.length; i++) {
        closedSet[i].drawnCS();
    }

    for (i = 0; i < bestRoute.length; i++) {
        bestRoute[i].drawnRoad();
    }


}


function refreshcanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}


function aStart() {

    //t's execute while the end hasn't been researched
    if (finished != true) {

        // continue as long as tiles are available in the openSet
        if (openSet.length > 0) {
            var winner = 0;

            //evaluate the best option for advance
            for (i = 0; i < openSet.length; i++) {
                if (openSet[i].f < openSet[winner].f) {
                    winner = i;
                }
            }

            var currentTile = openSet[winner];

            //save the best route if the end is found
            if (currentTile === end) {
                var tempt = currentTile;
                bestRoute.push(tempt);

                while (tempt.parent != null) {
                    tempt = tempt.parent;
                    bestRoute.push(tempt);
                }

                console.log('path found');

                finished = true;
            }
            else {
                deleteFromArray(openSet, currentTile);
                closedSet.push(currentTile);

                var neighbours = currentTile.neighbours;


                for (i = 0; i < neighbours.length; i++) {
                    var neighbour = neighbours[i];

                    if (!closedSet.includes(neighbour) && neighbour.type != 1) {
                        var tempG = currentTile.g + 1;


                        if (openSet.includes(neighbour)) {
                            if (tempG < neighbour.g) {
                                neighbour.g = tempG;     //camino más corto
                            }
                        } else {
                            neighbour.g = tempG;
                            openSet.push(neighbour);
                        }

                        //refresh tile values
                        neighbour.h = heuristic(neighbour, end);
                        neighbour.f = neighbour.g + neighbour.h;
                        neighbour.parent = currentTile;

                    }

                }


            }


        } else {
            console.log('No solution');
            finished = true;
        }


    }

}


function main() {
    refreshcanvas();
    aStart();
    drawnMap();
}