import GameBus from '../../GameBus';
import { isEmptyStatement } from 'babel-types';

export interface IExplodeBombData {
    bombId : number;
    xPos : number;
    yPos : number;
    explodedArea : Array<Array<IPlantedBombData>>
}

export interface IPlantedBombData {
    xPos : number;
    yPos : number;
}

export default class Bomb {

    constructor (id : number, x : number, y : number, bombSprites : any, flameSprites : any, ctx : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this._ctx = ctx;
        this._bombSprites = bombSprites;
        this._flameSprites = flameSprites;
        this.size = 45;
        this.radius = 3; // радиус поражение 3 клетки, включая текущую позицию бомбы
        this._bombSpritesSrc = [];
        this._flameSpritesSrc = [];
        // this._animationPointer = 0;
        this._bombAnimationTime = 1800;
        this._flameAnimationTime = 200;
        this._currentFrame = 0;

        this.loadingSpritesSrc();
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
    private _animationPointer : number;
    private _currentFrame : number;

    public startTimer () : void {
        this._startAnimationTime = performance.now();
        this._animationPointer = 0;
        setTimeout(this.explode.bind(this), 2000)
    }

    public explode () : void {

        // область поражения бомбы
        const area = new Array();

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
                // чтобы область поражения бомбы не выходила за размер матрицы поля
                if ((expXPos > 0 && expYPos > 0) && (expXPos < 19 && expYPos < 19)) {
                    bombedWay.push( // позиция элемента попадающего под взрыв
                        {
                            xPos : expXPos,
                            yPos : expYPos
                        }
                    )
                }
            }
            area.push(bombedWay);
        })

        // данные бомбы (координаты, область поражения) на момент взрыва
        let data : IExplodeBombData = {
            bombId : this._id,
            xPos : this.xPos,
            yPos : this.yPos,
            explodedArea : area 
        };
        GameBus.emit('single-bomb-explode', data);
    }


    public draw () : void {
        console.log(this._animationPointer);
        this._bombAnimationArray[this._animationPointer]();
    }

    public loadingSpritesSrc () : void { 
        this._bombSprites.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            this._bombSpritesSrc.push(sprite);
        })

        this._flameSprites.forEach( (s : string) => {
            const sprite : HTMLImageElement = new Image;
            sprite.src = s;
            this._flameSpritesSrc.push(sprite);
        })
    }
    
    private bombAnimate () : void {
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._bombAnimationTime;
        if (currentAnimationtime < 1) {
            this._ctx.drawImage(this._bombSpritesSrc[this._currentFrame], this.xPos * this.size, this.yPos * this.size, this.size, this.size);
            if (~~shiftTime % 60 === 0) {
                this._currentFrame = ++this._currentFrame % 3;
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
        console.log('hi');
        const time : number = performance.now();
        const shiftTime : number = time - this._startAnimationTime;
        const currentAnimationtime : number =  shiftTime / this._flameAnimationTime;

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
        if (currentAnimationtime < 1) {
            explosionVectors.forEach( vec => { // по каждому направлению
                for (let i = 0; i < this.radius; i++) { // взрываем область соответствующую длине радиуса
                    const expXPos =  this.xPos + vec.dx * i;
                    const expYPos =  this.yPos + vec.dy * i;
                    // чтобы область поражения бомбы не выходила за размер матрицы поля
                    if ((expXPos > 0 && expYPos > 0) && (expXPos < 19 && expYPos < 19)) {
                        this._ctx.drawImage(this._flameSpritesSrc[this._currentFrame], expXPos * this.size, expYPos * this.size, this.size, this.size);
                    }
                    if (~~shiftTime % 60 === 0) {
                        this._currentFrame = ++this._currentFrame % 3;
                    }
                }
            })
            requestAnimationFrame(() => this.flameAnimate());
        } else {
            this._animationPointer = 0; // назначаем указатель анимации на индекс анимации огня
            this._currentFrame = 0;
        }
    }

    private makeBombAnimationArray() {
        this._bombAnimationArray = [];
        this._bombAnimationArray.push(this.bombAnimate.bind(this));
        this._bombAnimationArray.push(this.flameAnimate.bind(this));
    }
}