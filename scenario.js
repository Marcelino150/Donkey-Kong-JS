var ladderi = 580;
var ladderh = 41;
var ladderw = 38;
var ladderb = 528;
var ladder = false;
var inLadder = false;
var colisionMatrix = [];

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
}