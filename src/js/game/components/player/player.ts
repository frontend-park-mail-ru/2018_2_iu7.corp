import Field, { IBrick , GrassBrick} from '../field/field';
import Bomb, { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';
// import g from '../../../../../images/bomber1.png'

import { file } from 'babel-types';


export default class Player {
    constructor(id : number, x : number, y : number, playerSprites : any, bombSprites : any, ctx : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.size = 45;
        this.alive = true;

        this.maxBombsAmount = 1;
        this.currentbombsAmount = this.maxBombsAmount;
        this.bombRadius = 1;
        this.plantedBombs = [];
        this._playerSprites = playerSprites;
        this._bombSprites = bombSprites;
        this._sprite = new Image;

        // this.velocity = 1;

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
    private _playerSprites : any;
    private _bombSprites : any;
    public _ctx : any;
    public _sprite : HTMLImageElement;


    public update (x:number,y:number, field: IBrick[][]): void {
        if (this.checkNewPos(x,y, field)) {
            this.prevX = this.xPos;
            this.prevY = this.yPos;
            this.xPos = x;
            this.yPos = y;
            this._sprite
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

        // this._ctx.fillStyle = this.color;
        // this._ctx.fillRect(xPos,yPos, this.size,this.size);
        // console.log(this._sprite);
        this._sprite.src = this._playerSprites.front[0];
        this._ctx.drawImage(this._sprite,xPos, yPos, this.size, this.size);

        const xPosPrev = this.prevX * this.size;
        const yPosPrev = this.prevY * this.size;

        this._ctx.clearRect(xPosPrev, yPosPrev, this.size, this.size);
        // if ((xPosPrev != xPos) && (yPosPrev != yPos)){
        //     this._ctx.fillStyle = "#365730";
        //     this._ctx.fillRect(xPosPrev, yPosPrev, this.size, this.size);
        // }
    }

    public setField(field : IBrick[][]) : void {
        this.gameField = field;
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
        data.explodedArea.forEach( vec => {
            vec.some( position => {
                return this.explodePlayer(position.xPos, position.yPos)
            });
        })

        if (!this.alive) {
            GameBus.emit('single-player-death');
        } else {
            this.currentbombsAmount += 1;
            this.plantedBombs = this.plantedBombs.filter( b => {
                return b._id !== data.bombId;
            })
        }
    }

    /*
    в данном методе используется instanceof вместо атрибутов класса passable, dectructible,
    так как при вызове события 'single-bomb-plant', у ячейки, на которую ставится бомба
    атрибут passable меняется с true на false, таким образом объект класса GrassBrick
    становится неотличим от объекта класса SteelBrick. Это значит, что ячейка, куда была
    поставлена бомба, будет считаться объектом класса SteelBrick, на котором и после которого
    область поражения уже отсутствует, таким образом игрок никак не может быть убить потому что
    не может попасть в область поражения
    */

    private explodePlayer (x : number, y : number) : boolean {
        // раньше тут была проверка !this.gameField[x][y].passable
        if (!(this.gameField[x][y] instanceof GrassBrick)) {
            return true;
        } else if (this.xPos === x && this.yPos === y) {
            this.alive = false;
            return true;
        } else {
            return false;
        }
    }
}