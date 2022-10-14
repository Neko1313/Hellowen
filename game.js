const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

var f = new FontFace('Pix', 'url(txt.ttf)')
var fonmis = new Audio('fon.mp3');

var left = document.getElementById('left');
var fire = document.getElementById('fire');
var right = document.getElementById('right');



let bg = new Image();
bg.src = "bg.png";
let bullet = new Image();
bullet.src = "bullet.png";
let GG = new Image();
GG.src = "GG.png";
let zom2 = new Image();
zom2.src = "zombie 2.png";
let zom1 = new Image();
zom1.src = "zombie 1.png";

canvas.width = 375;
canvas.height = 667;

let gameOver = false;
let frame = 0;

let fires = false;


let speedUser = 0;
let score = 0;
let recorder = 0;
let n = '0000';
let i = 1;
let speedZom= 0.1;
let names;


const projectiles = [];
const enemies = [];
var touchstart = [];

var graves = ['1','2','3','4','5'];


class User{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 18;
        this.height = 35;
        this.shooting = false;
        
    }
    update(speedUse){
        this.x += speedUse;
    }
    draw(){
        ctx.drawImage(GG, this.x, this.y);
    }
}

user =new User((canvas.width/2),canvas.height-75);

function leftButton(){
    user.x += -20;
}

function rightButton(){
    user.x += 20;
}

function fireButton(){
    fires = true;
}

function handleUser(){
    user.draw();
    left.onclick = leftButton;
    right.onclick = rightButton;
    fire.onclick = fireButton;
    if (fires){
        projectiles.push(new Projectile(user.x+user.width-10, user.y));
        fires = false;
    };
    user.update(speedUser);
    if (user.x <= 0 || user.x + user.width >= canvas.width){
        speedUser = 0;
    }
}

// Projectiles
class Projectile {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.speed = 3;
        this.power = 1;
    }
    update(){
        this.y--;
    }
    draw(){
        ctx.drawImage(bullet, this.x, this.y);
    }
}

function handleProjectiles(){
    for (let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();
        for (let y = 0; y < enemies.length; y++){
            if (enemies[y] && projectiles[i] && collision(projectiles[i], enemies[y])){
                enemies[y].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        };
        if (projectiles[i] && projectiles[i].y < 100){
            projectiles.splice(i, 1);
            i--;
        }
    }
}



class Enemy {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 18;
        this.height = 30;
        this.speed = Math.random() * 0.2 + speedZom;
        this.movement = this.speed;
        this.health = 3;
    }
    update(){
        this.y += this.movement;
    }
    draw(){
        if (frame % 10 === 0){
            i = -i; 
        };
        if (i === -1){
            ctx.drawImage(zom1, this.x, this.y);
        }
        if (i === 1){
            ctx.drawImage(zom2, this.x, this.y);
        }
    }
}

function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].health <= 0){
            enemies.splice(i, 1);
            score++;
            i--;
        }
        if (enemies[i] && enemies[i].y > canvas.height){
            gameOver = true;
        }
        
    }
    let hard = 120;
    
    if (score % 10 === 0){
        hard -= 2;
    }
    if (hard === 2){
        hard = 100;
    }
    if (score % 10 === 0){
        speedZom +=0.0003;
    }
    if (frame % hard === 0) {
        var rand = Math.floor(Math.random() * graves.length);
        var x = 0;
        var y = 0;
        switch (graves[rand]){
            case '1': 
                x = 27;
                y = 147; 
                break;
            case '2': 
                x = 88;
                y = 147;
                break;
            case '3': 
                x = 167;
                y = 143;
                break;
            case '4': 
                x = 210;
                y = 115;
                break; 
            case '5': 
                x = 310;
                y = 115;
                break; 
        }
        enemies.push(new Enemy(x, y));
    };
};

function animate(){
    ctx.drawImage(bg, 0, 0);
    scoreOut()
    handleUser();
    handleEnemies();
    handleProjectiles();
    recordOut()
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
    else{
        touchstart.splice(0,touchstart.length);
        f.load().then(function(font) {
            document.fonts.add(font);
    
            ctx.fillStyle = 'red';
            ctx.font = '30px Pix';
            ctx.fillText('Game Over',100, 200);
    
        });

        if (score > localStorage.getItem('rec')){
            recorder = n;
            localStorage.setItem('rec', score);
            localStorage.setItem('rectxt',recorder);
        }

        setTimeout(() => { tapRetart(); }, 2000);
        
        return;
    }
}



function start(){
    //result = prompt('Введите NickName', "Neko");

    //names = result;
    fonmis.autoplay = true;

    nameGame();

    setTimeout(() => { tapStart(); }, 2000);
}

start();

function nameGame() {
    f.load().then(function(font) {
        document.fonts.add(font);

        ctx.fillStyle = 'black';
        ctx.font = '30px Pix'
        ctx.fillText('Halloween',120, 200);
        ctx.fillStyle = 'red';
        ctx.font = '30px Pix'
        ctx.fillText('Nightmare',120, 240);

    });
}

function tapStart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    f.load().then(function(font) {
        document.fonts.add(font);

        ctx.fillStyle = 'black';
        ctx.font = '30px Pix';
        ctx.fillText('Tap   to',140, 200);
        ctx.fillText('Start',150, 240);

    });
    if ((touchstart.length > 0)) {
        animate();
    }
    else {
        setTimeout(() => { tapStart(); }, 2000);
    }
}

function tapRetart() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    f.load().then(function(font) {
        document.fonts.add(font);

        ctx.fillStyle = 'black';
        ctx.font = '30px Pix';
        ctx.fillText('Tap   to',140, 200);
        ctx.fillText('Restart',130, 240);

    });
    if ((touchstart.length > 0)) {
        console.log("Restaet")
        gameOver = false;
        frame = 0;
        score = 0;

        fires = false;


        speedUser = 0;
        speedZom = 0.1;

        projectiles.length =0;
        enemies.length =0;
        touchstart.length =0;

        /*var data ={
            name : names,
            record : recorder,
        } 
        
        var jsonData = JSON.stringify(data);
        console.log(jsonData);
        download(jsonData,'json.txt','text/plain')*/
        
        animate();
    }
    else {
        setTimeout(() => { tapRetart(); }, 2000);
    }
}

function scoreOut() {
    f.load().then(function(font) {
        document.fonts.add(font);
        n = ('0000'+score).slice(-4);
        ctx.fillStyle = 'black';
        ctx.font = '20px Pix';
        ctx.fillText( n,canvas.width-65, canvas.height-45);

    });
}

function recordOut() {
    localStorage.getItem('rec') > 0 ? recorder = localStorage.getItem('rectxt') : recorder = '0000';
    f.load().then(function(font) {
        document.fonts.add(font);
        ctx.fillStyle = 'gold';
        ctx.font = '12px Pix';
        ctx.fillText('record:',38, 76);
        ctx.fillText(recorder,43, 86);

    });
}

canvas.addEventListener('touchstart', function(event) {
    touchstart.push(event);
}, false);


function collision(first, second){
if( !(first.x > second.x + second.width ||
    first.x + first.width < second.x ||
    first.y > second.y + second.height ||
    first.y + first.height < second.y)){
        return true;
    };
}