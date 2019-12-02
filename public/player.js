function Player(width, height, sprite, x, y) {
   
    this.jumpspeed = 0;

    this.spriteLine = 0; 
    this.spriteColumn = 0; 

    this.floor = 0;

    this.sprite = new Image();
    this.sprite.src = sprite;

    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.ladderSpeed = 0;    
    this.x = x;
    this.y = y;

    this.jump = 0;
    this.isLadder = false;
    this.isLadderBelow = false;
    this.inLadder = 0;
    this.ladder = undefined;
    this.ladderbelow = undefined;

    this.gravity = 0.35;
    this.gravitySpeed = 0;

    this.climbSpriteAux = 0;
    this.climbaux;
    this.walkSpriteAux = 0;
    this.climb1 = 0;
    this.climb2 = 0;
    
    this.point = 0;
    this.deadSpriteColumn = 0;
    this.right = true;

    this.update = function() {
        ctx = dkScenario.context;
        ctx.drawImage(this.sprite,this.spriteLine*256,this.spriteColumn*256,256,256,this.x,this.y,this.width,this.height);
    }

    this.newPos = function() {

        var posX,posY;

        posY = this.y+this.height - 110;
        posX = this.x - 100 + (this.width/2);

        this.line = Math.floor(((posY)/438)*6);
        this.column = Math.floor(((posX)/600)*10);

        if(this.column == 0 && (this.line == 0 || this.line == 2 || this.line == 4) && posX < 30){
            this.floor = undefined;
        }
        else if(this.column == 9 && (this.line == 1 || this.line == 3) && posX > 570){
            this.floor = undefined;
        }
        else if(this.line >= 0){
            this.floor = colisionMatrix[this.line][this.column].beam;
            if(this.ladder == undefined)
                this.ladder = colisionMatrix[this.line][this.column].ladder;

            if(this.ladderbelow == undefined && this.line < 5 && colisionMatrix[this.line+1][this.column].ladder != undefined && !colisionMatrix[this.line+1][this.column].ladder.broken)
                this.ladderbelow = colisionMatrix[this.line+1][this.column].ladder;
        }
        else{
            confirmVictory();
        }

        if (this.inLadder == 0 && (this.y + this.speedY < this.floor-this.height && this.y + this.speedY > 0) || this.floor == undefined) {
      
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;
            if(this.jump != 1)
                this.jump = 2;

            updateSprite(this,2,false,this.speedX);
            this.hitBottom();
            this.update();
            updateSprite(this,2,false,this.speedX);
        }

        if (this.inLadder == 0 && this.x + this.width + this.speedX < 710 && this.x + this.speedX > 90) {
            
            if(this.jump == 0){
                this.walkSpriteAux++;
                if(this.walkSpriteAux > 20)
                    this.walkSpriteAux = 0;

                this.x += this.speedX;
                this.jumpspeed = this.speedX;
                this.hitBottom();
            }
            else if(this.jump == 1 || this.floor != undefined){
                if(this.x + this.width > 700){
                    this.jumpspeed = this.jumpspeed*(-1);
                    updateSprite(this,1,true,this.speedX);
                }
                else if(this.x < 100){
                    this.jumpspeed = this.jumpspeed*(-1);
                    updateSprite(this,0,true,this.speedX);
                }
                this.x += this.jumpspeed;
                this.hitBottom();
            }
            else{
                this.jumpspeed = 0;
            }
        }

        if(this.jump != 1 && this.ladder != undefined && this.y + this.height > this.ladder.baseY-this.ladder.baseY && this.x+(this.width/2) > this.ladder.posX && this.x+(this.width/2) < this.ladder.posX+this.ladder.width){
            this.isLadder = true;
        }

        if(this.jump != 1 && this.ladderbelow != undefined && this.y + this.height > this.ladderbelow.baseY-this.ladderbelow.baseY && this.x+(this.width/2) > this.ladderbelow.posX && this.x+(this.width/2) < this.ladderbelow.posX+this.ladderbelow.width){
            this.isLadderBelow = true;
        }
        
        if(this.jump == 0 && this.isLadder && this.ladderSpeed != 0 && this.ladder != undefined && (!this.ladder.broken || this.y + this.ladderSpeed > this.ladder.baseY - this.ladder.height)){
            this.walkSpriteAux = 0;

            if(this.ladderbelow != undefined)
                this.ladder = this.ladderbelow;

            if(this.ladderSpeed < 0)
                this.climbSpriteAux++;
            else if(this.ladderSpeed > 0)
                this.climbSpriteAux--;

            if(this.climbSpriteAux > 20 || this.climbSpriteAux < -20)
                this.climbSpriteAux = 0;

            this.x = this.ladder.posX - 10;
            this.y += this.ladderSpeed;

            if(this.y + this.height < this.ladder.baseY - this.ladder.height)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climbaux = this.climbSpriteAux;

            updateSprite(this,2,false,this.ladderSpeed);

            if(this.y < this.floor - 30)
                this.hitBottom();
        }
        else if(this.ladderSpeed > 0 && this.jump == 0 && this.isLadderBelow && this.ladderSpeed != 0 && this.ladderbelow != undefined){
            this.walkSpriteAux = 0;
            this.climbaux--;

            if(this.climbaux > 20 || this.climbaux < -20)
                this.climbaux = 0;

            this.x = this.ladderbelow.posX - 10;
            this.y += this.ladderSpeed;

            if(this.y + this.height < this.ladderbelow.baseY - this.ladderbelow.height)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.climbSpriteAux = this.climbaux;
            updateSprite(this,2,false,this.ladderSpeed);
        }

    } 
    
    this.hitBottom = function() {
        var rockbottom = this.floor - this.height;

        if ((this.y  < rockbottom && this.jump == 2 && this.column > 0 && this.column < 9)  || this.y  > rockbottom) {

            this.y = rockbottom;
            this.gravitySpeed = 0;
            this.jump = 0;
            this.inLadder = 0;
            this.isLadder = false;
            this.isLadderBelow = false;
            this.ladder = undefined;
            this.ladderbelow = undefined;
            this.climbSpriteAux = 0;
            this.walkSpriteAux = 0;
            this.climb1 = 0;
            this.climb2 = 0; 
            this.point = 0;
            score[nPlayer].score = false;
            updateSprite(this,2,false,0);
        }
    }
}

