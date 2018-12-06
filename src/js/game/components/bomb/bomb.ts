import Player from '../player/player';

export default class Bomb {

    constructor (pl : Player, id : number, x : number, y : number, ctx : any) {
        this.planter = pl;
        this._id = id;
        this.xPos = x;
        this.yPos = y;
        this.color = '#F9D71C';
        this._ctx = ctx;
        this.size = 45;

    }

    public _id:number;
    public xPos:number;
    public yPos:number;
    public size:number;
    public color: string;
    public planter: Player;
    private _ctx: any; 
    // private radius: number;

    public startTimer () : void {
        setTimeout(this.explode.bind(this), 3000)
    }

    // TODO делать событие bomb-explode, тем самым оповещая все разрушаемые объекты о взрыве бомбы
    // и уже в методах этих объектов делать все необходимые действия
    public explode () : void {
        console.log(this);
        this.planter.currentbombsAmount += 1;
        this.planter.plantedBombs = this.planter.plantedBombs.filter( b => {
           return b._id != this._id;
        })
    }

    public draw () : void {
        const xPos : number = this.xPos * this.size;
        const yPos : number = this.yPos * this.size;
        this._ctx.fillStyle = this.color;
        this._ctx.fillRect(xPos, yPos, this.size, this.size);  
    }
}