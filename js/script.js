
function startGame() {
  Xspeed      = 0;
  Yspeed      = 0;
  myGamePiece = new component(35,35,colorbird,400,200,"image");
  myScore     = new component("40px","Consolas","#f1f1f1",510,80,"text");
  document.getElementById("audioON").style.display  = "inline";
  document.getElementById("startButton").style.display  = "none";
  sonido(xsonido);
  myGameArea.start();
}

var myGamePiece;
var myScore;
myObstacles = [];
mySound     = new sound("choque.mp3");
colorbird   = 'img/birdB.png';
colorbar1   = 'rgba(0,0,128,';
colorbar2   = 'rgba(128,0,0,';
coloRandom  = false;
xx1         = colorbar1;
xx2         = colorbar2;
Xspeed      = 0;
Yspeed      = 0;
opa1        = 1;
opa2        = 1;
xdelay      = 20;
bandera     = false;
xsonido     = true;
music       = new Audio('No Ballads Balla.mp3');
soniON      = true;

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    myGamePiece;
    myObstacles = [];
    myScore;
    mySound = new sound("choque.mp3");
    opagrafico  = opa1;
    opagrafic2  = opa2;
    bandera     = true;
    this.canvas.width = window.innerWidth-30;
    this.canvas.height = window.innerHeight-5;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, xdelay);
    Xsound = false;
 
    window.addEventListener('keydown', function (e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function (e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");            
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type) {
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = Xspeed;
  this.speedY = Yspeed;
  this.x = x;
  this.y = y;    
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }else if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.zindex = 1000;
      ctx.fillText(this.text,this.x,this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.crashWith = function(otherobj) {
    var myleft      = this.x;
    var myright     = this.x + (this.width);
    var mytop       = this.y;
    var mybottom    = this.y + (this.height);
    var otherleft   = otherobj.x;
    var otherright  = otherobj.x + (otherobj.width);
    var othertop    = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash       = true;
    if ((mybottom<othertop) || (mytop>otherbottom) || (myright<otherleft) || (myleft>otherright)) {
      crash = false;
    }
    return crash;
  }
}

function updateGameArea() {
  var x,height,gap,minHeight,maxHeight,minGap,maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      if (!Xsound) {
       mySound.play();
        Xsound = true;
      }
      myGameArea.stop();
      document.getElementById("gameover").style.display  = "inline";
      return;
    } 
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(100)) {
    x = myGameArea.canvas.width;
    minHeight = 30;
    maxHeight = 200;
    height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
    minGap = 150;                                                                    
    maxGap = 250;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    if (coloRandom) {
      if (colorbar1==xx1) {
        colorbar1 = xx2;
        colorbar2 = xx1;
      }else {
        colorbar1 = xx1;
        colorbar2 = xx2;    
      }
    }
    myObstacles.push(new component(35,height+50,colorbar1+opagrafico+")",x,0));
    myObstacles.push(new component(35,x-height-gap,colorbar2+opagrafic2+")",x+5,height+gap));
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].speedX = -2;
    myObstacles[i].newPos();
    myObstacles[i].update();
  }
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0; 
  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY=-3; } // up
  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY=3; }  // down

  myScore.text="SCORE: " + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();    
  myGamePiece.update();
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
//  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }    
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function boton() {
  document.getElementById("panta").style.display = "none";
  document.getElementById("range").style.display  = "block";
  document.getElementById("colorBar").style.display  = "block";
  document.getElementById("botones").style.display  = "block";
}

function sliderOpc(e){
  speed_=(e=='0')?30:(e=='30')?20:(e=='60')?15:10;
  xdelay = speed_;
  clearInterval(this.interval);
  this.interval = setInterval(updateGameArea, xdelay);
  myGameArea.clear();
  myGameArea.stop();
  myGameArea.start();
}

