import { Player } from './Player.js';
import { Obstacle } from './Obstacle.js';
import { Floor } from './Floor.js';

export class Game{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
        this.themeSound = new Audio('./Sounds/at_the_end_of_hope_loop.wav');
        this.themeSound.loop = true;
        this.playing = false;
        this.canPlay = true;
        this.lose = false;
    }

    init(){
        this.newGame();
        this.setup_keyboard();
        this.gameLoop();
    }

    newGame(){
        this.timeToNewSpeed = 100;
        this.timeToNewObstacle = 20;
        this.speed = 10;
        this.floor = new Floor(this.canvas.width, this.canvas.height/15, this.ctx);
        this.floor.position.y = Math.floor(this.canvas.height - this.floor.heigth);
        this.obstacles = [];
        this.player = new Player(this.floor, this.obstacles, this.ctx);
        this.player.position.x = 100;
        this.player.position.y = 100;
        this.backgroundColor = '#221e29';
    }

    update(){
        if(this.playing){
            this.player.update();
            if(this.player.lives){
                this.obstacles.forEach((obstacle, index) => {
                    obstacle.update();
                    obstacle.speedX = -this.speed;
                    if(obstacle.position.x < - obstacle.width){
                        this.obstacles.splice(index, 1);
                    }
                });
                this.floor.update();
        
                if(this.timeToNewObstacle <= 0){
                    let newObstacle = new Obstacle(this.ctx);
                    newObstacle.position.y = this.floor.position.y - newObstacle.heigth;
                    newObstacle.position.x = this.canvas.width + newObstacle.width;
                    this.obstacles.push(newObstacle);
                    this.timeToNewObstacle = 10 + Math.round(Math.random() * 50);
                }
                this.timeToNewObstacle--;
    
                if(this.timeToNewSpeed <= 0){
                    this.speed += 0.1;
                    this.timeToNewSpeed = 100;
                }
                this.timeToNewSpeed--;
    
                this.player.score += this.speed/100;
            }
        }
    }

    draw(){
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.playing){
            this.player.draw();
            this.floor.draw();
            this.obstacles.forEach(obstacle => {
                obstacle.draw();
            });
    
            let livePosition = {x: 50, y: 50};
            for(let i = 0; i < this.player.lives; i++){
                this.ctx.beginPath();
                this.ctx.fillStyle = '#ff5050';
                this.ctx.arc(livePosition.x, livePosition.y, 30, 0, 2 * Math.PI);
                this.ctx.fill();
    
                livePosition.x += 70;
            }
            
            if(this.player.lives){
                this.ctx.fillStyle = '#afa7be';
                this.ctx.font = window.innerWidth * 0.03 + 'px Arial';
                const scoreText = `Score: ${Math.round(this.player.score)}`;
                this.ctx.fillText(scoreText, this.canvas.width - 50 - this.ctx.measureText(scoreText).width, 50);
            }
        }
        else{
            this.floor.draw();
            this.displayPlayMessage();
        }
    }

    gameLoop(){
        this.update();
        this.draw();

        if(!this.player.lives){
            const text = this.isMobileDevice() ? 'Tap to continue' : 'Press space to continue';

            if(!this.lose){
                this.lose = true;
                this.canPlay = false;
                setTimeout(() => {
                    this.canPlay = true;
                }, 1000);
            }

            const maxScore = localStorage.getItem('score');
            const scoreText = `Score: ${Math.round(this.player.score)}  Max: ${maxScore}`;

            this.ctx.fillStyle = '#afa7be';
            this.ctx.font = window.innerWidth * 0.07 + 'px Arial';
            this.ctx.fillText(text, this.canvas.width/2 - this.ctx.measureText(text).width/2, this.canvas.height/2.5);
            this.ctx.font = window.innerWidth * 0.05 + 'px Arial';
            this.ctx.fillText(scoreText, this.canvas.width/2 - this.ctx.measureText(scoreText).width/2, this.canvas.height/2);
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    displayPlayMessage(){
        const text = this.isMobileDevice()? 'Tap to play' : 'Press space to play';

        this.ctx.fillStyle = '#afa7be';
        this.ctx.font = window.innerWidth * 0.07 + 'px Arial';
        this.ctx.fillText(text, this.canvas.width/2 - this.ctx.measureText(text).width/2, this.canvas.height/2.5);
    }

    setup_keyboard(){
        window.addEventListener('keypress', (key) => {
            if(this.playing){
                if(this.player.lives){
                    if(key.keyCode == 119 || key.keyCode == 32){
                        this.player.jump();
                    }
                    else if(key.keyCode == 115){
                        this.player.speedY += 20;
                    }
                }
                else if(this.canPlay){
                    this.lose = false;
                    this.newGame();
                }
            }
            else if(key.keyCode == 32){
                this.themeSound.play();
                this.playing = true;
            }
        });

        window.addEventListener('touchstart', () => {
            if(this.playing){
                if(this.player.lives){
                    this.player.jump();
                }
                else if(this.canPlay){
                    this.lose = false;
                    this.newGame();
                }
            }
            else{
                this.themeSound.play();
                this.playing = true;
            }
        });
    }

    
    isMobileDevice(){
        return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    }
}