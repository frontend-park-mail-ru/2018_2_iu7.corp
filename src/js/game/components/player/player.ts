import Field, { IBrick , GrassBrick} from '../field/field';
import Bomb, { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';
// import g from '../../../../../images/bomber1.png'

import { file, continueStatement } from 'babel-types';

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
        this._downSpritesSrc = [];
        this._upSpritesSrc = [];
        this._rightSpritesSrc = [];
        this._leftSpritesSrc = [];
        this._playerSprites = playerSprites; // имена файлов
        this._bombSprites = bombSprites;
        this.loadingSpritesSrc();
        // this._sprite = new Image;
        // this._sprite.onload = () => {
        //     this.drawPlayer();
        // }
        // this._sprite.src = this._playerSprites.front[0]; // начальный вид игрока при входе в одиночную игру
        this._animationTime = 120;

        // this.velocity = 1;

        this._ctx = ctx;
        GameBus.on('single-animate-down', this.downAnimate.bind(this));
        GameBus.on('single-animate-up', this.upAnimate.bind(this));
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
    private animationPrevX : number;
    private animationPrevY : number;
    private animationxPos : number;
    private animationyPos : number;
    private gameField : IBrick[][]
    private _playerSprites : any;
    private _bombSprites : any;
    private _animationTime : number; 
    private _startAnimationTime : number;
    private _currentFrame : number;
    private _downSpritesSrc : Array<HTMLImageElement>;
    private _upSpritesSrc : Array<HTMLImageElement>;
    private _rightSpritesSrc : Array<HTMLImageElement>;
    private _leftSpritesSrc : Array<HTMLImageElement>
    public _ctx : any;
    // public _sprite : HTMLImageElement;

    public loadingSpritesSrc () : void {
        this._playerSprites.front.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            // console.log(this._downSpritesSrc);
            this._downSpritesSrc.push(sprite);
        })

        this._playerSprites.back.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            this._upSpritesSrc.push(sprite);
        })

        this._playerSprites.right.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.onload = () => {
                    this.drawPlayer();
            }
            sprite.src = s;
            this._rightSpritesSrc.push(sprite);
        })

        // this._playerSprites.front.forEach( (s : string) => {
        //     const sprite : HTMLImageElement = new Image;
        //     sprite.src = s;
        //     this._leftSpritesSrc.push(sprite);
        // })
    }

    public update (x:number,y:number, field: IBrick[][], animateWay : string): void {
        if (this.checkNewPos(x,y, field)) {
            this.animationPrevX = this.xPos * this.size;
            this.animationPrevY = this.yPos * this.size;
            this.prevX = this.xPos;
            this.prevY = this.yPos;
            this.animationxPos = x * this.size;
            this.animationyPos = y * this.size;
            this.xPos = x;
            this.yPos = y;
            this._currentFrame = 0;
            this._startAnimationTime = performance.now();
            GameBus.emit('single-animate-' + animateWay);
        }
    }

    public checkNewPos (newPosX:number, newPosY:number, field: IBrick[][]): boolean {
        if (field[newPosX][newPosY].passable) {
            return true;
        }
        return false;
    }

    private downAnimate () : void {
        console.log('down');
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size + this.size * currentAnimationtime;
        
        if (currentAnimationtime < 1) {         
            this._ctx.clearRect(this.xPos * this.size, this.animationPrevY, this.size, this.size);
            this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
            console.log('prev', this.animationPrevY);
            console.log('new', newY);
            this.animationPrevY = newY;
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.downAnimate());
        }     
    }

    private upAnimate () : void {

        // const time : number = performance.now();
        // const shiftTime : number = time - this._startAnimationTime;
        // const currentAnimationtime : number =  shiftTime / this._animationTime;
        // const newY : number = this.yPos * this.size - this.size * currentAnimationtime;
        

        // this._ctx.clearRect(this.xPos * this.size, this.animationyPos, this.size, this.size);
        // this._ctx.drawImage(this._upSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
        // this.animationyPos = newY;
        // this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов

        // if (currentAnimationtime < 1) {
        //     requestAnimationFrame(() => this.upAnimate());
        // }

        console.log('up');
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.yPos * this.size - this.size * currentAnimationtime;   
             
        if (currentAnimationtime < 1) {
            this._ctx.clearRect(this.xPos * this.size, this.animationyPos, this.size, this.size);         
            this._ctx.drawImage(this._upSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
            // console.log('prev', this.animationPrevY);
            // console.log('new', newY);
            this.animationyPos = newY;
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            requestAnimationFrame(() => this.upAnimate());
        }   
        
    }
    
    private rightAnimate () : void {

        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size + this.size * currentAnimationtime;
        

        this._ctx.clearRect(this.xPos * this.size, this.animationPrevY, this.size, this.size);
        this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
        this.animationPrevY = newY;
        this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов

        if (currentAnimationtime < 1) {
            requestAnimationFrame(() => this.downAnimate());
        }
        
    }

    private leftAnimate () : void {

        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size + this.size * currentAnimationtime;
        

        this._ctx.clearRect(this.xPos * this.size, this.animationPrevY, this.size, this.size);
        this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
        this.animationPrevY = newY;
        this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов

        if (currentAnimationtime < 1) {
            requestAnimationFrame(() => this.downAnimate());
        }
        
    }

    public drawPlayer (): void {
        // console.log('hallo');
        const xPos = this.xPos * this.size;
        const yPos = this.yPos * this.size;

        this._ctx.drawImage(this._downSpritesSrc[0],xPos, yPos, this.size, this.size);

    }

    public setField(field : IBrick[][]) : void {
        this.gameField = field;
    }

    public plantBomb () : void {
        if (this.currentbombsAmount) {
            const bombId : number = this.maxBombsAmount - this.currentbombsAmount;
            const newBomb : Bomb = new Bomb(bombId, this.xPos, this.yPos, this._bombSprites,this._ctx);
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