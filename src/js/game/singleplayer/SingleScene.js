import BaseScene from '../BaseScene.js';
import Bus from '../../modules/Bus.js';
import Router from '../../modules/Router.js';
import GameBus from '../GameBus.ts';
import Field from '../components/field/field.ts';
import Player from '../components/player/player.ts';
import Creep from '../components/creep/creep.ts';
import Controls from '../controls/Controls.js';
import numberMatrixMapGenerator from '../utils/mapGenerate.ts';

import * as sprites from '../SpriteImports.js';

export default class SingleScene extends BaseScene {
	constructor () {
		super(); // нужно оставить даже если в BaseScene нет констурктора, иначе this - undefined
		this._field = null;
		this._players = [];
		this._creeps = [];
		this._registeredActions = false;
		this.loop = true;
		this._controls = new Controls('singleplayer'); // режим контролов влиет на тип отправки сообщения в Bus

		Bus.on('single-user', { callbackName : 'SingleScene.updateUsers', callback : this.updateUsers.bind(this)});
		Bus.on('single-setBomb', { callbackName : 'SingleScene.updateBombs', callback : this.updateBombs.bind(this)});

		GameBus.on('single-player-death', this.updateGame.bind(this));
		GameBus.on('single-creep-death', this.updateCreeps.bind(this));
	}

	generateCreeps (field) {
		for (let i = 0; i < 6; i++) {
			let y = Math.floor(Math.random()* 16 + 3);
			let x = Math.floor(Math.random()* 16 + 3) ;
			while (field[y][x] !== 3) {
				x = Math.floor(Math.random() * 19);
			}
			const creep= new Creep(i,x,y,sprites.creepSprites);
			this._creeps.push(creep);
		}
	}
	init () {
		this.getCanvasContext();

		/*
        здесь важен порядок создания объектов Player и Field, т.к. в таком
        же порядке будут подписаны методы на события и следовательно исполнятся они будут тоже
        в таком порядке. А именно: при происхождении события 'single-bomb-explode'
        сначала должен сработать метод onExplodeBomb именно объекта Player,
        потому что Player должен знать состояние поля до взрыва, чтобы исключить ситуацию,
        когда бомба может убить игрока, находящегося за FragileBrick. Такая ситуация возможна,
        если первым сработает метод onExplodeBomb объекта Field, заменив FragileBrick на GrassBrick,
        тем самым изменив состояние поля. Таким образом метод onExplodeBomb объекта Player выполнится уже с новым
        состоянием поля, и игра будет думать что игрок находится не за FragileBrick, а за GrassBrick,
        значит он попадает в область поражения
        */
		const player = new Player(1, 3, 0, sprites.playerSprites, sprites.bombSprites, sprites.flameSprites);
		this._players.push(player);

		const numberMatrixField = numberMatrixMapGenerator(19, 19); // TODO пусть поле всегда будет квадратное
		this.generateCreeps(numberMatrixField);

		this._field = new Field(numberMatrixField, sprites.fieldSprites, this.firstLayerContext);
		// вместо передачи поля через конструктор

		this._creeps.forEach(creep => {
			creep.setField(this._field.bricksInField);
			creep.setCanvasContext(this.secondLayerContext);
			creep.creepBrain();	
		});

		this._players[0].setField(this._field.bricksInField);
		this._players[0].setCanvasContext(this.secondLayerContext);

		if (!this._registeredActions) {
			this._controls.init(this.controlsLayer);
			this._registeredActions = true;
		}
	}

	updateUsers (data) {
		this._players[0].update(this._players[0].xPos + data.dx, this._players[0].yPos + data.dy);
	}

	updateBombs () {
		this._players[0].plantBomb();
	}

	updateCreeps (data) {
		this._creeps = this._creeps.filter( creep => {
			return creep._id !== data.creepId;
		})
	}

	singlePlayerLoop () {
		this.clearSecondLayer();
		this.renderBombs();
		this.renderPlayers();
		this.renderCreeps();
		this.checkCollisions();
		
		if (this.loop) { 
			window.requestAnimationFrame(this.singlePlayerLoop.bind(this));
		}
	}

	updateGame () {
		this.loop = false; // останавливаем requestAnimationFrame
		Bus.totalOff('single-field');
		Bus.totalOff('single-user');
		Bus.totalOff('single-setBomb');
		Bus.totalOff('single-bomb-explosion');
		Bus.totalOff('single-scene-start');

		GameBus.totalOff('single-bomb-plant');
		GameBus.totalOff('single-player-death');
		GameBus.totalOff('single-bomb-explode');
		GameBus.totalOff('single-creep-death');

		Router.open('/');
	}
}

// export default new SingleScene();
