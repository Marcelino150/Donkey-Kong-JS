var jumpman = [];
var barrel = [];
var dkScenario;
var jumpmanSpriteSheet = "images/sprites/jumpmanSpriteSheet.png"
var barrelSpriteSheet = "images/sprites/barrelSpriteSheet.png"
var dkSpriteSheet = "images/sprites/dkSpriteSheet.png"
var background = "images/bg/dkBackground.png";
var mapSprite = "images/map/map.png";
var p1Sprite = "images/map/player1.png";
var p2Sprite = "images/map/player2.png";
var peachSpriteSheet = "images/sprites/peachSpriteSheet.png";
var flameBarrelpriteSheet = "images/sprites/flameBarrelSpriteSheet.png";
var peach;
var flameBarrel;
var colisionMatrix = [];
var posY = 0,baseY = 0;
var points = 0;
var score = [];
var playerPontuation = [0,0];
var lifesHUD1;
var lifesHUD2;
var life = [3,3];
var map;
var kongInterval;
var nPlayers = 1;
var lastY = 0;
var nPlayer = 0;
var elementsInterval;
var death;

function startGame() {

    score[0] = new Score(625,60);
    score[1] = new Score(625,110);

    lifesHUD1 = new Lifes(720,60);
    lifesHUD2 = new Lifes(720,110);

    dk = new Kong(99,99,dkSpriteSheet,170,62);
    jumpman = new Player(37, 40, jumpmanSpriteSheet, 520, 470);

    map = new Map(40,70);
    peach = new Peach(275,68);
    flameBarrel = new FlameBarrel(153,485);

    dkScenario = new Scenario();
    dkScenario.start();

    barrel[0] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);
    barrel[1] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);
    barrel[2] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);
    barrel[3] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);
    barrel[4] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);
    barrel[5] = new Barrel(38, 32, barrelSpriteSheet, 270, 130);

    dkScenario.startInterval();
    kongInterval = setInterval(kongUpdate,500);
    elementsInterval = setInterval(updateElements,1000);
    createColision();
}

function updatePlayerPosition(){

    if(jumpman.y != lastY){
        $.ajax({url: "/updatePlayer", type: "POST", data: {p: nPlayer, y: jumpman.y}});
        lastY = jumpman.y;
    }
}

function updatePlayers(){

    $.ajax({url: "/getN", type: "POST", data: {player: nPlayer, score: playerPontuation[nPlayer], life: life[nPlayer]}, success: function(result){
        
        nPlayers = result.n;

        if(nPlayer == 0){

            if(result.pontuation2 == undefined || result.life2 == undefined){
                playerPontuation[1] = 0;
                life[1] = 3;
            }
            else{
                playerPontuation[1] = result.pontuation2;
                life[1] = result.life2;
            }             
        }
        else if(nPlayer == 1){
            if(result.pontuation1 == undefined || result.life1 == undefined){
                playerPontuation[0] = 0;
                life[0] = 3;
            }
            else{
                playerPontuation[0] = result.pontuation1;
                life[0] = result.life1;
            }
        }
    }});

    if(nPlayer != undefined && nPlayer != 0)
        $.ajax({url: "/getPlayer"+1, type: "POST", success: function(result){

            if(result != undefined && result.y != undefined){
                map.player2Y = result.y;
            }
            
        }});

    if(nPlayer != undefined && nPlayer != 1)
        $.ajax({url: "/getPlayer"+2, type: "POST", success: function(result){

            if(result != undefined && result.y != undefined){
                map.player2Y = result.y;
            }
            
        }});
}

