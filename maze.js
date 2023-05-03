// Showing Maze A* Algortihm with p5.js:
var widthScreen = 700, heightScreen = 600;

function setup(){
    createCanvas(widthScreen, heightScreen);
};

//Create maseSize x maseSize maze of cells
var mazeSize = 20;
var cell = {
    visited : 0,
    top : 1,
    bottom : 1,
    left : 1,
    right : 1,
    pathSquare : 0,
    drawSquare : 0,
};
var maze = new Array(mazeSize);
for(var i = 0; i < mazeSize; i++){
    maze[i] = new Array(mazeSize)
    for(var j = 0; j < mazeSize; j++){
        cell_copy = {};
        maze[i][j] = Object.assign(cell_copy, cell);
    }
};

// Entrance and exit
maze[0][0].top = 0;
maze[mazeSize-1][mazeSize-1].bottom = 0;

//Shuffled Array
function shuffleStack(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}
// Randomized depth-first search
function recursiveMaze(pos, previous_neighbours){
    maze[pos[0]][pos[1]].visited = 1;
    // First get an array of neighbours (check for borders)
    neighbours = []; // This made it global!!!! DOOM.
    // Left
    if(pos[0] != 0){
        neighbours.push([pos[0]-1,pos[1], 'left']);
    };
    // Top
    if(pos[1] != 0){
        neighbours.push([pos[0],pos[1]-1, 'top'])
    };
    // Right
    if(pos[0] != maze.length-1){
        neighbours.push([pos[0]+1,pos[1], 'right']);
    };
    // Bottom
    if(pos[1] != maze.length-1){
        neighbours.push([pos[0],pos[1]+1, 'bottom']);
    };

    // Shuffle Neighbours
    neighbours = shuffleStack(neighbours);
    // Now pop each neighbour, check if visited, if not break wall and recursive call
    while(neighbours.length != 0){
        var next_pos = neighbours.pop();
        if(maze[next_pos[0]][next_pos[1]].visited === 0){
            if(next_pos[2] === 'left'){
                maze[pos[0]][pos[1]].left = 0;
                maze[next_pos[0]][next_pos[1]].right = 0;
            } else if(next_pos[2] === 'right'){
                maze[pos[0]][pos[1]].right = 0;
                maze[next_pos[0]][next_pos[1]].left = 0;
            } else if(next_pos[2] === 'top'){
                maze[pos[0]][pos[1]].top = 0;
                maze[next_pos[0]][next_pos[1]].bottom = 0;
            } else{
                maze[pos[0]][pos[1]].bottom = 0;
                maze[next_pos[0]][next_pos[1]].top = 0;
            }
            neighbours = recursiveMaze(next_pos, neighbours);
        };
    };
    return previous_neighbours;
};
function createMaze(){
    //select random two numbers for starting cell.
    i = Math.floor(Math.random() * maze.length)
    j = Math.floor(Math.random() * maze[i].length)
    var pos = [i, j];
    console.log('Starting cell for Maze Generation: ' + pos);
    recursiveMaze(pos);
};


createMaze();
var cellSize = 500/mazeSize;

function drawMaze(){
    // Draw Maze
    translate(100, 50);
    for(var i = 0; i < maze.length; i++){
        for(var j = 0; j < maze[i].length; j++){
            if(maze[i][j].top === 1){
                line(i*cellSize, j*cellSize, (i+1)*cellSize, (j)*cellSize);
            };
            if(maze[i][j].left === 1){
                line(i*cellSize, j*cellSize, (i)*cellSize, (j+1)*cellSize);
            };
            if(maze[i][j].right === 1){
                line((i+1)*cellSize, (j)*cellSize, (i+1)*cellSize, (j+1)*cellSize);
            };
            if(maze[i][j].bottom === 1){
                line(i*cellSize, (j+1)*cellSize, (i+1)*cellSize, (j+1)*cellSize);
            };
            if(maze[i][j].drawSquare === 1){
                noStroke();
                square((i*cellSize),(j*cellSize),(cellSize));
                stroke(255,255,255);
            };
        };
    };
};

// Recursive call
function recRoute(i, j){
    maze[i][j].drawSquare = 1;
    maze[i][j].pathSquare = 1;

    // if we are at the end goal
    if(i === (mazeSize - 1) && j === (mazeSize - 1)){
        return 1;
    };

    var result = 0;
    var options = [];

    // look for possible routes
    if(maze[i][j].left === 0){
        options.push([i-1, j, 'left']);
    };
    if(maze[i][j].right === 0){
        options.push([i+1,j, 'right'])
    };
    if(maze[i][j].top === 0 && j != 0){
        options.push([i,j-1, 'top']);
    };
    if(maze[i][j].bottom === 0 && j != (mazeSize - 1)){
        options.push([i,j+1, 'bottom']);
    };

    while(options.length != 0){
        var option = options.pop();
        if(maze[option[0]][option[1]].pathSquare === 0){
            result = recRoute(option[0], option[1]);
        }
        if(result === 1){
            return result;
        } 
    }
    // If results is 0 than this is not the path
    maze[i][j].drawSquare = 0;

    return result;
}

function mousePressed(){
    recRoute(0, 0);
}

function draw(){
    background(0);
    fill('rgba(0,255,0, 0.15)');
    stroke(255,255,255);
    
    drawMaze();
};