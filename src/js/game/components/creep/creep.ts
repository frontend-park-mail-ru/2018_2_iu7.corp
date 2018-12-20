import { GrassBrick} from '../field/field';
import { IBrick } from '../interfaces/IBrick';
import { IExplodeBombData, IEntityPosition } from '../interfaces/IBomb';
import GameBus from '../../GameBus';

export default class Creep {
    constructor (id : number, x : number, y : number, creepSprites : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.size = 45;
        this.alive = true;

        this._downSpritesSrc = []; // TODO подумать куда убрать все массивы спрайтов
        this._upSpritesSrc = [];
        this._rightSpritesSrc = [];
        this._leftSpritesSrc = [];
        this._newPosition = {
            xPos : x,
            yPos : y
        }
        this._startAnimationPosition = {
            xPos : x,
            yPos : y
        }
        this._creepSprites = creepSprites; // имена файлов

        this._endAnimationSprite = new Image;
        this._animationPointer = 0;
        this.loadSpritesSrc(); // загрузка спрайтов
        this.makeCreepAnimationArray();

        this._animationTime = 600;

        GameBus.on('single-bomb-explode', this.onExplodeBomb.bind(this));

    }

    public _id : number;
    public xPos : number;
    public yPos : number;
    public size : number; // *
    public alive : boolean;
    
    // private prevX : number;
    // private prevY : number;
    private gameField : IBrick[][]
    private _creepSprites : any;

    private _animationTime : number; 
    private _startAnimationTime : number;
    private _currentFrame : number;
    private _downSpritesSrc : Array<HTMLImageElement>;
    private _upSpritesSrc : Array<HTMLImageElement>;
    private _rightSpritesSrc : Array<HTMLImageElement>;
    private _leftSpritesSrc : Array<HTMLImageElement>;
    private _endAnimationSprite : HTMLImageElement;
    private _creepAnimationArray : Array<Function>;
    // индекс указывающий какую анимацию нужно отобразить, меняется по нажатию клавиши, по умолчанию 0 - стоит на месте
    private _animationPointer : number;
    public _ctx : CanvasRenderingContext2D;
    private _lastIdea : number;
    private _newPosition : IEntityPosition;
    private _startAnimationPosition : IEntityPosition;