//Selection Bar
function botonOPC1() {
  myGameArea.stop();
  myGameArea.stop();
  xopc = document.getElementById("menuOpc1");
  xopc.style.display = "inline";
  xopc.style.position = "absolute";
  xopc.style.marginTop = "10%";
  xopc.style.marginLeft = (bandera)?"-70%":"40%";
  document.getElementById("menuOpc1").style.display = "inline";
}
function opcOK1(){
  document.getElementById("menuOpc1").style.display = "none";
  if (bandera) {
    myGameArea.clear();
    myGameArea.start();
  }
}
function opcgrafBar(e) {
  ult = e.substr(-1);
  pri = e.substr(0,1);
  xid = ult=='0' ? '_A' : '_R';
  for (var i = 1; i < 6; i++) {
    nid = xid + i + ult;
    oEl = document.getElementById(nid);
    oEl.className = "graficopc11";
  }
  xid = xid+e;
  oEl = document.getElementById(xid);
  oEl.className = "graficopc00";
  opag = (pri=='1')?1:(pri=='2')?.8:(pri=='3')?.6:(pri=='4')?.4:.2;
  if (ult=='0') {
    opa1       = opag;
    opagrafico = opag;
  }else {
    opa2       = opag;
    opagrafic2 = opag;
  }
  myGameArea.stop();
}
function opccolBar(e) {
  xid = 'col';
  for (var i = 1; i < 4; i++) {
    nid = xid+i;
    oEl = document.getElementById(nid);
    oEl.className = "graficopc33";
  }
  xid = xid+e;
  oEl = document.getElementById(xid);
  oEl.className = "graficopc30";
  coloRandom = false;
  if (e=='1') {
    colorbar1 = xx1;
    colorbar2 = xx2;
  }else if (e=='2') {
    colorbar1 = xx2;
    colorbar2 = xx1;
  }else if (e=='3') {
    coloRandom = true;
  }
  myGameArea.stop();
}

function botonOPC2() {
  myGameArea.stop();
  myGameArea.stop();
  xopc = document.getElementById("menuOpc2");
  xopc.style.display = "inline";
  xopc.style.position = "absolute";
  xopc.style.marginTop = "10%";
  xopc.style.marginLeft = (bandera)?"-70%":"40%";
}
function opcOK2(){
  document.getElementById("menuOpc2").style.display = "none";
  if (bandera) {
    myGameArea.clear();
    myGameArea.start();
  }
}
function botonOPC3() {
  myGameArea.stop();
  myGameArea.stop();
  xopc = document.getElementById("menuOpc3");
  xopc.style.display = "inline";
  xopc.style.position = "absolute";
  xopc.style.marginTop = (bandera)?"-40%":"10%";
  xopc.style.marginLeft = (bandera)?"40%":"30%";
}
function opcOK3(){
  document.getElementById("menuOpc3").style.display = "none";
  if (bandera) {
    myGameArea.clear();
    myGameArea.start();
  }
}
function opcgrafBird(e) {
  xop = ['B','N','R','A'];
  xid = 'bird';
  for (var i = 0; i < 4; i++) {
    nid = xid+xop[i];
    oElem = document.getElementById(nid);
    oElem.className = "graficopc1";
  }
  xid       = xid+e;
  colorbird = 'img/'+xid+'.png';
  oElem     = document.getElementById(xid);
  oElem.className = "graficopc0";
  myGamePiece = new component(35,35,colorbird,400,200,"image");
}
function sonido(valor){
  if (valor) {
    music.play();
  }else {
    music.pause();
  }
}
function opcAudioON(){
  document.getElementById("audioON").style.display  = "none";
  document.getElementById("audioOFF").style.display  = "inline";
  xsonido = false;
  sonido(xsonido);
}
function opcAudioOFF(){
  document.getElementById("audioOFF").style.display  = "none";
  document.getElementById("audioON").style.display  = "inline";
  xsonido = true;
  sonido(xsonido);
}
function startplay(){
  document.getElementById("gameover").style.display  = "none";
  document.getElementById("startButton").onclick = startGame()
}
