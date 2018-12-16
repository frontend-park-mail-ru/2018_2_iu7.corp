export default function getDirectionFromTouch(vectorStart, vectorEnd){
    const x = vectorEnd._x - vectorStart._x;
    const y = vectorEnd._y - vectorStart._y;
    const toDegrees = 180 / Math.PI;
    const angle = Math.atan2(x, y) * toDegrees; // костыль с векторами
    let direction;
    if (45 <= angle && angle < 135){
        direction = 'right';
    }
    if ((135 <= angle && angle <= 180) || (-180 <= angle && angle < -135)){
        direction = 'up';
    } 
    if (-135 <= angle && angle < -45){
        direction = 'left';
    }
    if (-45 <= angle && angle < 45){
        direction = 'down';
    }
    
    return direction;
}
