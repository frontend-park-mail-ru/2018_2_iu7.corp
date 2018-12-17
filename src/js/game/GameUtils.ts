import { BricksTypes } from './components/field/field';

export function makeNumberMatrix(height : number, width : number) : number[][] {
    const matrix : number[][] = new Array();
    for (let i = 0; i < height; i++) {
        const row = new Array();
        for (let j = 0; j < width; j++) {
            row.push(BricksTypes.GRASS);
        }
        matrix.push(row);
    }
    return matrix;
}