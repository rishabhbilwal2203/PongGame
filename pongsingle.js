// select canvas element

const canvas = document.getElementById("pong");
// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// load sounds
let hit = new Audio();
let wall = new Audio();
let userScore = new Audio();
let comScore = new Audio();
var pass = 1;


hit.src = "sounds/hit.mp3";
wall.src = "sounds/wall.mp3";
comScore.src = "sounds/comScore.mp3";
userScore.src = "sounds/userScore.mp3";

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    velocityX : 4,
    velocityY : 4,
    speed : 8,
    color : "WHITE"
}

// User Paddle
const user = {
    x : 0, // left side of canvas
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#E5E6E1",
    direction : "up"
}

// COM Paddle
const com = {
    x : canvas.width - 10, // - width of paddle
    y : (canvas.height - 100)/2, // -100 the height of paddle
    width : 10,
    height : 100,
    score : 0,
    color : "#080709",
    direction : "down"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "WHITE"
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawText(text,x,y,font,color){
    ctx.fillStyle = color;
    ctx.font = `${font}px fantasy`;
    ctx.fillText(text, x, y);
}

function drawArc(x, y, r, color){
    if(ball.x >= canvas.width/2){
        ball.color = "#080709";
    }else{
        ball.color = "#E5E6E1"
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

// document.querySelector("body").addEventListener("keydown", function(evt){
//     console.log(evt.key);
//     if(evt.key === "ArrowDown")
//     {
//         // user.direction = "down";
//         user.y += 20;
//     }else if(evt.key === "ArrowUp"){
//         // user.direction = "up";
//         user.y -= 20;
//     }
// });

// canvas.addEventListener("mousemove", getMousePos);

// function getMousePos(evt){
//     let rect = canvas.getBoundingClientRect();
    
//     user.y = evt.clientY - rect.top - user.height/2;
// }

moveDownUser = () => {
    user.y += 10;
    (user.y + user.height > canvas.height) && (user.y = canvas.height - user.height)
}

moveUpUser = () => {
    user.y -= 10;
    user.y < 0 && (user.y = 0)
}

const controller = {
    38: {pressed: false, func: moveUpUser},
    40: {pressed: false, func: moveDownUser},
}

const handleKeyDown = (e) => {
    controller[e.keyCode] && (controller[e.keyCode].pressed = true)
}

const handleKeyUp = (e) => {
    controller[e.keyCode] && (controller[e.keyCode].pressed = false)
}

const runPressedButtons = () => {
    Object.keys(controller).forEach(key => {
        controller[key].pressed && controller[key].func()
    })
}

document.addEventListener("keydown", handleKeyDown)
document.addEventListener("keyup", handleKeyUp)


function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.velocityX = -ball.velocityX;
    ball.speed = 8;
}

function resetScore(){
    user.score = 0;
    com.score = 0;
}

function update(){
    if(user.score === 10 || com.score === 10){
        if(user.score > com.score){
            resetScore();
            pass = -1;
            game();
        }else{
            resetScore();
            pass = -2
            game();
            
        }
    }

    if(ball.x - ball.radius < 0){
        com.score++;
        comScore.play();
        resetBall();
    }else if(ball.x + ball.radius > canvas.width){
        user.score++;
        userScore.play();
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // if(user.y > canvas.height - 100)
    // {
    //     user.direction = "up";
    // }else if(user.y < 0){
    //     user.direction = "down";
    // }
    // if(user.direction === "up")
    // {
    //     user.y -= 4;
    // }else if(user.direction === "down"){
    //     user.y += 4;
    // }

    // user.y += ((ball.y - (user.y + user.height/2)))*0.1;

    // if(com.y > canvas.height - 100)
    // {
    //     com.direction = "up";
    // }else if(com.y < 0){
    //     com.direction = "down";
    // }
    // if(com.direction === "up")
    // {
    //     com.y -= 3;
    // }else if(com.direction === "down"){
    //     com.y += 3;
    // }

    // this is AI code
    com.y += ((ball.y - (com.y + com.height/2)))*0.1;

    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.velocityY = -ball.velocityY;
        wall.play();
    }
    

    let player = (ball.x + ball.radius < canvas.width/2) ? user : com;
    

    if(collision(ball,player)){

        hit.play();

        let collidePoint = (ball.y - (player.y + player.height/2));
  
        collidePoint = collidePoint / (player.height/2);
        
        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        ball.speed += 0.1;
    }
}

function render(){
    drawRect(0, 0, canvas.width/2, canvas.height, "#000");
    drawRect(canvas.width/2, 0, canvas.width/2,canvas.height, "#B8BAB1");

    drawText("User",canvas.width/5,canvas.height/5-40,25,"#fff");

    drawText(user.score,canvas.width/4, canvas.height/4-20,35,"#fff");

    drawText("Computer",3*canvas.width/4-40,canvas.height/5-40,25,"#000");

    drawText(com.score, 3*canvas.width/4, canvas.height/4-20,35,"#000");

    // drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);

}

function welcomeScreen(){
    drawRect(0, 0, canvas.width/2, canvas.height, "#080709");
    drawRect(canvas.width/2, 0, canvas.width/2,canvas.height, "#B8BAB1");


    // drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);

    drawText("Welcome To",canvas.width/6,canvas.height/3+40,75,"#fff");
    drawText("Pong",canvas.width/3,canvas.height/2+40,75,"#fff");
    drawText("Press r to Start",canvas.width/3-20,canvas.height-30,35,"#fff");
}

function controlScreen(){
    drawRect(0, 0, canvas.width/2, canvas.height, "#080709");
    drawRect(canvas.width/2, 0, canvas.width/2,canvas.height, "#B8BAB1");


    // drawNet();

    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);

    ctx.fillStyle = 'rgb(255,255,255,.7)';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawText("Controls",canvas.width/3+20,canvas.height/7,35,"#000");
    var img = document.querySelector("img");

    ctx.drawImage(img,canvas.width/3+20,canvas.height/6,150,150);
    drawText("??? key ---> for Up",canvas.width/4+30,canvas.height/2+50,25,"#000")
    drawText("??? key ---> for Down",canvas.width/4+30,canvas.height/2+90,25,"#000")
    drawText("Press Enter to Start",canvas.width/4,canvas.height-30,35,"#000");
    document.querySelector("body").addEventListener("keypress",function(evt){
        console.log(evt.key);
        if(evt.key === "r"){
            pass = 0;
        }
    });

}

function exitScreen(text){
    drawRect(0, 0, canvas.width/2, canvas.height, "#080709");
    drawRect(canvas.width/2, 0, canvas.width/2,canvas.height, "#B8BAB1");


    drawRect(user.x, user.y, user.width, user.height, user.color);

    drawRect(com.x, com.y, com.width, com.height, com.color);

    drawArc(ball.x, ball.y, ball.radius, ball.color);

    drawText(text,canvas.width/4,canvas.height/2,75,"#fff");
    drawText("Press Enter to Restart",canvas.width/4,canvas.height-30,35,"#fff");

}

function game(){
    if(pass === -1 || pass === -2){
        if(pass === -1){
            exitScreen("You Won!!")
        }else{
            exitScreen("You Lose!!")
        }

    }else if(pass === 1){
        welcomeScreen();
        document.querySelector("body").addEventListener("keypress",function(evt){
            if(evt.key === "r"){
                pass = 2;
            }
        });
        
        
    }
    if(pass === 2){
        controlScreen();
        document.querySelector("body").addEventListener("keypress",function(evt){
            if(evt.key === "Enter"){
                pass = 0;
            }
        });
    }
    else if(pass === 0){
        runPressedButtons();
        render();
        update();
        
    }
    
    
}

// draw a rectangle, will be used to draw paddles

// number of frames per second
let framePerSecond = 50;

//call the game function 50 times every 1 Sec
let loop = setInterval(game,1000/framePerSecond);
