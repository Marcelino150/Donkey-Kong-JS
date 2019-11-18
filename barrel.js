function barrel(width, height, color, x, y) {
   
    var jumpspeed = 0;

    this.i = 0; 
    this.j = 0; 
    this.k = 0;

    this.floor = 0;

    this.image = new Image();
    this.image.src = color;

    this.gamearea = dkScenario;
    this.width = width;
    this.height = height;
    this.speedX = 5;
    this.speedY = 0;
    this.ladderSpeed = 0;    
    this.x = x;
    this.y = y;

    this.jump = 0;
    this.isLadder = false;
    this.isLadderbelow = false;
    this.inLadder = 0;
    this.ladder = undefined;
    this.ladderbelow = undefined;

    this.gravity = 0.35;
    this.gravitySpeed = 0;

    this.climb = 0;
    this.climbaux = 0;
    this.walk = 0;
    this.climba = 0;

    this.update = function() {
        ctx = dkScenario.context;
        ctx.drawImage(this.image,this.i*256,this.j*256,256,256,this.x,this.y,this.width,this.height);
    }

    this.newPos = function() {

        var posX,posY;

        posY = this.y+this.height - 110;
        posX = this.x - 100 + (this.width/2);

        line = Math.floor(((posY)/438)*6);
        column = Math.floor(((posX)/600)*10);

        if(column == 0 && (line == 0 || line == 2 || line == 4) && posX < 30 && this.speedX < 0 ){
            this.floor = undefined;
        }
        else if(column == 9 && (line == 1 || line == 3) && posX > 570 && this.speedX > 0){
            this.floor = undefined;
        }
        else{
            this.floor = colisionMatrix[line][column].beam;
            if(this.ladder == undefined)
                this.ladder = colisionMatrix[line][column].ladder;

            if(this.ladderbelow == undefined && line < 5)
                this.ladderbelow = colisionMatrix[line+1][column].ladder;

        }
        
        if (this.inLadder == 0 && (this.y + this.speedY < this.floor-this.height && this.y + this.speedY > 0) || this.floor == undefined) {
        
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;

            if(this.jump != 1)
                this.jump = 2;

            this.hitBottom();
        }

        if (this.inLadder == 0 && this.x + this.width + this.speedX < 710 && this.x + this.speedX > 90) {
            
            updateSprite(this,0);

            if(this.jump == 0){
                this.walk++;
                if(this.walk > 20)
                    this.walk = 0;

                this.x += this.speedX;
                jumpspeed = this.speedX;
                this.hitBottom();
            }
            else if(this.jump == 1 || this.floor != undefined){
                if(this.x + this.width > 700){
                    jumpspeed = jumpspeed*(-1);
                }
                else if(this.x < 100){
                    jumpspeed = jumpspeed*(-1);
                }
                this.x += jumpspeed;
                this.hitBottom();
            }
            else{
                jumpspeed = 0;
            }
        }
        else if(this.x + this.speedX <= 90){
            
            this.x = 203;
            this.y = 130;
            this.speedX = 5;
        }

        if(!this.isLadder && this.jump != 1 && this.ladder != undefined && this.x+(this.width/2) > this.ladder.posX && this.x+(this.width/2) < this.ladder.posX+this.ladder.width){
            this.isLadder = true;
        }

        if(this.jump != 1 && this.ladderbelow != undefined && this.y + this.height > this.ladderbelow.baseY-this.ladderbelow.baseY && this.x+(this.width/2) > this.ladderbelow.posX && this.x+(this.width/2) < this.ladderbelow.posX+this.ladderbelow.width){
            this.isLadderbelow = true;
            if( Math.round(Math.random()) == 1)
                this.ladderSpeed = 3;
        }

        if(this.jump == 0 && this.isLadder && this.ladderSpeed != 0 && this.ladder != undefined){
            this.walk = 0;

            if(this.ladderSpeed < 0)
                this.climb++;
            else if(this.ladderSpeed > 0)
                this.climb--;

            if(this.climb > 20 || this.climb < -20)
                this.climb = 0;

            this.x = this.ladder.posX - 9;
            this.y += this.ladderSpeed;

            if(this.y < this.ladder.baseY - this.ladder.height - 45)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climbaux = this.climb;

            updateSprite(this,1);
            this.hitBottom(true);
        }
        else if(this.ladderSpeed > 0 && this.jump == 0 && this.isLadderbelow && this.ladderSpeed != 0 && this.ladderbelow != undefined){
            
            this.walk = 0;
            this.climbaux--;

            if(this.climbaux > 20 || this.climbaux < -20)
                this.climbaux = 0;

            this.x = this.ladderbelow.posX - 9;
            this.y += this.ladderSpeed;

            if(this.y < this.ladderbelow.baseY - this.ladderbelow.height - 45)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climb = this.climbaux;

            this.ladder = undefined;

            updateSprite(this,1);
        }

        var colisionX = this.x + (this.width/2);
        var colisionY = this.y + (this.height/2);

        if(colisionX > jumpman.x && colisionX < jumpman.x + jumpman.width && colisionY > jumpman.y && colisionY  < jumpman.y + jumpman.height){
            console.log("rip");
        }
    } 
    
    this.hitBottom = function(ladderdown) {
        var rockbottom = this.floor - this.height;

        if ( this.y  > rockbottom) {
            this.speedY = 0;
            if(column == 0 || column == 9 || ladderdown){
                this.speedX = this.speedX * (-1);
                if(!this.inLadder)
                    this.speedY = -2;
            }   

            this.y = rockbottom;
            this.gravitySpeed = 0;
            this.jump = 0;
            this.inLadder = 0;
            this.isLadder = false;
            this.isLadderbelow = false;
            this.ladder = undefined;
            this.ladderbelow = undefined;
            this.climb = 0;
            this.walk = 0;
            this.climba = 0;
            this.ladderSpeed = 0;
       
        }
    }
    
    function updateSprite(barrel,walk){

        if(walk == 0 && barrel.jump != 2 && barrel.walk % 4 == 0){
            barrel.j = 0;
            barrel.i++;
            if(barrel.i > 3)
                barrel.i = 0;
        }
        else if(walk == 1 && barrel.jump != 2){
            barrel.j = 1;
            barrel.i++;
            if(barrel.i > 1)
                barrel.i = 0;
        }
    }
}