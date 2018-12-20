export interface IBrick {
    size : number;
    xPos: number; // координаты кубика на карте
    yPos: number;
    _sprite: any; // можно в будущем заменить на текстуру
    passable: boolean; // можно ли пройти по кубику
    destructible: boolean; // можно ли разрушить кубик
    drawBrick(ctx: any): void; // нарисовать кубик 
    resize(size : number) : void;
}