var jumpman;
var barrels = [];
var dkScenario;
var jumpmanSpriteSheet = "images/sprites/jumpmanSpriteSheet.png"
var barrelSpriteSheet = "images/sprites/barrelSpriteSheet.png"
var background = "images/bg/dkBackground.png";
var direction = true;
var colisionMatrix = [];
var posY = 0,baseY = 0;

for(var i = 0; i < 6; i++){
    colisionMatrix[i] = [];
    for(var j = 0; j < 10; j++)
        colisionMatrix[i][j] = {};
}

for(var column = 0; column < 10; column++){
    if(column > 4){
        baseY += 3;
    }

    if(column < 9){
        colisionMatrix[0][column].beam = 161+baseY;
        colisionMatrix[2][column].beam = 302+posY;
        colisionMatrix[4][column].beam = 451+posY;
    }

    if(column > 0){
        colisionMatrix[1][column].beam = 248-posY;
        colisionMatrix[3][column].beam = 398-posY;
    }

    colisionMatrix[5][column].beam = 541-baseY; 
    posY += 2;
}

colisionMatrix[5][8].ladder = {};
colisionMatrix[5][8].ladder.posX = 580;
colisionMatrix[5][8].ladder.baseY = 528;
colisionMatrix[5][8].ladder.width = 20;
colisionMatrix[5][8].ladder.height = 42;
colisionMatrix[5][8].ladder.broken = false;

colisionMatrix[4][4].ladder = {};
colisionMatrix[4][4].ladder.posX = 360;
colisionMatrix[4][4].ladder.baseY = 458;
colisionMatrix[4][4].ladder.width = 20;
colisionMatrix[4][4].ladder.height = 48;
colisionMatrix[4][4].ladder.broken = false;

colisionMatrix[5][3].ladder = {};
colisionMatrix[5][3].ladder.posX = 320;
colisionMatrix[5][3].ladder.baseY = 540;
colisionMatrix[5][3].ladder.width = 20;
colisionMatrix[5][3].ladder.height = 63;
colisionMatrix[5][3].ladder.broken = true;

colisionMatrix[4][1].ladder = {};
colisionMatrix[4][1].ladder.posX = 201;
colisionMatrix[4][1].ladder.baseY = 452;
colisionMatrix[4][1].ladder.width = 20;
colisionMatrix[4][1].ladder.height = 37;
colisionMatrix[4][1].ladder.broken = false;

colisionMatrix[3][3].ladder = {};
colisionMatrix[3][3].ladder.posX = 280;
colisionMatrix[3][3].ladder.baseY = 391;
colisionMatrix[3][3].ladder.width = 20;
colisionMatrix[3][3].ladder.height = 63;
colisionMatrix[3][3].ladder.broken = true;

colisionMatrix[3][5].ladder = {};
colisionMatrix[3][5].ladder.posX = 400;
colisionMatrix[3][5].ladder.baseY = 387;
colisionMatrix[3][5].ladder.width = 20;
colisionMatrix[3][5].ladder.height = 55;
colisionMatrix[3][5].ladder.broken = false;

colisionMatrix[3][8].ladder = {};
colisionMatrix[3][8].ladder.posX = 580;
colisionMatrix[3][8].ladder.baseY = 381;
colisionMatrix[3][8].ladder.width = 20;
colisionMatrix[3][8].ladder.height = 43;
colisionMatrix[3][8].ladder.broken = false;

colisionMatrix[2][7].ladder = {};
colisionMatrix[2][7].ladder.posX = 540;
colisionMatrix[2][7].ladder.baseY = 315;
colisionMatrix[2][7].ladder.width = 20;
colisionMatrix[2][7].ladder.height = 61;
colisionMatrix[2][7].ladder.broken = true;

colisionMatrix[2][3].ladder = {};
colisionMatrix[2][3].ladder.posX = 301;
colisionMatrix[2][3].ladder.baseY = 307;
colisionMatrix[2][3].ladder.width = 20;
colisionMatrix[2][3].ladder.height = 45;
colisionMatrix[2][3].ladder.broken = false;

colisionMatrix[2][1].ladder = {};
colisionMatrix[2][1].ladder.posX = 201;
colisionMatrix[2][1].ladder.baseY = 303;
colisionMatrix[2][1].ladder.width = 20;
colisionMatrix[2][1].ladder.height = 37;
colisionMatrix[2][1].ladder.broken = false;

colisionMatrix[1][4].ladder = {};
colisionMatrix[1][4].ladder.posX = 340;
colisionMatrix[1][4].ladder.baseY = 239;
colisionMatrix[1][4].ladder.width = 20;
colisionMatrix[1][4].ladder.height = 58;
colisionMatrix[1][4].ladder.broken = true;

colisionMatrix[1][8].ladder = {};
colisionMatrix[1][8].ladder.posX = 580;
colisionMatrix[1][8].ladder.baseY = 231;
colisionMatrix[1][8].ladder.width = 20;
colisionMatrix[1][8].ladder.height = 38;
colisionMatrix[1][8].ladder.broken = false;

colisionMatrix[0][5].ladder = {};
colisionMatrix[0][5].ladder.posX = 440;
colisionMatrix[0][5].ladder.baseY = 163;
colisionMatrix[0][5].ladder.width = 20;
colisionMatrix[0][5].ladder.height = 42;
colisionMatrix[0][5].ladder.broken = false;

var barrelCount = 0;
var minutes;

function startGame() {
    jumpman = new player(37, 40, jumpmanSpriteSheet, 520, 470);

    dkScenario = new scenario();
    dkScenario.start();

    barrel[0] = new barrel(38, 32, barrelSpriteSheet, 203, 150);
    barrel[1] = new barrel(38, 32, barrelSpriteSheet, 203, 150);
    barrel[2] = new barrel(38, 32, barrelSpriteSheet, 203, 150);
    barrel[3] = new barrel(38, 32, barrelSpriteSheet, 203, 150);
    barrel[4] = new barrel(38, 32, barrelSpriteSheet, 203, 150);
    
}