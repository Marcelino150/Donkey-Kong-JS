function scenario(){
    this.canvas = document.createElement("canvas");
    this.image = new Image();
    this.image.src = background;

    this.start = function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 1000/30);

        window.addEventListener('keydown', function (e) {
            dkScenario.keys = (dkScenario.keys || []);
            if(e.repeat && e.keyCode == 38){
                dkScenario.keys[e.keyCode] = (e.type == null);
            }
            else{
                dkScenario.keys[e.keyCode] = (e.type == "keydown");
            }
        })
        window.addEventListener('keyup', function (e) {
            dkScenario.keys[e.keyCode] = (e.type == "keydown");        
        })
    }

    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    this.updateBackground = function(){
        ctx = dkScenario.context;
        ctx.drawImage(this.image,0,0,800,600,0,0,800,600);
    }

    this.stop = function() {
        clearInterval(this.interval);
    }
}

function updateGameArea() {

    dkScenario.clear();
    dkScenario.updateBackground();
    jumpman.speedX = 0;
    jumpman.ladderSpeed = 0;

    if(jumpman.isLadder){
        jumpman.speedY = 0;
    }

    if (jumpman.y == jumpman.floor - jumpman.height)
        jumpman.speedY = 0;

    if (dkScenario.keys && dkScenario.keys[65] && !jumpman.jump && jumpman.inLadder == 0) {jumpman.speedX = -3; updateSprite(1,true,jumpman.speedX);jumpman.isLadder = jumpman.isLadderbelow = false;}
    if (dkScenario.keys && dkScenario.keys[68] && !jumpman.jump && jumpman.inLadder == 0){jumpman.speedX = 3; updateSprite(0,true,jumpman.speedX);jumpman.isLadder = jumpman.isLadderbelow = false;}
    if (dkScenario.keys && dkScenario.keys[74] && jumpman.inLadder == 0) {jumpman.speedY = -5; updateSprite(2,false,jumpman.speedX);jumpman.jump = 1;jumpman.isLadder = jumpman.isLadderbelow = false;}

    if (dkScenario.keys && dkScenario.keys[83] && (jumpman.isLadderbelow || jumpman.inLadder != 0)) {jumpman.ladderSpeed = 1;jumpman.inLadder = 1;}
    if (dkScenario.keys && dkScenario.keys[87] && (jumpman.isLadder || jumpman.inLadder != 0)) {jumpman.ladderSpeed = -1;jumpman.inLadder = 1;};

    for(var i = 0; i < 5; i++){
        barrel[i].newPos();
        barrel[i].update();
    }

    jumpman.newPos();    
    jumpman.update();

    //boundBox();
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

    dkScenario.context;
    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.rect(barrel.x, barrel.y, barrel.width, barrel.height);
    ctx.stroke();
}