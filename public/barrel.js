function Barrel(width, height, sprite, x, y) {
   
    var jumpspeed = 0;

    this.spriteLine = 0; 
    this.spriteColumn = 0; 

    this.floor = 0;

    this.sprite = new Image();
    this.sprite.src = sprite;

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

    this.climbSpriteAux = 0;

    this.walk = 0;
    this.active = 0;

    this.update = function() {
        if(this.active == 0)
            return true;

        ctx = dkScenario.context;
        ctx.drawImage(this.sprite,this.spriteLine*256,this.spriteColumn*256,256,256,this.x,this.y,this.width,this.height);
    }

    this.newPos = function() {

        if(this.active == 0)
            return true;

        var posX,posY;

        posY = this.y+this.height - 110;
        posX = this.x - 100 + (this.width/2);

        this.line = Math.floor(((posY)/438)*6);
        this.column = Math.floor(((posX)/600)*10);

        if(this.column == 0 && (this.line == 0 || this.line == 2 || this.line == 4) && posX < 30 && this.speedX < 0 ){
            this.floor = undefined;
        }
        else if(this.column == 9 && (this.line == 1 || this.line == 3) && posX > 570 && this.speedX > 0){
            this.floor = undefined;
        }
        else{
            this.floor = colisionMatrix[this.line][this.column].beam;
            if(this.ladder == undefined)
                this.ladder = colisionMatrix[this.line][this.column].ladder;

            if(this.ladderbelow == undefined && this.line < 5)
                this.ladderbelow = colisionMatrix[this.line+1][this.column].ladder;

        }
        
        if (this.inLadder == 0 && (this.y + this.speedY < this.floor-this.height && this.y + this.speedY > 0) || this.floor == undefined) {
        
            this.gravitySpeed += this.gravity;
            this.y += this.speedY + this.gravitySpeed;

            if(this.jump != 1)
                this.jump = 2;

            this.hitBottom();
        }

        if (this.inLadder == 0 && this.x + this.width + this.speedX < 710 && !(this.x + this.speedX < 185 && this.line == 5)) {
            
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
        else if(this.line == 5 && this.x + this.speedX <= 185){
            this.x = 270;
            this.y = 130;
            this.speedX = 5;
            this.active = 0;
        }

        if(!this.isLadder && this.jump != 1 && this.ladder != undefined && this.x+(this.width/2) > this.ladder.posX && this.x+(this.width/2) < this.ladder.posX+this.ladder.width){
            this.isLadder = true;
        }

        if(this.jump != 1 && this.ladderbelow != undefined && this.y + this.height > this.ladderbelow.baseY-this.ladderbelow.baseY && this.x+(this.width/2) > this.ladderbelow.posX && this.x+(this.width/2) < this.ladderbelow.posX+this.ladderbelow.width){
            this.isLadderbelow = true;            

            if( (Math.floor(Math.random()*10)+1)%3 == 0 && this.line != jumpman.line){
                this.ladderSpeed = 3;
            }
        }

        if(this.jump == 0 && this.isLadder && this.ladderSpeed != 0 && this.ladder != undefined){
            this.walk = 0;

            if(this.ladderSpeed < 0)
                this.climbSpriteAux++;
            else if(this.ladderSpeed > 0)
                this.climbSpriteAux--;

            if(this.climbSpriteAux > 20 || this.climbSpriteAux < -20)
                this.climbSpriteAux = 0;

            this.x = this.ladder.posX - 9;
            this.y += this.ladderSpeed;

            if(this.y < this.ladder.baseY - this.ladder.height - 45)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            updateSprite(this,1);
            this.hitBottom(true);
        }
        else if(this.ladderSpeed > 0 && this.jump == 0 && this.isLadderbelow && this.ladderSpeed != 0 && this.ladderbelow != undefined){
            
            this.walk = 0;

            this.x = this.ladderbelow.posX - 9;
            this.y += this.ladderSpeed;

            if(this.y < this.ladderbelow.baseY - this.ladderbelow.height - 45)
                this.inLadder = 2;
            else
                this.inLadder = 1;

            this.ladder = undefined;

            updateSprite(this,1);
        }

        var colisionX = this.x + (this.width/2);
        var colisionY = this.y + (this.height/2);

        if(jumpman.dead == 0 && colisionX > jumpman.x && colisionX < jumpman.x + jumpman.width && colisionY > jumpman.y && colisionY  < jumpman.y + jumpman.height){
            jumpmanDeath(jumpman);
        }
    } 
    
    this.hitBottom = function(ladderdown) {

        var rockbottom = this.floor - this.height;

        if ( this.y  > rockbottom) {
            this.speedY = 0;
            if(this.column == 0 || this.column == 9 || ladderdown){
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
            this.climbSpriteAux = 0;
            this.walk = 0;
            this.ladderSpeed = 0;
       
        }
    }

    this.pointsTest = function(){
            
        if(jumpman.point == 0 &&this.line == jumpman.line){
            if(jumpman.jump != 0 && (jumpman.x + (jumpman.width/2)) > (this.x + this.width/2) - 5 && (jumpman.x + (jumpman.width/2)) < (this.x + this.width/2) + 5){
                jumpman.point = 1;
                score[nPlayer].incScore(this.x,this.y-5);
            }
        }
    }
    
    function updateSprite(barrel,walk){

        if(walk == 0 && barrel.jump != 2 && barrel.walk % 4 == 0){
            barrel.spriteColumn = 0;
            barrel.spriteLine++;
            if(barrel.spriteLine > 3)
                barrel.spriteLine = 0;
        }
        else if(walk == 1 && barrel.jump != 2){
            barrel.spriteColumn = 1;
            barrel.spriteLine++;
            if(barrel.spriteLine > 1)
                barrel.spriteLine = 0;
        }
    }
}