import { GameObject } from './GameObject.js';

export class Player extends GameObject{
    constructor(floor, obstacles, ctx){
        super();

        this.score = 0;
        this.speedY = 0;
        this.maxJumps = 2;
        this.jumps = 0;
        this.floor = floor;
        this.obstacles = obstacles;
        this.gravity = 1;
        this.heigth = 100;
        this.width = 100;
        this.ctx = ctx;
        this.color = '#7a6c93';
        this.colors = ['#18161d', '#312b3b', '#564c67']
        this.lastHits = [];
        this.lives = 3;

        this.jumpSounds = [
            new Audio('./Sounds/slightscreams/slightscream-01.flac'),
            new Audio('./Sounds/slightscreams/slightscream-02.flac'),
            new Audio('./Sounds/slightscreams/slightscream-03.flac'),
            new Audio('./Sounds/slightscreams/slightscream-04.flac'),
            new Audio('./Sounds/slightscreams/slightscream-05.flac'),
            new Audio('./Sounds/slightscreams/slightscream-06.flac'),
            new Audio('./Sounds/slightscreams/slightscream-07.flac'),
            new Audio('./Sounds/slightscreams/slightscream-08.flac'),
            new Audio('./Sounds/slightscreams/slightscream-09.flac'),
            new Audio('./Sounds/slightscreams/slightscream-10.flac'),
            new Audio('./Sounds/slightscreams/slightscream-11.flac'),
            new Audio('./Sounds/slightscreams/slightscream-12.flac'),
            new Audio('./Sounds/slightscreams/slightscream-13.flac'),
            new Audio('./Sounds/slightscreams/slightscream-14.flac'),
            new Audio('./Sounds/slightscreams/slightscream-15.flac'),
        ];
        this.hitSound = new Audio('./Sounds/die1.mp3');
        this.gameOverSound = new Audio('./Sounds/Female/game_over.ogg');
        this.newScoreSound = new Audio('./Sounds/Female/new_highscore.ogg');
    }

    update(){
        if(this.lives){
            let falling = true;
            this.obstacles.forEach(obstacle => {
                const upsideObstacle = obstacle.position.y >= this.position.y + this.heigth && obstacle.position.x < this.position.x + this.width && obstacle.position.x + obstacle.width > this.position.x;
                
                if(upsideObstacle && this.position.y + this.heigth + this.speedY >= obstacle.position.y){
                    this.position.y = obstacle.position.y - this.heigth;
                    this.speedY = 0;
                    this.jumps = this.maxJumps;
                    falling = false;
                }
    
                let alreadyHit = false;
                this.lastHits.forEach(lastHit => {
                    if(lastHit == obstacle){
                        alreadyHit = true;
                    }
                })
    
                if(!alreadyHit){
                    if(obstacle.position.y < this.position.y + this.heigth && obstacle.position.x < this.position.x + this.width && obstacle.position.x + obstacle.width > this.position.x){
                        this.lives--;
                        this.hitSound.play();
                        this.color = this.colors[this.lives];
                        this.lastHits.push(obstacle);
                        if(this.lastHits.length > 3){
                            this.lastHits.splice(0, 1);
                        }

                        if(this.lives == 0){
                            this.speedY = -10;
                            
                            let maxScore = localStorage.getItem('score');
                            if(!maxScore){
                                maxScore = 0;
                            }

                            const currentScore = Math.round(this.score);
                            if(maxScore < currentScore){
                                maxScore = currentScore;
                                localStorage.setItem('score', maxScore);
                                this.newScoreSound.play();
                            }
                            else{
                                this.gameOverSound.play();
                            }
                        }
                    }
                }
            });
    
            if(falling){
                if(this.position.y + this.heigth + this.speedY >= this.floor.position.y){
                    this.position.y = this.floor.position.y - this.heigth;
                    this.speedY = 0;
                    this.jumps = this.maxJumps;
                }
                else{
                    this.position.y += this.speedY;
                    this.speedY += this.gravity;
                }
            }
        }
        else{
            if(this.position.y < this.floor.position.y){
                this.position.y += this.speedY;
                this.speedY += this.gravity;
            }
        }
    }

    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.heigth);
    }

    jump(){
        if(this.jumps > 0 && this.lives){
            this.speedY = -20;
            this.jumps--;
            this.jumpSounds[Math.floor(Math.random() * this.jumpSounds.length)].play();
        }
    }
}