import BaseScene from '../BaseScene.js';
import Bus from '../../modules/Bus.js';
import Field from '../components/field/field.ts';
import Player from '../components/player/player.ts';
import Controls from '../controls/Controls.js';

import * as sprites from '../SpriteImports.js';

class MultiPlayerScene extends BaseScene {
	constructor () {
		super();
		this._registeredActions = false;
		this._field = null;
		this.myId = null;
		this._players = [];
		this._controls = new Controls('multiplayer'); // режим контролов влиет на тип отправки сообщения в Bus
		this._initialField = null;

		Bus.on('multiplayer-object-wall.solid', this.addSteelInField.bind(this));
		Bus.on('multiplayer-object-wall.weak', this.addFragileInField.bind(this));
		Bus.on('multiplayer-object-wall.weak-down', this.onBrickExplode.bind(this));

		Bus.on('multiplayer-object-player-alive', this.onUpdateUsers.bind(this));
		Bus.on('multiplayer-object-player-dead', this.onDeadUsers.bind(this));

		Bus.on('multiplayer-object-bomb-placed', this.onPlantBomb.bind(this));
		Bus.on('multiplayer-object-bomb-detonated', this.onDetonateBomb.bind(this));
	}

	setPlayersId (players) {
		this._playersId = players;
	}

	// запоминаем id игрока чтобы по событию player-dead проверить кто умер
	// если игрок с запомненным id, то нужно убрать лиснер 'keydown'
	setMyId (id) {
		if (!this.myId) {
			this.myId = id;
		}
	}

	// инициализируем матрицу заданного размера кубиками grassBrick до начала игры
	initNumberMatrix (field) {
		if (!this._initialField) {
			this._initialField = field;
		}
	}

	// добавляем в поле нужные блоки после нажатия кнопку начать игру (блоки добавляются по одному, на каждое сообщение с сервера)

	addSteelInField (data) {
		this._field._addSteelBrickInField(data.transform.position.x, data.transform.position.y);
	}

	addFragileInField (data) {
		this._field._addFragileBrickInField(data.transform.position.x, data.transform.position.y);
	}

	// инициализируем игроков по предварительно сохраненному массиву id каждого игрока
	addPlayers () {
		this._playersId.forEach(id => {
			const player = new Player(id, 0, 0, sprites.playerSprites, sprites.bombSprites, sprites.flameSprites);
			this._players.push(player);
		});
	}

	init () {
		this.getCanvasContext();

		this.addPlayers();
		this._field = new Field(this._initialField, sprites.fieldSprites, this._firstLayerContext);
		// вместо передачи поля через конструктор
		this._players.forEach(player => {
			player.setField(this._field.bricksInField);
			player.setCanvasContext(this._secondLayerContext);
		});

		if (!this._registeredActions) {
			this._controls.init(this.controlsLayer);
			this._registeredActions = true;
		}
	}

	onUpdateUsers (data) {
		const playerToUpdate = this._players.filter(player => {
			return player._id === data.id;
		});
		playerToUpdate[0].update(data.transform.position.x, data.transform.position.y);
	}

	onPlantBomb (data) {
		this._players.forEach(player => {
			player.addBomb(data.object_id, data.transform.position.x, data.transform.position.y);
		});
	}

	onDetonateBomb (data) {
		this._players.forEach(player => {
			const explodedBomb = player.plantedBombs.filter(b => {
				return b._id === data.object_id;
			})[0];
			explodedBomb.execFlameAnimation();
			player.plantedBombs = player.plantedBombs.filter(b => {
				return b._id !== data.object_id;
			});
		});
	}

	onDeadUsers (data) {
		this._players = this._players.filter(player => {
			return player._id !== data.id;
		});
	}

	onBrickExplode (data) {
		this._field._addGrassBrickInField(data.transform.position.x, data.transform.position.y);
	}

	multiPlayerLoop () {
		this.clearSecondLayer();
		this.renderBombs();
		this.renderPlayers();
		window.requestAnimationFrame(this.multiPlayerLoop.bind(this));
	}
	// if (data.id === this.myId) {
	//   document.removeEventListener('keydown', this.onKeyDown);

	// updateBombs () {
	// 	this._player.plantBomb();
	// }

	// updateGame () {
	// 	Bus.totalOff('single-field');
	// 	Bus.totalOff('single-user');
	// 	Bus.totalOff('single-setBomb');
	// 	Bus.totalOff('single-bomb-explosion');
	// 	Bus.totalOff('single-scene-start');

	// 	GameBus.totalOff('single-bomb-plant');
	// 	GameBus.totalOff('single-player-death');
	// 	GameBus.totalOff('single-bomb-explode');

	// 	Router.open('/');
	// }
}

export default new MultiPlayerScene();
