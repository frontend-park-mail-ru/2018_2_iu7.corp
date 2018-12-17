import GameBus from '../../GameBus';
import { IBrick , SteelBrick, FragileBrick} from '../field/field';

export interface IExplodeBombData {
    bombId : number;
    xPos : number;
    yPos : number;
    explodedArea : Array<Array<IPlantedBombPosition>>
}

export interface IPlantedBombPosition {
    xPos : number;
    yPos : number;
}

export default class Bomb {

    constructor (id : number, x : number, y : number, bombSprites : any, flameSprites : any, gameField : IBrick[][], ctx : any) { 
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.gameField = gameField;
        this._ctx = ctx;
        this._bombSprites = bombSprites;
        this._flameSprites = flameSprites;
        this._bombSpritesSrc = [];
        this._flameSpritesSrc = [];
        this.loadSpritesSrc();
        this.size = 45;
        this.radius = 3; // радиус поражение 3 клетки, включая текущую позицию бомбы
        // this._animationPointer = 0;
        this._bombAnimationTime = 2900;
        this._flameAnimationTime = 100;
        this._explosionTimeOut = 3000;
        this._currentFrame = 0;
        this.makeBombAnimationArray()

    }

    public _id:number;
    public xPos:number;
    public yPos:number;
    public size:number;
    public radius: number;

    private _ctx: any; 
    private _bombSprites : any;
    private _flameSprites : any

    private _bombSpritesSrc : Array<HTMLImageElement>;
    private _flameSpritesSrc : Array<HTMLImageElement>;
    private _bombAnimationArray : Array<Function>;
    private _startAnimationTime : number;
    private _bombAnimationTime : number;
    private _flameAnimationTime : number;
    private _explosionTimeOut : number;
    private _animationPointer : number;
    private _currentFrame : number;
    private gameField : IBrick[][];

    public startBombTimer () : void {
        this._startAnimationTime = performance.now();
        this._animationPointer = 0;
        setTimeout(this.explode.bind(this), this._explosionTimeOut);
    }

    // метод для мультиплеера, так как вся логика на сервере, то ее испольнение на фронте дублировать не нужно
    public startBombAnimation () : void {
        this._startAnimationTime = performance.now();
        this._animationPointer = 0;
    }

    // сеттеры если будем делать powerUps 
    public setExplosionTimeOut (time : number) : void {
        this._explosionTimeOut = time;
    }

    public setBombAnimationTime (time : number) : void {
        this._bombAnimationTime = time;
    }

    public setFlameAnimationTime (time : number) : void {
        this._flameAnimationTime = time;
    }

    public setBombRadius (radius : number) : void {
        this.radius = radius;
    }

    // использутся если бомба взорволась раньше своего времени, к примеру по цепной реакции от другой бомбы
    public execFlameAnimation () : void {
        this._animationPointer = 1;
    }


    public explode () : void {

        // данные бомбы (координаты, область поражения) на момент взрыва
        const area : Array<Array<IPlantedBombPosition>> = this.harvestExplosionArea();
        let data : IExplodeBombData = {
            bombId : this._id,
            xPos : this.xPos,
            yPos : this.yPos,
            explodedArea : area 
        };
        GameBus.emit('single-bomb-explode', data);
    }


    public drawBomb () : void {
        this._bombAnimationArray[this._animationPointer]();
    }

    public loadSpritesSrc () : void { 
        this._bombSprites.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._bombSpritesSrc.push(sprite);
        })

        this._flameSprites.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = '/' + s;
            this._flameSpritesSrc.push(sprite);
        })
    }

    private harvestExplosionArea () : Array<Array<IPlantedBombPosition>> {
        // область поражения бомбы
        const area = new Array()
        //  по каким направлениям взрывается бомба
        const explosionVectors = [
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

        explosionVectors.forEach( vec => { // по каждому направлению
            const bombedWay = new Array();
            for (let i = 0; i < this.radius; i++) { // взрываем область соответствующую длине радиуса
                const expXPos =  this.xPos + vec.dx * i;
                const expYPos =  this.yPos + vec.dy * i;
                // console.log(this.gameField[expXPos][expYPos]);
                if (!(this.gameField[expXPos][expYPos] instanceof SteelBrick)) {
                    bombedWay.push( // позиция элемента попадающего под взрыв
                        {
                            xPos : expXPos,
                            yPos : expYPos
                        }
                    )                
                }
                if ((this.gameField[expXPos][expYPos] instanceof SteelBrick) || (this.gameField[expXPos][expYPos] instanceof FragileBrick)) {
                    break;
                }
            }
            area.push(bombedWay);
        })
        return area;      
    }
    
    private bombAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._bombAnimationTime;
        if (currentAnimationTime < 1) {
            this._ctx.drawImage(this._bombSpritesSrc[this._currentFrame], this.xPos * this.size, this.yPos * this.size, this.size, this.size);
            if (Math.floor(shiftTime) % 60 === 0) {
                this._currentFrame = (this._currentFrame + 1) % 3;
            }
            requestAnimationFrame(() => this.bombAnimate());
        } 
        else {
            this._animationPointer = 1; // назначаем указатель анимации на индекс анимации огня
            this._startAnimationTime = performance.now();
            this._currentFrame = 0;
        }

    }

    private flameAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationTime : number =  shiftTime / this._flameAnimationTime;
        
        const area : Array<Array<IPlantedBombPosition>> = this.harvestExplosionArea();
        if (currentAnimationTime < 1) {
            area.forEach( vec => {
                vec.forEach( pos => {
                    // console.log(pos)
                    this._ctx.drawImage(this._flameSpritesSrc[this._currentFrame], pos.xPos * this.size, pos.yPos * this.size, this.size, this.size);
                })
            })
            if (Math.floor(shiftTime) % 60 === 0) {
                this._currentFrame = (this._currentFrame + 1) % 3;
            }
            requestAnimationFrame(() => this.flameAnimate());
        } else {
            this._animationPointer = 0; // назначаем указатель анимации на индекс анимации бомбы
            this._currentFrame = 0;
        }
    }

    private makeBombAnimationArray() {
        this._bombAnimationArray = [];
        this._bombAnimationArray.push(this.bombAnimate.bind(this));
        this._bombAnimationArray.push(this.flameAnimate.bind(this));
    }
}