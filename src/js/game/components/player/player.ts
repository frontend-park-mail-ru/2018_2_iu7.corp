import Field, { IBrick , GrassBrick} from '../field/field';
import Bomb, { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';
// import g from '../../../../../images/bomber1.png'

import { file, continueStatement } from 'babel-types';

export default class Player {
    constructor(id : number, x : number, y : number, playerSprites : any, bombSprites : any, ctx : any) {
        this._id = id;
        this._ctx = ctx;
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
        this._endAnimationSprite = new Image;
        this._animationPointer = 0;
        this.loadingSpritesSrc(); // загрузка спрайтов
        this.makePlayerAnimationArray();

        this._animationTime = 80;

        // this.velocity = 1;
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
    private _leftSpritesSrc : Array<HTMLImageElement>;
    private _endAnimationSprite : HTMLImageElement;
    private _playerAnimationArray : Array<Function>;
    // индекс указывающий какую анимацию нужно отобразить, меняется по нажатию клавиши, по умолчанию 0 - стоит на месте
    private _animationPointer : number;
    public _ctx : any;
    // public _sprite : HTMLImageElement;

    // чтобы при каждой смене кадра не указывать новый src, можно загрузить их сразу
    public loadingSpritesSrc () : void { 
        this._playerSprites.front.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.onload = () => { // TODO убрать onload
                this._endAnimationSprite = this._downSpritesSrc[0];
            }
            sprite.src = s;
            this._downSpritesSrc.push(sprite);
        })
        this._playerSprites.back.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            this._upSpritesSrc.push(sprite);
        })

        this._playerSprites.right.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            this._rightSpritesSrc.push(sprite);
        })

        // this._playerSprites.left.forEach( (s : string) => {
        //     const sprite : HTMLImageElement = new Image;
        //     sprite.src = s;
        //     this._leftSpritesSrc.push(sprite);
        // })
    }

    private makePlayerAnimationArray() {
        this._playerAnimationArray = [];
        this._playerAnimationArray.push(this.stayAnimate.bind(this));
        this._playerAnimationArray.push(this.upAnimate.bind(this));
        this._playerAnimationArray.push(this.rightAnimate.bind(this));
        this._playerAnimationArray.push(this.downAnimate.bind(this));
        this._playerAnimationArray.push(this.leftAnimate.bind(this));
    }

    public update (x:number,y:number, field: IBrick[][], pointer : number): void {
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
            this._animationPointer = pointer;
        }
    }

    public checkNewPos (newPosX:number, newPosY:number, field: IBrick[][]): boolean {
        if (field[newPosX][newPosY].passable) {
            return true;
        }
        return false;
    }

    private downAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size + this.size * currentAnimationtime;
        
        if (currentAnimationtime < 1) {     
            this._ctx.clearRect(this.xPos * this.size, this.animationPrevY, this.size, this.size);
            this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
            this.animationPrevY = newY;
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.downAnimate());
        } else { // когда анимация закончиться переключаем указатель на функцию анимации стоячего положения
            this._animationPointer = 0;
            // призавершении анимации персонаж должен смотреть в ту же сторону куда была направлена анимация
            this._endAnimationSprite = this._downSpritesSrc[0];
        }     
    }

    private upAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._animationTime;
        const newY : number = this.yPos * this.size - this.size * currentAnimationtime;   
             
        if (currentAnimationtime < 1) {
            this._ctx.clearRect(this.xPos * this.size, this.animationyPos, this.size, this.size);         
            this._ctx.drawImage(this._upSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
            this.animationyPos = newY;
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            requestAnimationFrame(() => this.upAnimate());
        } else {
            this._animationPointer = 0;
            this._endAnimationSprite = this._upSpritesSrc[0];
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

    private stayAnimate () : void {
        const xPos = this.xPos * this.size;
        const yPos = this.yPos * this.size;
        this._ctx.drawImage(this._endAnimationSprite,xPos, yPos, this.size, this.size);
    }

    public draw (): void {
        this._playerAnimationArray[this._animationPointer]();
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