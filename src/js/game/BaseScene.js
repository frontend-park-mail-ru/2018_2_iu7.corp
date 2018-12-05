export default class Scene {
	constructor () {
		this._canvas = null;
		this._ctx = null;
	}
	init (canvas, ctx) {
		// console.log('Scene init');
		this._canvas = canvas;
		this._ctx = ctx;
	}

	updateGameField (data) {
		// console.log('Scene updateGameField');
		// console.log('Scene data',data);
		this._field.resetField(data);
		// console.log(this._field._data);
	}

	updateUsers (data) {
		// console.log('Scene updateUsers');
		this._player.update(data.x, data.y, this._field.bricksInField);
	}

	clear () {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	}

	render () {
		// console.log('Scene render');
		this._field.drawField();
		this._player.drawPlayer();
	}

	loopCallback () {
		this.clear(); // TODO убрать
		this.render();
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}

	startLoop () {
		window.requestAnimationFrame(this.loopCallback.bind(this));
	}
}
