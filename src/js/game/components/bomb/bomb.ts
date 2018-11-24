export default class Bomb {
    // public id:number;
    public playerId:number;
    public radius:number;
    public xPos:number;
    public yPos:number;
    public plantTime: number;
    private _ctx: any;

    constructor (playerId:number, x:number,y:number,time:number, ctx:any) {
        this.playerId = playerId;
        this.xPos = x;
        this.yPos = y;
        this.plantTime = time;
        this._ctx = ctx;
        this.radius = 2; // TODO добавить возможность изменять 
    }
}