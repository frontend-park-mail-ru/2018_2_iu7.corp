import { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';

const enum BricksTypes {
    STEEL = 1,
    FRAGILE = 2,
    GRASS = 3
};

export interface IBrick {
    width: number; // размеры кубика на карте
    height: number;
    xPos: number; // координаты кубика на карте
    yPos: number;
    color: string; // можно в будущем заменить на текстуру
    passable: boolean; // можно ли пройти по кубику
    destructible: boolean; // можно ли разрушить кубик
    drawBrick(ctx: any): void; // нарисовать кубик 
}

abstract class AbstractBrick implements IBrick{
    public width: number = 45;
    public height: number = 45;
    public abstract xPos: number;
    public abstract yPos: number;
    public abstract color: string;
    public abstract passable: boolean;
    public abstract destructible: boolean;
    public drawBrick (ctx: any): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
}

class GrassBrick extends AbstractBrick {
    constructor (x : number, y : number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos : number;
    public yPos : number;
    public color : string = '#365730';
    public passable : boolean = true;
    public destructible : boolean = false;
}

class FragileBrick extends AbstractBrick {
    constructor (x : number, y : number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos : number;
    public yPos : number;
    public color : string = '#755839';
    public passable : boolean = false;
    public destructible : boolean = true;
}

class SteelBrick extends AbstractBrick {
    constructor (x : number, y : number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos : number;
    public yPos : number;
    public color : string = '#0F1108';
    public passable : boolean = false;
    public destructible : boolean = false;
}

export default class Field {
    private _data : number[][];
    private _size : number;
    private _ctx : any;
    private bricksInField : IBrick[][] = new Array();

    constructor (bricksMatrix : number[][], ctx: any) {
        this._data = bricksMatrix;
        this._size = bricksMatrix.length;
        this._ctx = ctx;
        this.setField();
        GameBus.on('single-bomb-plant', this.onPlantBomb.bind(this));
        GameBus.on('single-bomb-explode', this.onExplodeBomb.bind(this));
    }

    public setField (): void {
        for (let i = 0; i < this._size; i++) {
            const row = new Array();
            this.bricksInField.push(row);
            for (let j = 0; j < this._size; j++) {
                if (this._data[i][j] === BricksTypes.STEEL) {
                    this.bricksInField[i].push(new SteelBrick(i, j));
                }
                if (this._data[i][j] === BricksTypes.FRAGILE) {
                    this.bricksInField[i].push(new FragileBrick(i, j));
                }
                if (this._data[i][j] === BricksTypes.GRASS) {
                    this.bricksInField[i].push(new GrassBrick(i, j));
                }
            }
        }
    }

    public getField (): IBrick[][] {
        return this.bricksInField;
    }

    public drawField (): void {
        for (const row of this.bricksInField) {
            for (const brick of row) {
                brick.drawBrick(this._ctx);
            }
        }
    }

    public resetField (data: number[][]): void {
        this._size = data.length;
        this.bricksInField = new Array();
        this._data = data;
        this.setField();
    }

    // когда игрок ставит бомбу, ее нужно сделать непроходимой
    // так как игрок ходит по this.bricksInField(матрица объектов grass,steel,fragile),
    // а бомба просто рисуется сверху, то для имитации непроходимости бомбы нужно сделать
    // непроходимым кубик в матрице this.bricksInField, стоящий на той же позиции, что и бомба
    // когда бомба взорвалась, этот кубик нужно обратно сделать проходимым
    public onPlantBomb (data : IPlantedBombData) {
        this.bricksInField[data.xPos][data.yPos].passable = false;
    }

    // TODO бомба пробивает деревяшки находящиеся за непробиваемой стеной
    public onExplodeBomb (data : IExplodeBombData) : void {
        this.bricksInField[data.xPos][data.yPos].passable = true;
        // console.log('area ', data.explodedArea);
        data.explodedArea.forEach( vec => {
            vec.some( brick => {
                // console.log('brick', brick, 'in vec', vec); 
                return this.explodeBrick(brick.xPos, brick.yPos)
            })
            // vec.some( function(brick) : boolean {
            //     this.bricksInField[data.xPos][data.yPos].passable = true; // ругается на неявный тип any у this

            //     return true
            // })
        })
    }

    private explodeBrick (x : number, y : number) : boolean {
        if (!this.bricksInField[x][y].passable) {
            if (this.bricksInField[x][y].destructible) {
                this.bricksInField[x][y] = new GrassBrick(x,y);
                return true
            }
            return true;

        } else {
            return false
        }
    }


}

// формат данных data.explodedArea
// [
//     [
//         {},
//         {}
//     ],
//     [
//         {},
//         {}
//     ],
//     [
//         {},
//         {}
//     ],
//     [
//         {},
//         {}
//     ],
// ]