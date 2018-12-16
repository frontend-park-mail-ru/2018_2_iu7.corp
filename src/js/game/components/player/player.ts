import { IBrick , GrassBrick} from '../field/field';
import Bomb, { IExplodeBombData, IPlantedBombPosition } from '../bomb/bomb';
import GameBus from '../../GameBus';

export default class Player {
    constructor(id : number, x : number, y : number, playerSprites : any, bombSprites : any, flameSprites : any) { // ctx : any) {
        this._id = id;
        // this._ctx = ctx;
        this.x = x;
        this.y = y;
        this.xPos = x;
        this.yPos = y;
        this.size = 45;
        this.alive = true;

        this.maxBombsAmount = 1;
        this.currentbombsAmount = this.maxBombsAmount;
        this.plantedBombs = []; 
        this._downSpritesSrc = []; // TODO подумать куда убрать все массивы спрайтов
        this._upSpritesSrc = [];
        this._rightSpritesSrc = [];
        this._leftSpritesSrc = [];
        this._playerSprites = playerSprites; // имена файлов
        this._bombSprites = bombSprites;
        this._flameSprites = flameSprites;
        this._endAnimationSprite = new Image;
        this._animationPointer = 0;
        this.loadSpritesSrc(); // загрузка спрайтов
        this.makePlayerAnimationArray();

        this._animationTime = 130;

        GameBus.on('single-bomb-explode', this.onExplodeBomb.bind(this));
    }

    public _id : number;
    public xPos : number;
    public yPos : number;
    public x : number;
    public y : number;
    public size : number;

    public alive : boolean;
    public color : string;

    public currentbombsAmount : number;
    public maxBombsAmount : number;
    public plantedBombs : Array<Bomb>;

    private prevX : number;
    private prevY : number;
    private gameField : IBrick[][]
    private _playerSprites : any;
    private _bombSprites : any;
    private _flameSprites : any;
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
    public _ctx : CanvasRenderingContext2D;

    public setSpriteSize (size: number) : void{
        this.size = size;
    };

    // чтобы при каждой смене кадра не указывать новый src, можно загрузить их сразу
    public loadSpritesSrc () : void { 
        this._playerSprites.down.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.onload = () => { // TODO убрать onload
                this._endAnimationSprite = this._downSpritesSrc[0];
            }
            sprite.src = '/' + s;
            this._downSpritesSrc.push(sprite);
        })
        this._playerSprites.up.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._upSpritesSrc.push(sprite);
        })

        this._playerSprites.right.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._rightSpritesSrc.push(sprite);
        })

        this._playerSprites.left.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._leftSpritesSrc.push(sprite);
        })
    }

    public drawPlayer (): void {
        // console.log('player draw');
        this._playerAnimationArray[this._animationPointer]();
    }

    public setField(field : IBrick[][]) : void {
        this.gameField = field;
    }

    public plantBomb () : void {
        if (this.currentbombsAmount) {
            const bombId : number = this.maxBombsAmount - this.currentbombsAmount;
            const newBomb : Bomb = new Bomb(bombId, this.xPos, this.yPos, this.size, this._bombSprites, this._flameSprites, this.gameField, this._ctx);
            this.plantedBombs.push(newBomb);
            newBomb.startBombTimer();
            this.currentbombsAmount -= 1;
            let data : IPlantedBombPosition = {
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
            this.plantedBombs = this.plantedBombs.filter( b => { // удаляем бомбу, которая только что взорвалась
                return b._id !== data.bombId; // TODO посмотреть как удалять объект из памяти
            })
        }
    }
    
    public update (x:number,y:number, field: IBrick[][]) : void {
        if (this.checkNewPos(x,y, field)) {

            this.prevX = this.xPos;
            this.prevY = this.yPos;
            this.xPos = x;
            this.yPos = y;
            this._currentFrame = 0;
            this._startAnimationTime = performance.now();
            this._animationPointer = this.chooseAnimationPointer();
        }
    }

    public checkNewPos (newPosX:number, newPosY:number, field: IBrick[][]): boolean {
        if (field[newPosX][newPosY].passable) {
            return true;
        }
        return false;
    }

    public setCanvasContext (ctx : CanvasRenderingContext2D) {
        this._ctx = ctx;
    }

    private makePlayerAnimationArray() {
        this._playerAnimationArray = [];
        this._playerAnimationArray.push(this.stayAnimate.bind(this));
        this._playerAnimationArray.push(this.upAnimate.bind(this));
        this._playerAnimationArray.push(this.rightAnimate.bind(this));
        this._playerAnimationArray.push(this.downAnimate.bind(this));
        this._playerAnimationArray.push(this.leftAnimate.bind(this));
    }


    private downAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size + this.size * currentAnimationTime;
        
        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._downSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
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
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newY : number = this.prevY * this.size - this.size * currentAnimationTime;             
        if (currentAnimationTime < 1) {
            this._ctx.drawImage(this._upSpritesSrc[this._currentFrame], this.xPos * this.size, newY, this.size, this.size);
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
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newX : number = this.prevX * this.size + this.size * currentAnimationTime;
        
        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._rightSpritesSrc[this._currentFrame], newX, this.yPos * this.size, this.size, this.size);
            this._currentFrame = ++this._currentFrame % 3 // 3 - количество спрайтов
            
            requestAnimationFrame(() => this.rightAnimate());
        } else { 
            this._animationPointer = 0;
            this._endAnimationSprite = this._rightSpritesSrc[0];
        } 
    }

    private leftAnimate () : void {

        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._animationTime;
        const newX : number = this.prevX * this.size - this.size * currentAnimationTime;
        
        if (currentAnimationTime < 1) {     
            this._ctx.drawImage(this._leftSpritesSrc[this._currentFrame], newX, this.yPos * this.size, this.size, this.size);
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

    private chooseAnimationPointer () : number {
        let  pointer : number = 0;

        // игрок идет влево
        if (this.prevX > this.xPos && this.prevY === this.yPos) {
            pointer = 4;
        }

        // игрок идет вправо
        else if (this.prevX < this.xPos && this.prevY === this.yPos) {
            pointer = 2;
        }
        
        // игрок идет вверх
        else if (this.prevX === this.xPos && this.prevY > this.yPos) {
            pointer = 1;
        }

        // игрок идет вниз
        else if (this.prevX === this.xPos && this.prevY < this.yPos) {
            pointer = 3;
        }
        


        return pointer;
    }
}