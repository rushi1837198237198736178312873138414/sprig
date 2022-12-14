/*
@title: Reptilian Mash
@author: rushi patel
*/

/*
"w", "s", "a", "d" to start the Game.

"w" to change the direction of snake Ups.
"s" to change the direction of snake Down.
"a" to change the direction of snake Left.
"d" to change the direction of snake Right.
"l" to Reset the Game.

Key "l" can only be used after the Message LOST.
*/

const player = "p";
const back = "h";
const background = "s";
const food = "f";
const surround = "b";

setLegend(
  [ player, bitmap`
........33......
.DDDDDDDDDDDDDD.
.DD4444444444DD.
.D444444444444D.
.D440044440044D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.DD4444444444DD.
.DDD44444444DDD.
.DDDDDDDDDDDDDD.
................`],
  [ back, bitmap`
................
.DDDDDDDDDDDDDD.
.DD4444444444DD.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.D444444444444D.
.DD4444444444DD.
.DDDDDDDDDDDDDD.
................`],
  [ background, bitmap`
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF
FFFFFFFFFFFFFFFF`],
  [ food, bitmap`
..............C.
............00C.
...........6600.
...........6666.
..........66666.
..........66666.
.........66666..
66.......66666..
666.....66666...
6666..6666666...
.66666666666....
.66666666666....
..66666666......
....666666......
................
................`],
  [ surround, bitmap`
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLL000LLL000LLLL
LLL0LL0LL0LL0LLL
LLL0LL0LL0LL0LLL
LLL000LLL000LLLL
LLL0LL0LL0LLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL
LLLLLLLLLLLLLLLL`]
);

setBackground(background);

let level = 0;
const levels = [
  map`
bbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbb
bbbbbbbbbbbbbbbbb
b...............b
b...............b
b............f..b
b...............b
b...............b
b...............b
b...............b
b.......p.......b
b...............b
b...............b
b...............b
b...............b
b...............b
b...............b
b...............b
bbbbbbbbbbbbbbbbb`,
];

setMap(levels[level]);

setPushables({
  [ player ]: [],
});

let reset = null;
let game = null;



const lostMsg = () => {
  addText("You Lose!", { 
      x: 6, 
      y: 8, 
      color: color`3`
  });
}

const congratulation = () => {
  addText("Winner", { 
      x: 5, 
      y: 8, 
      color: color`0`
  });
}

let score = 0;
let snake = [{ xPos: getFirst(player).x, yPos: getFirst(player).y }];

const showScore = () => {
  addText(`${score}`, { 
      x: 15, 
      y: 1, 
      color: color`5`
  });
}
showScore();

const checkFoodPlacement = () => {
  let found = 1;
  while(found === 1){
    getFirst(food).x = Math.floor(Math.random()*15) + 1;
    getFirst(food).y = Math.floor(Math.random()*15) + 3;
    found = 0;
    for(let i=0;i<snake.length;i++){
      if(snake[i].xPos === getFirst(food).x && snake[i].yPos === getFirst(food).y){
        found = 1;
        break;
      }
    }
    if(found === 0){
      break;
    }
  } 
}

const eatFoodMelody = tune`
97.40259740259741: d4-97.40259740259741,
97.40259740259741: d4/97.40259740259741,
2922.0779220779223`;
const collisionMelody = tune`
113.20754716981132: a4^113.20754716981132,
113.20754716981132: g4^113.20754716981132,
113.20754716981132: f4^113.20754716981132 + g4~113.20754716981132,
113.20754716981132: e4^113.20754716981132 + f4~113.20754716981132,
3169.811320754717`;

let lost = 0;

const collision = () => {
  for(let i=0;i<snake.length;i++){
    if(getFirst(player).x === snake[i].xPos && getFirst(player).y === snake[i].yPos){
      playTune(collisionMelody);
      lost = 1;
      clearInterval(game);
      clearInterval(reset);
      lostMsg();
      break;
    }
  }
}
// what happens when you eat
const eatFood = () => {
  let xPosition = getFirst(player).x;
  let yPosition = getFirst(player).y;
  if(xPosition === getFirst(food).x && yPosition === getFirst(food).y){
    playTune(eatFoodMelody);
    score++;
    if(score === 150){
      clearInterval(game);
      congratulation();
    }  
    showScore();
    snake.unshift({ xPos: xPosition, yPos: yPosition });
    checkFoodPlacement();
  }else{
    collision();
    const tail = snake.pop();
    clearTile(tail.xPos, tail.yPos);
    snake.unshift({ xPos: xPosition, yPos: yPosition });
  }
  bodyMovement();
}

let keyPressed = "";

const collisionWithWall = () => {
  playTune(collisionMelody);
  lost = 1;
  clearInterval(game);
  clearInterval(reset);
  lostMsg();
}

const moveForward = () => {
  if(keyPressed === "a"){
    if(getFirst(player).x === 1){
      collisionWithWall();
      return;
    }
    getFirst(player).x -= 1;
    eatFood();
  }
  if(keyPressed === "d"){
    if(getFirst(player).x === 15){
      collisionWithWall();
      return;
    }
    getFirst(player).x += 1;
    eatFood();
  }
  if(keyPressed === "w"){
    if(getFirst(player).y === 3){
      collisionWithWall();
      return;
    }
    getFirst(player).y -= 1;
    eatFood();
  }
  if(keyPressed === "s"){
    if(getFirst(player).y === 17){
      collisionWithWall();
      return;
    }
    getFirst(player).y += 1;
    eatFood();
  }
}

const bodyMovement = () => {
  for(let i=0;i<snake.length;i++){
    let xPos = snake[i].xPos;
    let yPos = snake[i].yPos;
    if(i != 0){
      addSprite(xPos, yPos, back);
    }
  }
}

onInput("a", () => {
  if(keyPressed !== "d"){
    keyPressed = "a";
  }
});

onInput("d", () => {
  if(keyPressed !== "a"){
    keyPressed = "d";
  }
});

onInput("w", () => {
  if(keyPressed !== "s"){
    keyPressed = "w";
  }
});

onInput("s", () => {
  if(keyPressed !== "w"){
    keyPressed = "s";
  }
});
console.log(keyPressed);

const resetGame = () => {
  keyPressed = "";
  
  snake.map((back) => {
    return clearTile(back.xPos, back.yPos);
  })
  clearTile(getFirst(food).x, getFirst(food).y); 
  
  clearText() 
  score = 0; 
  showScore(); 
  
  addSprite(8, 10, player);
  snake = [{ xPos: getFirst(player).x, yPos: getFirst(player).y }];
  addSprite(13, 5, food);

  reset = setInterval(moveForward, 120);
}

onInput("l", () => {
  if(lost === 1){
    resetGame();
    lost = 0;
  }
})

game = setInterval(moveForward, 120);