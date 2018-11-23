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
    public width: number = 50;
    public height: number = 50;
    public abstract xPos: number;
    public abstract yPos: number;
    public abstract color: string;
    public abstract passable: boolean;
    public abstract destructible: boolean;
    public drawBrick(ctx: any): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    };
}

class GrassBrick extends AbstractBrick {
    constructor(x: number,y: number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos: number;
    public yPos: number;
    public color: string = '#365730';
    public passable: boolean = true;
    public destructible: boolean = false;
}

class FragileBrick extends AbstractBrick {
    constructor(x: number,y: number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos: number;
    public yPos: number;
    public color: string = '#755839';
    public passable: boolean = false;
    public destructible: boolean = true;
}

class SteelBrick extends AbstractBrick {
    constructor(x: number,y: number) {
        super()
        this.xPos = x * this.width;
        this.yPos = y * this.height;
    }
    public xPos: number;
    public yPos: number;
    public color: string = '#0F1108';
    public passable: boolean = false;
    public destructible: boolean = false;
}

export default class Field {
    private _data: number[][];
    private _size: number;
    private _ctx: any;
    private bricksInField: IBrick[][] = new Array();

    constructor(bricksMatrix: number[][], ctx: any) {
        console.log(bricksMatrix);
        this._data = bricksMatrix;
        this._size = bricksMatrix.length;
        this._ctx = ctx
        this.setField()
    }

    public setField(): void {
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

    public getField(): IBrick[][] {
        return this.bricksInField;
    }

    public drawField(): void {
        for (const row of this.bricksInField) {
            for (const brick of row) {
                brick.drawBrick(this._ctx);
            }
        }
    }

    public resetField(data: number[][]): void {
        // console.log('field.ts', data);
        // console.log('field.ts obj', this.bricksInField);
        this._size = data.length;
        // console.log('field.ts new size', this._size);
        this.bricksInField = new Array();
        // console.log('field.ts obj', this.bricksInField);
        this._data = data;
        this.setField();
        // console.log('field.ts obj', this.bricksInField);
    }
}
