import { GameObject } from './GameObject.js';

export class Obstacle extends GameObject{
    constructor(ctx){
        super();
        
        this.width = 50 + Math.random() * 150;
        this.heigth = 50 + Math.random() * 200;
        this.speedX = -10;
        this.color = '#afa7be';
        this.ctx = ctx;
    }

    update(){
        this.position.x += this.speedX;
    }

    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.heigth);
    }
}