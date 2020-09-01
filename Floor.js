import { GameObject } from "./GameObject.js";

export class Floor extends GameObject{
    constructor(width, heigth, ctx){
        super();

        this.ctx = ctx;
        this.width = width;
        this.heigth = heigth;
        this.color = '#afa7be';
    }

    update(){

    }

    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.heigth);
    }
}