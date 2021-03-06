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
		// console.log('players ID', this._playersId);
		this._playersId.forEach(id => {
			// console.log('id', id);
			const player = new Player(id, 0, 0, sprites.playerSprites, sprites.bombSprites, sprites.flameSprites);
			this._players.push(player);
		});
		// console.log('current players', this._players);
	}

	getCanvasContext () {
		this.controlsLayer = document.getElementById('canvasControls');

		this.firstLayer = document.getElementById('canvas1');
		this.firstLayerContext = this.firstLayer.getContext('2d');

		this.secondLayer = document.getElementById('canvas2');
		this.secondLayerContext = this.secondLayer.getContext('2d');

		this.firstLayer.width = window.innerWidth;
		this.firstLayer.height = window.innerHeight; //* 0.7;

		this.secondLayer.width = window.innerWidth;
		this.secondLayer.height = window.innerHeight; //* 0.7;

		this.controlsLayer.width = window.innerWidth;
		this.controlsLayer.height = window.innerHeight;
	}

	init () { // (firstLayer, firstLayerContext, secondLayer, secondLayerContext) {
		this.getCanvasContext();
		super.init(this.firstLayer, this.firstLayerContext, this.secondLayer, this.secondLayerContext);

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

		// Bus.on('multiplayer-object', this.updateField.bind(this));
		// Bus.on('multiplayer-scene-start', this.startLoop.bind(this));

		// Bus.on('single-field', this.updateGameField.bind(this));
		// Bus.on('single-user', this.updateUsers.bind(this));
		// Bus.on('single-setBomb', this.updateBombs.bind(this));
		// Bus.on('single-bomb-explosion', this.updateBombs.bind(this));
		// Bus.on('single-scene-start', this.startLoop.bind(this));
		// GameBus.on('single-player-death', this.updateGame.bind(this));
	}

	// updateField(data) {

	// 	// console.log('new briks', data);
	// 	this._field.setBrick(data.transform.position.x, data.transform.position.y, data.object_type);
	// }

	onUpdateUsers (data) {
		// console.log(data);
		// console.log(this._players.length);
		const playerToUpdate = this._players.filter(player => {
		  return player._id === data.id;
		});
		playerToUpdate[0].update(data.transform.position.x, data.transform.position.y, this._field.bricksInField);
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
		// console.log(data);
		// console.log(this._players);
		this._players = this._players.filter(player => {
		  return player._id !== data.id;
		});
	}

	onBrickExplode (data) {
		console.log('hi', data);
		this._field._addGrassBrickInField(data.transform.position.x, data.transform.position.y);
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
