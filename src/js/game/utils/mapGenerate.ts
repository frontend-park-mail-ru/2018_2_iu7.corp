import { BricksTypes } from '../components/field/field';

export default function numberMatrixMapGenerator (x : number, y : number) : number[][] {

    const bricks : Array<number> = [ 
        BricksTypes.FRAGILE, 
        BricksTypes.GRASS, 
        BricksTypes.GRASS, 
        BricksTypes.GRASS,
        BricksTypes.GRASS
    ]; 
    const numberMatrix : Array<Array<number>> = new Array();
    const emptyRow : Array<number> = new Array();

    for (let i = 0; i < x; i++) {
        emptyRow.push(3);
    }
    numberMatrix.push(emptyRow);
    for (let i = 1; i < y; i++) {
        const row : Array<number> = new Array();
        if (i % 2 === 0) {
            for (let j = 0; j < x; j++) {
                const brickIndex = Math.floor(Math.random() * 5);
                row.push(bricks[brickIndex]); 
            }
            numberMatrix.push(row);
        } else {
            for (let j = 0; j < x; j++) {
                if (j % 2 === 0) {
                    const brickIndex = Math.floor(Math.random() * 5);
                    row.push(bricks[brickIndex]);
                } else {
                    row.push(BricksTypes.STEEL);
                } 
            }
            numberMatrix.push(row);
        }
    } 
    return numberMatrix;  
}