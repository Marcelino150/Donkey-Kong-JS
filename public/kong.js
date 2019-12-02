function Kong(width, height, sprite, x, y) {

    this.spriteLine = 1; 
    this.spriteColumn = 0; 

    this.sprite = new Image();
    this.sprite.src = sprite;

    this.width = width;
    this.height = height;  
    this.x = x;
    this.y = y;

    this.drop = 0;

    this.update = function() {
        ctx = dkScenario.context;
        ctx.drawImage(this.sprite,this.spriteLine*256,this.spriteColumn*256,256,256,this.x,this.y,this.width,this.height);
    }

    this.dropBarrel = function(){

        this.spriteLine++;

        if(this.drop == 1){
            this.spriteLine = 0;
            this.spriteColumn = 1;
            this.drop = 2;
        }

        if(this.spriteLine > 2){
            if(this.drop == 2){
                this.drop = 0;
                this.spriteColumn = 0;
            }
            else{
                this.drop = 1;
            }

            this.spriteLine = 0;        
        }

        if(this.drop == 2 && this.spriteLine == 2 && this.spriteColumn == 1){
            for(var spriteLine = 0; spriteLine < 6; spriteLine++){
                if(barrel[spriteLine].active == 0){
                    barrel[spriteLine].active = 1;
                    break; 
                }
            }
        }
    }
}