function updateGameArea() {

    dkScenario.updateBackground();
    ctx = dkScenario.context;

    if(nPlayer == 0){
        ctx.fillStyle = "red";
        ctx.font = "17px dkfont";
        ctx.fillText(1,575,60);

        ctx.fillStyle = "green";
        ctx.font = "17px dkfont";
        ctx.fillText(2,575,110);
    }
    else{
        ctx.fillStyle = "green";
        ctx.font = "17px dkfont";
        ctx.fillText(1,575,60);

        ctx.fillStyle = "red";
        ctx.font = "17px dkfont";
        ctx.fillText(2,575,110);
    }

    jumpman.speedX = 0;
    jumpman.ladderSpeed = 0;

    if(jumpman.isLadder){
        jumpman.speedY = 0;
    }

    if (jumpman.y == jumpman.floor - jumpman.height)
        jumpman.speedY = 0;

    if (jumpman.dead == 0 && dkScenario.keys && dkScenario.keys[65] && !jumpman.jump && jumpman.inLadder == 0) {jumpman.speedX = -3; updateSprite(jumpman,1,true,jumpman.speedX);jumpman.isLadder = jumpman.isLadderbelow = false;}
    if (jumpman.dead == 0 && dkScenario.keys && dkScenario.keys[68] && !jumpman.jump && jumpman.inLadder == 0){jumpman.speedX = 3; updateSprite(jumpman,0,true,jumpman.speedX);jumpman.isLadder = jumpman.isLadderbelow = false;}
    if (jumpman.dead == 0 && dkScenario.keys && dkScenario.keys[74] && jumpman.inLadder == 0) {jumpman.speedY = -5; updateSprite(jumpman,2,false,jumpman.speedX);jumpman.jump = 1;jumpman.isLadder = jumpman.isLadderbelow = false;}

    if (jumpman.dead == 0 && dkScenario.keys && dkScenario.keys[83] && (jumpman.isLadderbelow || jumpman.inLadder != 0)) {jumpman.ladderSpeed = 1;jumpman.inLadder = 1;}
    if (jumpman.dead == 0 && dkScenario.keys && dkScenario.keys[87] && (jumpman.isLadder || jumpman.inLadder != 0)) {jumpman.ladderSpeed = -1;jumpman.inLadder = 1;};

    dk.update();
    score[0].update(playerPontuation[0]);
    score[1].update(playerPontuation[1]);

    map.player1Y = jumpman.y;
    lifesHUD1.update(life[0]);
    lifesHUD2.update(life[1]);
    map.update();
    peach.update();
    flameBarrel.update();

    for(var i = 0; i < 5; i++){

        if(jumpman.dead == 0){
            barrel[i].newPos();
            barrel[i].pointsTest();
        }
        barrel[i].update();
    }

    jumpman.newPos();    
    jumpman.update();

    updatePlayerPosition();
}

function kongUpdate(){
    dk.dropBarrel();
}

function jumpmanDeath(player){
    player.dead = 1;
    jumpman.jumpspeed = 0;
    clearInterval(kongInterval);
    clearInterval(elementsInterval);
    death = setInterval(deathAnimation,150);
    life[nPlayer]--;
}

function confirmVictory(){
    dkScenario.stop();
    screen = 2;
    menuInterval = setInterval(updateMenu,20);
}

function resetPlayer(){

    if(life[nPlayer] == 0){comfirmLose();}
    
    clearInterval(death);

    kongInterval = setInterval(kongUpdate,500);
    elementsInterval = setInterval(updateElements,1000); 

    resetPositions();
}

function comfirmLose(){
    dkScenario.stop();
    screen = 3;
    menuInterval = setInterval(updateMenu,20);
}

function resetPositions(){

    jumpman.x = 520;
    jumpman.y = 470;
    jumpman.i = jumpman.j = 0;
    jumpman.jump = 0;
    jumpman.dead = 0;
    jumpman.inLadder = false;
    jumpman.right = true;

    dk.i = dk.j = 0; 

    for(var i = 0; i < 6; i++){
        barrel[i].x = 270;
        barrel[i].y = 130;
        barrel[i].active = 0;
        barrel[i].speedX = 5;
        barrel[i].speedY = 0;
        barrel[i].jump = 0;
        barrel[i].inLadder = false;
        barrel[i].isLadderbelow = false;
    }
}

