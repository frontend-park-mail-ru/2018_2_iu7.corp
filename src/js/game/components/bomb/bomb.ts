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

    constructor (id : number, x : number, y : number, ctx : any) {
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.color = '#F9D71C';
        this._ctx = ctx;
        this.size = 45;
        this.radius = 3; // радиус поражение 3 клетки, включая текущую позицию бомбы
    }

    public _id:number;
    public xPos:number;
    public yPos:number;
    public size:number;
    public color: string;
    public radius: number;

    private _ctx: any; 

    public startTimer () : void {
        setTimeout(this.explode.bind(this), 1000)
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

        this._ctx.clearRect(this.xPos, this.yPos, this.size, this.size);
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
        const xPos : number = this.xPos * this.size;
        const yPos : number = this.yPos * this.size;
        this._ctx.fillStyle = this.color;
        this._ctx.fillRect(xPos, yPos, this.size, this.size);  
    }
}