function updateSprite(player,left,turn,movementType){

    if(turn){
        if(left == 0){
            player.spriteColumn = 0;
            player.right = true;
        }
        else if(left == 1){
            player.spriteColumn = 1;
            player.right = false;
        }
    }

    if(player.jump == 0 && player.climbSpriteAux % 4 == 0 && player.walkSpriteAux % 2 == 0){
        if(movementType <= 0)
            player.spriteLine++;
        else if(movementType > 0)
            player.spriteLine--;
                         
        if(player.spriteColumn == 2 && player.climbSpriteAux == 0)
            player.spriteLine = 4;

        if(player.speedX != 0 && player.spriteLine > 3)
            player.spriteLine = 0;
        else if(player.spriteLine > 4)
            player.spriteLine = 0;

        if(player.inLadder != 0){
            player.spriteColumn = 2;

            if(player.inLadder != 2){
                player.climb1 = 0
                player.climb2 = 0
            }

            if(player.inLadder == 2 && player.climb1 < 3){
                if(movementType < 0){

                    if(player.climb2 == 2){
                        player.climb1 = 0;
                    }

                    if(player.climb1 == 0){
                        player.spriteLine = 2;
                        player.climb1++;
                        player.climb2 = 1;
                    }
                    else if(player.climb1 == 1){
                        player.spriteLine = 3;
                        player.climb1++;
                        player.climb2 = 1;
                    }
                    else if(player.climb1 > 1){
                        player.spriteLine = 4;
                        player.climb2 = 1;            
                    }            
                }
                else if(movementType > 0){

                    if(player.climb2 == 1){
                        player.climb1--;

                        if(player.spriteLine == 4)
                            player.spriteLine = 2;
                    }
                    else if(player.climb1 == 0){
                        player.spriteLine = 3;
                        player.climb1++;
                    }
                    else if(player.climb1 == 1){
                        player.spriteLine = 2;
                        player.climb1++;
                    }
                    else if(player.climb1 > 1 && player.spriteLine != 0 && player.spriteLine != 1){
                        player.spriteLine = 1;
                        player.climb1;
                        player.climb2 = 2;
                    }
                } 
            }
            else if(player.spriteLine > 1){
                player.spriteLine = 0;
            }
            else if(player.spriteLine < 0){
                player.spriteLine = 1;
            }
        }
        else if(player.speedX != 0){
            if(player.spriteLine > 2){
                player.spriteLine = 0;
            }
            else if(player.spriteLine < 0){
                player.spriteLine = 2;
            }
        }
    } 
    else if(player.jump != 0){
        if(player.right)
            player.spriteColumn = 0;
        else
            player.spriteColumn = 1;

        player.spriteLine = 3;
    }
}

function deathAnimation(){

    jumpman.spriteColumn = 3;

    if(jumpman.deadSpriteColumn < 12){
        jumpman.spriteLine++;

        if(jumpman.spriteLine > 3)
            jumpman.spriteLine = 0;

        jumpman.deadSpriteColumn++;
    }
    else{
        jumpman.spriteLine = 4;
        jumpman.deadSpriteColumn++
    }

    if(jumpman.deadSpriteColumn > 20){
        resetPlayer();
    }
}