        // чтобы при каждой смене кадра не указывать новый src, можно загрузить их сразу
    public loadSpritesSrc () : void { 
        this._creepSprites.down.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.onload = () => { 
                this._endAnimationSprite = this._downSpritesSrc[0];
            }
            sprite.src = '/' + s;
            this._downSpritesSrc.push(sprite);
        })
        this._creepSprites.up.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._upSpritesSrc.push(sprite);
        })

        this._creepSprites.right.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._rightSpritesSrc.push(sprite);
        })

        this._creepSprites.left.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._leftSpritesSrc.push(sprite);
        })
    }

    public drawCreep (): void {
        this._creepAnimationArray[this._animationPointer]();
    }

    public setField(field : IBrick[][]) : void {
        this.gameField = field;
    }

    public onExplodeBomb (data : IExplodeBombData) {
        data.explodedArea.forEach( vec => {
            vec.some( position => {
                return this.explodeCreep(position.xPos, position.yPos)
            });
        })

        if (!this.alive) {
            clearTimeout(this._lastIdea); // когда крип умирает нужно завершить ход его мыслей
            GameBus.emit('single-creep-death', {creepId : this._id});
        } 
    }

    private explodeCreep (x : number, y : number) : boolean { // * 
        if (!(this.gameField[x][y] instanceof GrassBrick)) {
            return true;
        } else if (this.xPos === x && this.yPos === y) {
            this.alive = false;
            return true;
        } else {
            return false;
        }
    }

    public update (x : number, y : number) : void {
        this._startAnimationPosition.xPos = this.xPos;
        this._startAnimationPosition.yPos = this.yPos;
        this._newPosition.xPos = x,
        this._newPosition.yPos = y;
        this._currentFrame = 0;
        this._startAnimationTime = performance.now();
        this._animationPointer = this.chooseAnimationPointer();          
    }

    public changePosition () {
        this.xPos = this._newPosition.xPos;
        this.yPos = this._newPosition.yPos;
    }

    public checkNewPos (newPosX : number, newPosY : number) : boolean {
        if ((newPosX >= 0 && newPosX < this.gameField.length) && (newPosY >= 0 && newPosY < this.gameField[0].length)) {
            if (this.gameField[newPosX][newPosY].passable) {
                return true;
            }
            return false;
        }
        return false;
    }

    public setCanvasContext (ctx : CanvasRenderingContext2D) : void {
        this._ctx = ctx;
    }

    public creepBrain () {
        const avaliableWaysInCurrentPosition = new Array();
        const generalAvaliableWays = [
            { // up
                dx:0, 
                dy:-1
            },

            { // right
                dx:1, 
                dy:0
            },

            { // down
                dx:0, 
                dy:1
            },
            { // left
                dx:-1, 
                dy:0
            }
        ]

        // определяем куда крип может пойти из текущей позиции
        generalAvaliableWays.forEach( way => {
            if (this.checkNewPos(this.xPos + way.dx, this.yPos + way.dy)) {
                avaliableWaysInCurrentPosition.push(way);
            }
        })

        const randomWayChoice = Math.floor(Math.random() * (avaliableWaysInCurrentPosition.length));
        const way = avaliableWaysInCurrentPosition[randomWayChoice];
        if (way) { // если крип оказался не заперт
            this.update(this.xPos + way.dx, this.yPos + way.dy);
        }
        this._lastIdea = setTimeout(this.creepBrain.bind(this), 620);
    }

    private makeCreepAnimationArray() : void {
        this._creepAnimationArray = [];
        this._creepAnimationArray.push(this.stayAnimate.bind(this));
        this._creepAnimationArray.push(this.upAnimate.bind(this));
        this._creepAnimationArray.push(this.rightAnimate.bind(this));
        this._creepAnimationArray.push(this.downAnimate.bind(this));
        this._creepAnimationArray.push(this.leftAnimate.bind(this));
    }


    private downAnimate () : void {
        let changed = false;
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newY : number = this._startAnimationPosition.yPos * this.size + this.size * currentAnimationTime;

        if (currentAnimationTime > 0.4 && !changed){
            this.changePosition();
            changed = true;
        }
        
        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this._startAnimationPosition.xPos * this.size, newY, this.size, this.size);
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.downAnimate());
        } else { // когда анимация закончиться переключаем указатель на функцию анимации стоячего положения
            this._animationPointer = 0;
            // призавершении анимации персонаж должен смотреть в ту же сторону куда была направлена анимация
            this._endAnimationSprite = this._downSpritesSrc[0];
        }     
    }

    private upAnimate () : void {
        let changed = false;
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newY : number = this._startAnimationPosition.yPos * this.size - this.size * currentAnimationTime; 

        if (currentAnimationTime > 0.4 && !changed){
            this.changePosition();
            changed = true;
        }

        if (currentAnimationTime < 1) {
            this._ctx.drawImage(this._upSpritesSrc[this._currentFrame], this._startAnimationPosition.xPos * this.size, newY, this.size, this.size);
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            requestAnimationFrame(() => this.upAnimate());
        } else {
            this._animationPointer = 0;
            this._endAnimationSprite = this._upSpritesSrc[0];
        }
        
    }
    
    private rightAnimate () : void {
        let changed = false;
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newX : number = this._startAnimationPosition.xPos * this.size + this.size * currentAnimationTime;

        if (currentAnimationTime > 0.4 && !changed){
            this.changePosition();
            changed = true;
        }
        
        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._rightSpritesSrc[this._currentFrame], newX, this._startAnimationPosition.yPos * this.size, this.size, this.size);
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.rightAnimate());
        } else {
            this._animationPointer = 0;
            this._endAnimationSprite = this._rightSpritesSrc[0];
        } 
    }

    private leftAnimate () : void {
        let changed = false;
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newX : number = this._startAnimationPosition.xPos * this.size - this.size * currentAnimationTime;

        if (currentAnimationTime > 0.4 && !changed){
            this.changePosition();
            changed = true;
        }

        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._leftSpritesSrc[this._currentFrame], newX, this._startAnimationPosition.yPos * this.size, this.size, this.size);
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.leftAnimate());
        } else { 
            this._animationPointer = 0;
            this._endAnimationSprite = this._leftSpritesSrc[0];
        } 
    }

    private stayAnimate () : void {
        const xPos = this.xPos * this.size;
        const yPos = this.yPos * this.size;
        this._ctx.drawImage(this._endAnimationSprite,xPos, yPos, this.size, this.size);
    }

    private chooseAnimationPointer () : number {
        let  pointer : number = 0;

        if (this.xPos > this._newPosition.xPos && this.yPos === this._newPosition.yPos) {
            pointer = 4;
        }

        else if (this.xPos < this._newPosition.xPos && this.yPos === this._newPosition.yPos) {
            pointer = 2;
        }

        else if (this.xPos === this._newPosition.xPos && this.yPos > this._newPosition.yPos) {
            pointer = 1;
        }

        else if (this.xPos === this._newPosition.xPos && this.yPos < this._newPosition.yPos) {
            pointer = 3;
        }
        return pointer;
    }
}