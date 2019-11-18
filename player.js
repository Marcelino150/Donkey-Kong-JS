function player(width, height, color, x, y) {
   
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
    this.speedX = 0;
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
    this.climbaux;
    this.walk = 0;
    this.climba = 0;
    this.climbe = 0; 

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

        if(column == 0 && (line == 0 || line == 2 || line == 4) && posX < 30){
            this.floor = undefined;
        }
        else if(column == 9 && (line == 1 || line == 3) && posX > 570){
            this.floor = undefined;
        }
        else{
            this.floor = colisionMatrix[line][column].beam;
            if(this.ladder == undefined)
                this.ladder = colisionMatrix[line][column].ladder;

            if(this.ladderbelow == undefined && line < 5 && colisionMatrix[line+1][column].ladder != undefined && !colisionMatrix[line+1][column].ladder.broken)
                this.ladderbelow = colisionMatrix[line+1][column].ladder;
        }

        if (this.inLadder == 0 && (this.y + this.speedY < this.floor-this.height && this.y + this.speedY > 0) || this.floor == undefined) {
      
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;
            if(this.jump != 1)
                this.jump = 2;

            updateSprite(2,false,this.speedX);
            this.hitBottom();
            this.update();
            updateSprite(2,false,this.speedX);
        }

        if (this.inLadder == 0 && this.x + this.width + this.speedX < 710 && this.x + this.speedX > 90) {
            
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
                    updateSprite(1,true,this.speedX);
                }
                else if(this.x < 100){
                    jumpspeed = jumpspeed*(-1);
                    updateSprite(0,true,this.speedX);
                }
                this.x += jumpspeed;
                this.hitBottom();
            }
            else{
                jumpspeed = 0;
            }
        }

        if(this.jump != 1 && this.ladder != undefined && this.y + this.height > this.ladder.baseY-this.ladder.baseY && this.x+(this.width/2) > this.ladder.posX && this.x+(this.width/2) < this.ladder.posX+this.ladder.width){
            this.isLadder = true;
        }

        if(this.jump != 1 && this.ladderbelow != undefined && this.y + this.height > this.ladderbelow.baseY-this.ladderbelow.baseY && this.x+(this.width/2) > this.ladderbelow.posX && this.x+(this.width/2) < this.ladderbelow.posX+this.ladderbelow.width){
            this.isLadderbelow = true;
        }
        
        if(this.jump == 0 && this.isLadder && this.ladderSpeed != 0 && this.ladder != undefined && (!this.ladder.broken || this.y + this.ladderSpeed > this.ladder.baseY - this.ladder.height)){
            this.walk = 0;

            if(this.ladderbelow != undefined)
                this.ladder = this.ladderbelow;

            if(this.ladderSpeed < 0)
                this.climb++;
            else if(this.ladderSpeed > 0)
                this.climb--;

            if(this.climb > 20 || this.climb < -20)
                this.climb = 0;

            this.x = this.ladder.posX - 10;
            this.y += this.ladderSpeed;

            if(this.y + this.height < this.ladder.baseY - this.ladder.height)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climbaux = this.climb;

            updateSprite(2,false,this.ladderSpeed);

            if(this.y < this.floor - 30)
                this.hitBottom();
        }
        else if(this.ladderSpeed > 0 && this.jump == 0 && this.isLadderbelow && this.ladderSpeed != 0 && this.ladderbelow != undefined){
            this.walk = 0;
            this.climbaux--;

            if(this.climbaux > 20 || this.climbaux < -20)
                this.climbaux = 0;

            this.x = this.ladderbelow.posX - 10;
            this.y += this.ladderSpeed;

            if(this.y + this.height < this.ladderbelow.baseY - this.ladderbelow.height)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climb = this.climbaux;
            updateSprite(2,false,this.ladderSpeed);
        }

    } 
    
    this.hitBottom = function() {
        var rockbottom = this.floor - this.height;

        if ((this.y  < rockbottom && this.jump == 2 && column > 0 && column < 9)  || this.y  > rockbottom) {

            count = 0;
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
            this.climbe = 0; 
            updateSprite(2,false,0);
        }
    }   
}

function updateSprite(left,turn,movement){

    if(turn){
        if(left == 0){
            jumpman.j = 0;
            direction = true;
        }
        else if(left == 1){
            jumpman.j = 1;
            direction = false;
        }
    }

    if(jumpman.jump == 0 && jumpman.climb % 4 == 0 && jumpman.walk % 2 == 0){
        if(movement <= 0)
            jumpman.i++;
        else if(movement > 0)
            jumpman.i--;
                         
        if(jumpman.j == 2 && jumpman.climb == 0)
            jumpman.i = 4;

        if(jumpman.speedX != 0 && jumpman.i > 3)
            jumpman.i = 0;
        else if(jumpman.i > 4)
            jumpman.i = 0;

        if(jumpman.inLadder != 0){
            jumpman.j = 2;

            teste = jumpman.climba;
            if(jumpman.inLadder != 2){
                jumpman.climba = 0
                jumpman.climbe = 0
            }

            if(jumpman.inLadder == 2 && jumpman.climba < 3){
                if(movement < 0){

                    if(jumpman.climbe == 2){
                        jumpman.climba = 0;
                    }

                    if(jumpman.climba == 0){
                        jumpman.i = 2;
                        jumpman.climba++;
                        jumpman.climbe = 1;
                    }
                    else if(jumpman.climba == 1){
                        jumpman.i = 3;
                        jumpman.climba++;
                        jumpman.climbe = 1;
                    }
                    else if(jumpman.climba > 1){
                        jumpman.i = 4;
                        jumpman.climbe = 1;            
                    }            
                }
                else if(movement > 0){

                    if(jumpman.climbe == 1){
                        jumpman.climba--;

                        if(jumpman.i == 4)
                            jumpman.i = 2;
                    }
                    else if(jumpman.climba == 0){
                        jumpman.i = 3;
                        jumpman.climba++;
                    }
                    else if(jumpman.climba == 1){
                        jumpman.i = 2;
                        jumpman.climba++;
                    }
                    else if(jumpman.climba > 1 && jumpman.i != 0 && jumpman.i != 1){
                        jumpman.i = 1;
                        jumpman.climba;
                        jumpman.climbe = 2;
                    }
                } 
            }
            else if(jumpman.i > 1){
                jumpman.i = 0;
            }
            else if(jumpman.i < 0){
                jumpman.i = 1;
            }
        }
        else if(jumpman.speedX != 0){
            if(jumpman.i > 2){
                jumpman.i = 0;
            }
            else if(jumpman.i < 0){
                jumpman.i = 2;
            }
        }
    } 
    else if(jumpman.jump != 0){
        if(direction)
            jumpman.j = 0;
        else
            jumpman.j = 1;

        jumpman.i = 3;
    }
}