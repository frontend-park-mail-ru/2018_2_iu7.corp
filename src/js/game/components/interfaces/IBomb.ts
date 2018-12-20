export interface IEntityPosition {
    xPos : number;
    yPos : number;
}


export interface IExplodeBombData {
    bombId : number;
    xPos : number;
    yPos : number;
    explodedArea : Array<Array<IEntityPosition>>
}

