import config from '../GameConfig.js';
import Field from './components/field/field.ts';
import Player from './components/player/player.ts';
import Bus from '../../modules/Bus.js';

export default class Scene {
	constructor () {
		this._field = null;
		this._player = null; // TODO сделать чтобы можно было добавлять нескольких игроков
		this._canvas = null;
		this._ctx = null;
	}
	init (canvas, ctx) {
		console.log('Scene init');
		this._canvas = canvas;
		this._ctx = ctx;
		this._field = new Field(config.initialField, this._ctx);
		this._player = new Player(1, 1, 1, this._ctx); // TODO подумать как сделать для нескольких игроков
		Bus.on('field', this.updateGameField.bind(this)); // target of proxy
		Bus.on('user', this.updateUsers.bind(this)); // target d proxy
		Bus.on('scene-start', this.startLoop.bind(this));
	}

	updateGameField (data) {
		console.log('Scene updateGameField');
		// console.log('Scene data',data);
		this._field.resetField(data);
		// console.log(this._field._data);
	}

	updateUsers (data) {
		console.log('Scene updateUsers');
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
