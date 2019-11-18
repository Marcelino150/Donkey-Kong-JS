            var jumpman;
            var dkScenario;
            var jumpmanSpriteSheet = "images/sprites/jumpmanSpriteSheet.png"
            var background = "images/bg/dkBackground.png";

            function startGame() {
                jumpman = new character(37, 40, jumpmanSpriteSheet, 203, 470,"image");
                jumpman2 = new character(37, 40, jumpmanSpriteSheet, 203, 470,"image");
                dkScenario = new scenario();
                dkScenario.start();
            }

            function updateGameArea() {

                dkScenario.clear();
                dkScenario.updateBackground();
                jumpman.speedX = 0;
                jumpman.ladderSpeed = 0;
            
                if(ladder){
                    jumpman.speedY = 0;
                }
            
                if (jumpman.y == jumpman.floor - jumpman.height)
                    jumpman.speedY = 0;
            
                if (dkScenario.keys && dkScenario.keys[65] && !jumpman.jump && !inLadder) {jumpman.speedX = -3; updateSprite(1,true);}
                if (dkScenario.keys && dkScenario.keys[68] && !jumpman.jump && !inLadder){jumpman.speedX = 3; updateSprite(0,true);}
                if (dkScenario.keys && dkScenario.keys[74] && !inLadder) {jumpman.speedY = -5; updateSprite(2,false);jumpman.jump = true;}
            
                if (dkScenario.keys && dkScenario.keys[83]) {jumpman.ladderSpeed = 2;}
                if (dkScenario.keys && dkScenario.keys[87] && ladder) {jumpman.ladderSpeed = -2;inLadder = true};
            
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
                    }
                }
            }