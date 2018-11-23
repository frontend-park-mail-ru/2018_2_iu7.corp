import { IBrick } from '../field/field';
import { file } from 'babel-types';


export default class Player {
    constructor(id:number,x:number,y:number, ctx:any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.size = 50;
        // this.type= type;
        this._ctx = ctx;
        this.maxBombs = 1;
        this.status = 1;
        this.bombRadius = 1;
        this.velocity = 1;
        this.color = '#FF0000';
    }

    public _id:number;
    public xPos:number;
    public yPos:number;
    public size:number;
    // public type: string;
    public maxBombs: number;
    public status: number;
    public bombRadius: number;
    public velocity: number;
    public color: string;
    private prevX: number;
    private prevY: number;
    private _ctx: any;


    public update(x:number,y:number, field: IBrick[][]): void {
        if (this.checkNewPos(x,y, field)) {
            this.prevX = this.xPos;
            this.prevY = this.yPos;
            this.xPos = x;
            this.yPos = y;

            // this.draw(); 
        }
    }

    public checkNewPos(newPosX:number, newPosY:number, field: IBrick[][]): boolean {
        // const newPosX = this.xPos + dx;
        // const newPosY = this.yPos + dy;
        console.log('this is my field',field);
        if (field[newPosX][newPosY].passable) {
            return true;
        }
        return false;
    }

    public drawPlayer(): void {
        const xPos = this.xPos * this.size;
        const yPos = this.yPos * this.size;

        this._ctx.fillStyle = this.color;
        this._ctx.fillRect(xPos,yPos, this.size,this.size);

        const xPosPrev = this.prevX * this.size;
        const yPosPrev = this.prevY * this.size;

        if ((xPosPrev != xPos) && (yPosPrev != yPos)){
            this._ctx.fillStyle = "#365730";
            this._ctx.fillRect(xPosPrev, yPosPrev, this.size, this.size);
        }
    }
}