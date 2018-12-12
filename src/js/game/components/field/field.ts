import { IExplodeBombData, IPlantedBombData } from '../bomb/bomb';
import GameBus from '../../GameBus';

const enum BricksTypes {
    STEEL = 1,
    FRAGILE = 2,
    GRASS = 3
};

export interface IBrick {
    // width: number; // размеры кубика на карте
    // height: number;
    size : number;
    xPos: number; // координаты кубика на карте
    yPos: number;
    _sprite: any; // можно в будущем заменить на текстуру
    passable: boolean; // можно ли пройти по кубику
    destructible: boolean; // можно ли разрушить кубик
    drawBrick(ctx: any): void; // нарисовать кубик 
    resize(size : number) : void;
}

abstract class AbstractBrick implements IBrick{
    // public width: number = 45;
    // public height: number = 45;
    public size = 45;
    public abstract xPos: number;
    public abstract yPos: number;
    public abstract _sprite: any;
    public abstract passable: boolean;
    public abstract destructible: boolean;
    public resize (size : number ) {
        this.size = size;
    };
    public drawBrick (ctx: any): void {
        ctx.drawImage(this._sprite, this.xPos, this.yPos, this.size, this.size);
    };
}

export class GrassBrick extends AbstractBrick {
    constructor (x : number, y : number, sprite : any) {
        super()
        this.xPos = x * this.size;
        this.yPos = y * this.size;
        this._sprite = new Image;
        this._sprite.onload = () => {
            GameBus.emit('single-draw-field');   
        }
        this._sprite.src = sprite;
    }
    public xPos : number;
    public yPos : number;
    public _sprite : any;
    public passable : boolean = true;
    public destructible : boolean = false;
}

export class FragileBrick extends AbstractBrick {
    constructor (x : number, y : number, sprite : any) {
        super()
        this.xPos = x * this.size;
        this.yPos = y * this.size;
        this._sprite = new Image;
        this._sprite.src = sprite;
    }
    public xPos : number;
    public yPos : number;
    public _sprite : any;
    public passable : boolean = false;
    public destructible : boolean = true;
}

export class SteelBrick extends AbstractBrick {
    constructor (x : number, y : number, sprite : any) {
        super()
        this.xPos = x * this.size;
        this.yPos = y * this.size;
        this._sprite = new Image;
        this._sprite.src = sprite;
    }
    public xPos : number;
    public yPos : number;
    public _sprite : any;
    public passable : boolean = false;
    public destructible : boolean = false;
}

export default class Field {
    private _data : number[][];
    private _size : number;
    private _sprites : any
    private _ctx : any;
    private bricksInField : IBrick[][] = new Array();

    constructor (bricksMatrix : number[][], sprites: any, ctx: any) {
        this._data = bricksMatrix;
        this.transpose(this._data);
        this._size = bricksMatrix.length;
        this._sprites = sprites;
        this._ctx = ctx;
        this.setField();
        GameBus.on('single-draw-field', this.drawField.bind(this));
        GameBus.on('single-bomb-plant', this.onPlantBomb.bind(this));
        GameBus.on('single-bomb-explode', this.onExplodeBomb.bind(this));
    }
    transpose(matrix : number[][]) {
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < i; j++) {
                [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
            }
        }
    }

    public setField (): void {
        console.log(this._data);
        for (let i = 0; i < this._size; i++) {
            console.log(this._data[i]);
            const row = new Array();
            // this.bricksInField.push(row);
            for (let j = 0; j < this._size; j++) {

                if (this._data[i][j] === BricksTypes.STEEL) {
                    row.push(new SteelBrick(i, j, this._sprites.steelBrick));
                }
                if (this._data[i][j] === BricksTypes.FRAGILE) {
                    row.push(new FragileBrick(i, j, this._sprites.fragileBrick));
                }
                if (this._data[i][j] === BricksTypes.GRASS) {
                    row.push(new GrassBrick(i, j, this._sprites.grassBrick));
                }
            }
            this.bricksInField.push(row)
        }
        console.log(this.bricksInField)
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
        data.explodedArea.forEach( vec => {
            vec.some( brick => {
                return this.explodeBrick(brick.xPos, brick.yPos)
            });
            // vec.some( function(brick) : boolean {
            //     this.bricksInField[data.xPos][data.yPos].passable = true; // ругается на неявный тип any у this

            //     return true
            // })
        })
    }

    private explodeBrick (x : number, y : number) : boolean {
        if (!this.bricksInField[x][y].passable) {
            if (this.bricksInField[x][y].destructible) {
                this.bricksInField[x][y] = new GrassBrick(x, y, this._sprites.grassBrick);
                this.bricksInField[x][y].drawBrick(this._ctx);
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