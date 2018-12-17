export default function getDirectionFromTouch (vectorStart, vectorEnd) {
	const x = vectorEnd._x - vectorStart._x;
	const y = vectorEnd._y - vectorStart._y;
	const toDegrees = 180 / Math.PI;
	const angle = Math.atan2(x, y) * toDegrees; // костыль с векторами
	let direction;
	if (angle >= 45 && angle < 135) {
		direction = 'right';
	}
	if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
		direction = 'up';
	}
	if (angle >= -135 && angle < -45) {
		direction = 'left';
	}
	if (angle >= -45 && angle < 45) {
		direction = 'down';
	}

	return direction;
}
