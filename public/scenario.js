var keydown = 0;
var lastkeydown = 0;

function Scenario(){

    this.canvas = document.createElement("canvas");
    this.background = new Image();
    this.background.src = background;

    this.start = function() {
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);

        window.addEventListener('keydown', function (e) {
            dkScenario.keys = (dkScenario.keys || []);
            dkScenario.valueKey = e.key;
            if(e.repeat && e.keyCode == 38){
                dkScenario.keys[e.keyCode] = (e.type == null);
            }
            else{
                dkScenario.keys[e.keyCode] = (e.type == "keydown");
                if(keydown == 0){
                    keydown = 1;
                }  
            }
        })
        window.addEventListener('keyup', function (e) {
            dkScenario.valueKey = undefined;
            dkScenario.keys[e.keyCode] = (e.type == "keydown"); 
            if(keydown != 0){
                keydown = 0;
            }       
        })
    }

    this.updateBackground = function(){
        this.context.drawImage(this.background,0,0,800,600,0,0,800,600);
    }

    this.stop = function() {
        clearInterval(this.interval);
    }

    this.startInterval = function() {
        this.interval = setInterval(updateGameArea, 1000/30);
    }
}