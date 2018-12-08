import Field, { IBrick } from '../field/field';
import Bomb, { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';
import { file } from 'babel-types';


export default class Player {
    constructor(id : number,x : number,y : number, field : IBrick[][], ctx : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.size = 45;
        this.alive = true;
        this.gameField = field;

        this.maxBombsAmount = 1;
        this.currentbombsAmount = this.maxBombsAmount;
        this.bombRadius = 1;
        this.plantedBombs = [];

        // this.velocity = 1;
        this.color = '#FF0000';

        this._ctx = ctx;

        GameBus.on('single-bomb-explode', this.onExplodeBomb.bind(this));
    }

    public _id : number;
    public xPos : number;
    public yPos : number;
    public size : number;
    public alive : boolean;
    
    // public velocity : number;
    public color : string;

    public currentbombsAmount : number;
    public maxBombsAmount : number;
    public bombRadius : number;
    public plantedBombs : Array<Bomb>;

    private prevX : number;
    private prevY : number;
    private gameField : IBrick[][]
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
            const bombId : number = this.maxBombsAmount - this.currentbombsAmount;
            const newBomb : Bomb = new Bomb(bombId, this.xPos, this.yPos, this._ctx);
            this.plantedBombs.push(newBomb);
            newBomb.startTimer();
            this.currentbombsAmount -= 1;
            let data : IPlantedBombData = {
                xPos : newBomb.xPos,
                yPos : newBomb.yPos
            };
            GameBus.emit('single-bomb-plant', data);
        }
    }

    public onExplodeBomb (data : IExplodeBombData) : void {

        data.explodedArea.some( vec => {
            return vec.some( position => {
                return this.explodePlayer(position.xPos, position.yPos)
            });
        })

        if (!this.alive) {
            console.log('game',GameBus._listeners);
            GameBus.emit('single-player-death');
        } else {
            this.currentbombsAmount += 1;
            this.plantedBombs = this.plantedBombs.filter( b => {
                return b._id !== data.bombId;
            })
        }
    }

    private explodePlayer (x : number, y : number) : boolean {
        if (!this.gameField[x][y].destructible && !this.gameField[x][y].passable) {
            return true;
        }
        if (this.xPos === x && this.yPos === y) { // если игрок оказался в зоне поражения
            this.alive = false;
            return true;
        } else {
            return false;
        }
    }
}