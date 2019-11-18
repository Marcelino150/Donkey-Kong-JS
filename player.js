            var direction = true;
            var posY = 0,baseY = 0;

            function character(width, height, color, x, y,type) {
   
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

                this.gravity = 0.35;
                this.gravitySpeed = 0;

                this.update = function() {
                    ctx = dkScenario.context;
                    ctx.drawImage(this.image,this.i*256,this.j*256,256,256,this.x,this.y,this.width,this.height);
                }

                this.newPos = function() {

                    var posX,posY;

                    posY = this.y+jumpman.height - 110;
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
                    }

                    if (!inLadder && (this.y + this.speedY < this.floor-jumpman.height && this.y + this.speedY > 0) || this.floor == undefined) {
                  
                        this.gravitySpeed += this.gravity;
                        this.y += this.speedY + this.gravitySpeed;
                        if(this.jump != 1)
                            this.jump = 2;

                        updateSprite(2,false);
                        this.hitBottom();
                    }
                    if (!inLadder && this.x + jumpman.width + this.speedX < 710 && this.x + this.speedX > 90) {
                        if(this.jump == 0){
                            this.x += this.speedX;
                            jumpspeed = this.speedX;
                            this.hitBottom();
                        }
                        else if(this.jump == 1 || this.floor != undefined){
                            if(this.x + this.width > 700){
                                jumpspeed = jumpspeed*(-1);
                                updateSprite(1,true);
                            }
                            else if(this.x < 100){
                                jumpspeed = jumpspeed*(-1);
                                updateSprite(0,true);
                            }
                            this.x += jumpspeed;
                            this.hitBottom();
                        }
                        else{
                            jumpspeed = 0;
                        }
                    }

                    if(this.y + this.height > ladderb-ladderh && this.x+(this.width/2) > ladderi && this.x+(this.width/2) < ladderi+ladderw){
                        ladder = true;
                    }

                    if(inLadder){
                        this.x = ladderi - 10;
                        this.y += this.ladderSpeed;
                        this.hitBottom();
                    }
                } 
                
                this.hitBottom = function() {
                    var rockbottom = this.floor - this.height;

                    if (this.y  > rockbottom) {
                        this.y = rockbottom;
                        this.gravitySpeed = 0;
                        this.jump = 0;
                        inLadder = false;
                        ladder = false;
                        ladderSpeed = 0;
                        updateSprite(2,false);
                    }
                }   
            }

            function updateSprite(left,turn){    

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

                if(!jumpman.jump){
                    jumpman.i++;

                    if(jumpman.i>2)
                        jumpman.i = 0;
                }
                else{
                    jumpman.i = 3;
                }
            }