var mainMenuScreen = "images/menus/mainMenu.png";
var selectIcon = "images/menus/select.png";
var winnerScreen = "images/menus/winner.png";
var loserScreen = "images/menus/loser.png";
var multiplayerScreen = "images/menus/multiplayer.png";
var rankingScreen = "images/menus/ranking.png";
var option = 1;
var menuInterval;
var keyTest = 0;
var winnerScr;
var loserScr;
var screen = 0;
var nam = "";
var updatePl;

function startMenu(){
    startGame();
    dkScenario.stop();

    menus = new Menu();
    menuInterval = setInterval(updateMenu,50);
}

function Menu(){

    this.ctx = dkScenario.context;

    this.mainMenu = new Image();
    this.mainMenu.src = mainMenuScreen;

    this.select = new Image();
    this.select.src = selectIcon;

    this.winnerScr = new Image();
    this.winnerScr.src = winnerScreen;

    this.loserScr = new Image();
    this.loserScr.src = loserScreen;

    this.multiplayerMenu = new Image();
    this.multiplayerMenu.src = multiplayerScreen;

    this.rankingScreen = new Image();
    this.rankingScreen.src = rankingScreen;

    this.p1 = new Image();
    this.p1.src = p1Sprite;

    this.p2 = new Image();
    this.p2.src = p2Sprite;

    this.rankingPlayers = [];

    this.main = function(){
        this.ctx.drawImage(this.mainMenu,0,0,800,600,0,0,800,600);
    }

    this.multiplayer = function(){
        this.ctx.drawImage(this.multiplayerMenu,0,0,800,600,0,0,800,600);

        if(nPlayer == 0 ){
            this.ctx.drawImage(this.p1,0,0,256,256,105,117,256,256);

            if(nPlayers == 2)
                this.ctx.drawImage(this.p2,0,0,256,256,440,117,256,256);
        }
        else if(nPlayer == 1){
            this.ctx.drawImage(this.p2,0,0,256,256,440,117,256,256);

            if(nPlayers == 2)
                this.ctx.drawImage(this.p1,0,0,256,256,105,117,256,256);
        }
    }

    this.gameOver = function(result){
        if(result == 2){
            this.ctx.drawImage(this.winnerScr,0,0,800,600,0,0,800,600);
            this.ctx.fillStyle = "white";
            this.ctx.font = "65px dkfont";
            this.ctx.fillText(nam,307,325);
        }
        else if(result == 3){
            this.ctx.drawImage(this.loserScr,0,0,800,600,0,0,800,600);
        }
    }

    this.ranking = function(result){

        var positionY = 144;
        var scoreString = "";

        this.ctx.fillStyle = "white";
        this.ctx.font = "26px dkfont";
        this.ctx.drawImage(this.rankingScreen,0,0,800,600,0,0,800,600);

        for(var i = 0; i < this.rankingPlayers.length; i++){
            this.ctx.fillText(this.rankingPlayers[i].name,304,positionY);

            scoreString = this.rankingPlayers[i].score.toString();

            while(scoreString.length < 4)
                scoreString = "0"+scoreString;

            this.ctx.fillText(scoreString,401,positionY);
            positionY += 43;
        }
    }
}

function updateMenu(){

    if(screen == 0){

        if(window.mobilecheck()){
            dkScenario.canvas.style.height = 'auto';
            dkScenario.canvas.style.width = '100%'
        }
        else{
            dkScenario.canvas.style.height = '100%';
            dkScenario.canvas.style.width = 'auto'
        }

        $.ajax({url: "/updateStatus", type: "POST", data: {player: nPlayer, status: 0}});

        if(dkScenario.keys && dkScenario.keys[87]){option = 1}
        if(dkScenario.keys && dkScenario.keys[83]){option = 2}
        if(dkScenario.keys && dkScenario.keys[32] && option == 1){screen = 1;

            updatePl = setInterval(updatePlayers,100);

            $.ajax({url: "/getPlayer", type: "POST", success: function(result){
                nPlayer = result;
            }});
        }

        if(dkScenario.keys && dkScenario.keys[32] && option == 2){

            $.ajax({url: "/getRanking", type: "POST",success: function(resultado){
                screen = 4;
                menus.rankingPlayers = resultado;
            }});
        }

        menus.main();
        if(option == 1){menus.ctx.drawImage(menus.select,0,0,256,256,322,373,20,20)}
        if(option == 2){menus.ctx.drawImage(menus.select,0,0,256,256,292,413,20,20);}
    }

    if(screen == 1){
        menus.multiplayer();
        if(dkScenario.keys && dkScenario.keys[13]){      
            if(option == 1){restart();clearInterval(menuInterval);dkScenario.startInterval()}
        }
        else if(dkScenario.keys && dkScenario.keys[27]){screen = 0;refresh()}
    }

    if(screen == 2){
        menus.gameOver(screen);

        if(dkScenario.keys && dkScenario.keys[13] && nam.length == 3){
            $.ajax({url: "/newRanking", type: "POST", data:{name: nam,score: playerPontuation[nPlayer] }});
            screen = 0;
            refresh()
        }

        if(dkScenario.keys && dkScenario.keys[8] && nam.length != 0 && keyTest == 0){
            nam = nam.substring(0,nam.length - 1);
            keyTest = 1;
        }
        else if(dkScenario.keys && dkScenario.valueKey != undefined && keyTest == 0 && nam.length < 3 && dkScenario.valueKey.length == 1){
            nam = nam+""+dkScenario.valueKey;
            keyTest = 1;
        }

        if(keydown == 0){
            keyTest = 0;
        }
    }

    if(screen == 3){
        menus.gameOver(screen);

        if(dkScenario.keys && !dkScenario.keys[32] && dkScenario.valueKey != undefined){screen = 0;refresh()}
    }

    if(screen == 4){
        menus.ranking();

        if(dkScenario.keys && dkScenario.keys[27]){screen = 0;refresh()}
    }

    function refresh(){
        location.reload();
    }
}