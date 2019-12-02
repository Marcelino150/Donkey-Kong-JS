const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(8080);

var player = [];
var topRanking = [];
var nConnected = 0;
var ret = {}

setInterval(testTimeout,500);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dk.html');
});

app.post('/updatePlayer', function (req, res) {

    for(var i = 0; i < 2; i++){
        if(req.body.p == i && player[i] != undefined){
            player[i].data = req.body;
        }
    }

    res.send();
});

app.post('/getPlayer1', function (req, res) {
    if(player[0] != undefined)
        res.send(player[0].data);
    else
        res.send();
});

app.post('/getPlayer2', function (req, res) {
    if(player[1] != undefined)
        res.send(player[1].data);
    else
        res.send();
});

app.post('/getRanking', function (req, res) {
    res.send(topRanking);
});

app.post('/newRanking', function (req, res) {
    updateRanking(req.body);
    res.send();
});

function updateRanking(player){

    for(var i = 0; i <= topRanking.length && i < 10; i++){

        if(i == topRanking.length){
            topRanking.push(player);
            break;
        }
        else if(parseInt(player.score) > parseInt(topRanking[i].score)){
            topRanking.splice(i,0,player);

            if(topRanking.length > 10)
                topRanking.length = 10;

            break;
        }
    }
}

app.post('/getPlayer', function (req, res) {
    for(var i = 0; i < 2; i++){
        if(player[i] == undefined){
            player[i] = {};
            nConnected = nConnected + 1;
            res.send(i.toString());
            break;
        }
    }
});

app.post('/getN', function (req, res) {

    if(player[req.body.player] != undefined){
        player[req.body.player].time = new Date().getTime();
        player[req.body.player].pontuation = req.body.score;
        player[req.body.player].life = req.body.life;
    }

    ret.n = nConnected;

    if(player[0] != undefined){
        ret.pontuation1 = player[0].pontuation;
        ret.life1 = player[0].life;     
    }
    else{
        ret.pontuation1 = 0;
        ret.life1 = 3;
    }

    if(player[1] != undefined){
        ret.pontuation2 = player[1].pontuation;
        ret.life2 = player[1].life;
    }
    else{
        ret.pontuation2 = 0;
        ret.life2 = 3;
    }

    res.send(ret);
});

function testTimeout(){

    if(player[0] != undefined && player[0].time != undefined && (new Date().getTime()) - player[0].time > 1000){
        player[0] = undefined;
        ret.pontuation1 = 0;
        ret.life1 = 3;
        nConnected = nConnected - 1;
    }

    if(player[1] != undefined && player[1].time != undefined && (new Date().getTime()) - player[1].time > 1000){
        player[1] = undefined;
        ret.pontuation2 = 0;
        ret.life2 = 3;
        nConnected = nConnected - 1;
    } 
}