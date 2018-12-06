import { IBrick } from '../field/field';
import Bomb from '../bomb/bomb';
import { file } from 'babel-types';


export default class Player {
    constructor(id : number,x : number,y : number, ctx : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.size = 45;
        this.status = 1;

        this.maxBombsAmount = 1;
        this.currentbombsAmount = this.maxBombsAmount;
        this.bombRadius = 1;
        this.plantedBombs = [];

        // this.velocity = 1;
        this.color = '#FF0000';

        this._ctx = ctx;
    }

    public _id : number;
    public xPos : number;
    public yPos : number;
    public size : number;
    public status : number;
    
    // public velocity : number;
    public color : string;

    public currentbombsAmount : number;
    public maxBombsAmount : number;
    public bombRadius : number;
    public plantedBombs : Array<Bomb>;

    private prevX : number;
    private prevY : number;
    public _ctx : any;


    public update (x:number,y:number, field: IBrick[][]): void {
        if (this.checkNewPos(x,y, field)) {
            this.prevX = this.xPos;
            this.prevY = this.yPos;
            this.xPos = x;
            this.yPos = y;
        }
    }

    public checkNewPos (newPosX:number, newPosY:number, field: IBrick[][]): boolean {
        if (field[newPosX][newPosY].passable) {
            return true;
        }
        return false;
    }

    public drawPlayer (): void {
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

    public plantBomb () : void {
        if (this.currentbombsAmount) {
            console.log('bomb planted');
            const bombId : number = this.maxBombsAmount - this.currentbombsAmount;
            console.log('player ctx', this._ctx);
            const newBomb : Bomb = new Bomb(this, bombId, this.xPos, this.yPos, this._ctx);
            this.plantedBombs.push(newBomb);
            newBomb.startTimer();
            this.currentbombsAmount -= 1;

        }
    }
}