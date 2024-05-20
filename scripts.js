const score = document.getElementById("score")
const finalScore = document.getElementById("final-score")
const buttonPlay = document.getElementById("play-again")
const menu = document.getElementById("menu")
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const size = 30;
const audio = new Audio("./assets/audio.mp3")


let direction, loopId, pontuacao = 0;

let snake = [
    {x: 180, y: 180},
    {x: 210, y: 180}
]

//gera um numero aleatorio
function ramdonNumber(max, min) {
    return Math.round(Math.random() * max + min)
}

//transforma o numero aleatorio em multiplo de 30
function ramdonPosition() {
    const number = ramdonNumber(canvas.width - size, 0)
    return Math.round(number/size) * 30
}

//gera uma cor aleaatoria para a comida
function ramdomColorFood() {
    const red = ramdonNumber(255, 0);
    const green = ramdonNumber(255, 0);
    const blue = ramdonNumber(255, 0);

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: ramdonPosition(),
    y: ramdonPosition(),
    color: ramdomColorFood()
}

function drawFood() {

    ctx.shadowColor = food.color
    ctx.shadowBlur = 6
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

function drawSnake(){
    ctx.fillStyle = "#ddd"
    
    snake.forEach((position, index) => {

        if(index == snake.length - 1){
            ctx.fillStyle = "white"
        }

        ctx.fillRect(position.x, position.y, size, size);
    })
}

function moveSnake() {
    if(!direction) return;

    const head = snake[snake.length -1];

    snake.shift();

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size })
    }

    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }
}

function drawGrid() {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#248046"

    for(var i = 30; i < canvas.width; i += size){
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)

        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)

        ctx.stroke()
    }
}

function eatFood() {
    const head = snake.length - 1;
    
    if(snake[head].x == food.x && snake[head].y == food.y){
        snake.push({
            x: snake[head].x,
            y: snake[head].y
        })

        audio.play()
        
        let x = ramdonPosition()
        let y = ramdonPosition()
        
        while(snake.find((position) => position.x == x && position.y == y)){
            x = ramdonPosition()
            y = ramdonPosition()
        }

        food.x = x
        food.y = y
        food.color = ramdomColorFood()

        pontuacao += 10
        score.textContent = pontuacao
    }
}

function checkColisao() {
    const head = snake[snake.length - 1]

    const wallColision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570
    
    const selfColision = snake.find((position) => {

        if(position == head){
            return
        }

        return position.x == head.x && position.y == head.y
    })

    if(wallColision || selfColision){
        gameOver()
    }
}

function gameOver() {
    direction = undefined
    finalScore.textContent = score.innerText
    menu.style.display = "flex"
    canvas.style.filter = "blur(2px)"
}

function gameLoop() {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    moveSnake()
    drawSnake()
    checkColisao()
    drawFood()
    eatFood()

    loopId = setTimeout(() => {
        gameLoop()
    }, 100)
}

gameLoop()

document.addEventListener("keydown", function(event){
    if((event.key == "ArrowRight" || event.key == "d") && direction != "left"){
        direction = "right";
    }

    if((event.key == "ArrowLeft" || event.key == "a") && direction != "right"){
        direction = "left";
    }

    if((event.key == "ArrowUp" || event.key == "w") && direction != "down"){
        direction = "up";
    }

    if((event.key == "ArrowDown" || event.key == "s") && direction != "up"){
        direction = "down";
    }
})

buttonPlay.addEventListener("click", function() {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    pontuacao = 0

    snake = [
        {x: 180, y: 180},
        {x: 210, y: 180}
    ]
})