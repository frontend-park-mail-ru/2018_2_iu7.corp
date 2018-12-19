import { BricksTypes } from '../components/field/field';

export default function numberMatrixMapGenerator (x : number, y : number) : number[][] {
    
    const numberMatrix : Array<Array<number>> = new Array();
    const firstRow : Array<number> = new Array();
    
    for (let i = 0; i < x; i++) {
        firstRow.push(3);
    }

    numberMatrix.push(firstRow);
    // 4 штуки травки чтобы поле было более свободно
    const bricks : Array<number> = [
        BricksTypes.STEEL, 
        BricksTypes.FRAGILE, 
        BricksTypes.GRASS, 
        BricksTypes.GRASS, 
        BricksTypes.GRASS,
        BricksTypes.GRASS

    ]; 
    for (let i = 0; i < y-1; i++) {
        const row : Array<number> = new Array();
        for (let j = 0; j < x; j++) {
            const brickIndex = Math.floor(Math.random() * 6);
            row.push(bricks[brickIndex]);
        }
        numberMatrix.push(row);
    }

    return numberMatrix;
}