function restart(){

    resetPositions();

    life[0] = 3;
    life[1] = 3;
    playerPontuation[0] = 0;
    playerPontuation[1] = 0;
}

function Score(x,y){

    this.scoreX = x;
    this.scoreY = y;
    this.x = 0;
    this.y = 0;
    this.points = 0;
    this.score = false;
    this.points;
    this.points = 100;

    var stringPontuation;

    this.incScore = function(x,y){
        this.x = x;
        this.y = y;
        this.score = true;
        playerPontuation[nPlayer] += this.points;
    }

    this.update = function(pontuation){
        if(pontuation != undefined){
            stringPontuation = pontuation.toString();

            while(stringPontuation.length < 4)
                stringPontuation = "0"+stringPontuation;

            if(this.score && this == score[nPlayer]){
                ctx.fillStyle = "white";
                ctx.font = "11px dkfont";
                ctx.fillText(this.points,this.x,this.y);
            }

            ctx.fillStyle = "white";
            ctx.font = "17px dkfont";
            ctx.fillText(stringPontuation,this.scoreX,this.scoreY);
        }
    }
}

function Lifes(x,y){

    this.lifesX = x;
    this.lifesY = y;

    this.update = function(nlifes){
        ctx.fillStyle = "white";
        ctx.font = "17px dkfont";
        ctx.fillText(nlifes,this.lifesX,this.lifesY);
    }
}

function Peach(x,y){

    this.positionX = x;
    this.positionY = y;

    this.sprite = new Image();
    this.sprite.src = peachSpriteSheet;

    var i = 0;

    this.update = function(){
        ctx.drawImage(this.sprite,i*256,0,256,256,this.positionX,this.positionY,56,56);
    }

    this.changeSprite = function(){
        i++;
        if(i > 1)
            i = 0;
    }
}

function FlameBarrel(x,y){

    this.positionX = x;
    this.positionY = y;

    this.sprite = new Image();
    this.sprite.src = flameBarrelpriteSheet;

    var i = 0;

    this.update = function(){
        ctx.drawImage(this.sprite,i*256,0,256,256,this.positionX,this.positionY,56,56);
    }

    this.changeSprite = function(){
        i++;
        if(i > 1)
            i = 0;
    }
}

function updateElements(){
    peach.changeSprite();
    flameBarrel.changeSprite();
}

function Map(x,y){

    this.positionX = x;
    this.positionY = y;

    this.map = new Image();
    this.map.src = mapSprite;

    this.player1 = new Image();
    this.player1.src = p1Sprite;
    this.player1Y = y + 430;

    this.player2 = new Image();
    this.player2.src = p2Sprite;
    this.player2Y = y + 430;

    this.update = function(){
        ctx.drawImage(this.map,0,0,30,480,this.positionX,this.positionY,30,480);

        if(nPlayers == 2)
            ctx.drawImage(this.player2,0,0,256,256,this.positionX,this.player2Y,30,30);

        ctx.drawImage(this.player1,0,0,256,256,this.positionX,this.player1Y,30,30);
    }
}

function boundBox(){

    for(var i = 0; i < 10; i++){
        for(var j = 0; j < 6; j++){
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.rect(100 + (i*60), 110 + (j*73), 60, 73);
            ctx.stroke();

            if(colisionMatrix[j][i].ladder != undefined){
                ctx.beginPath();
                ctx.strokeStyle = "red";
                ctx.rect(colisionMatrix[j][i].ladder.posX, colisionMatrix[j][i].ladder.baseY-colisionMatrix[j][i].ladder.height, colisionMatrix[j][i].ladder.width, colisionMatrix[j][i].ladder.height);
                ctx.stroke();
            }
        }
    }

    dkScenario.context;
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.rect(jumpman.x, jumpman.y, jumpman.width, jumpman.height);
    ctx.stroke();

    for(var i = 0; i < 6; i ++){
        dkScenario.context;
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.rect(barrel[i].x, barrel[i].y, barrel[i].width, barrel[i].height);
        ctx.stroke();
    }
}

function createColision(){

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
}