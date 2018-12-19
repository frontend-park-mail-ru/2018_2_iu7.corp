import BaseScene from '../BaseScene.js';
import Bus from '../../modules/Bus.js';
import Router from '../../modules/Router.js';
import GameBus from '../GameBus.ts';
import Field from '../components/field/field.ts';
import Player from '../components/player/player.ts';
import Controls from '../controls/Controls.js';
import { matr } from '../GameConfig.js';

import * as sprites from '../SpriteImports.js';

class SingleScene extends BaseScene {
	constructor () {
		super(); // нужно оставить даже если в BaseScene нет констурктора, иначе this - undefined
		this._field = null;
		this._players = [];
		this._registeredActions = false;
		this._controls = new Controls('singleplayer'); // режим контролов влиет на тип отправки сообщения в Bus

		Bus.on('single-user', this.updateUsers.bind(this));
		Bus.on('single-setBomb', this.updateBombs.bind(this));
		Bus.on('single-bomb-explosion', this.updateBombs.bind(this));
		Bus.on('single-scene-start', this.startLoop.bind(this));
		GameBus.on('single-player-death', this.updateGame.bind(this));
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
		const player = new Player(1, 1, 1, sprites.playerSprites, sprites.bombSprites, sprites.flameSprites);
		this._players.push(player);
		this._field = new Field(matr, sprites.fieldSprites, this.firstLayerContext);
		// вместо передачи поля через конструктор
		this._players[0].setField(this._field.bricksInField);
		this._players[0].setCanvasContext(this.secondLayerContext);

		if (!this._registeredActions) {
			this._controls.init(this.controlsLayer);
			this._registeredActions = true;
		}
	}

	updateUsers (data) {
		this._players[0].update(this._players[0].xPos + data.dx, this._players[0].yPos + data.dy, this._field.bricksInField);
	}

	updateBombs () {
		this._players[0].plantBomb();
	}

	updateGame () {
		Bus.totalOff('single-field');
		Bus.totalOff('single-user');
		Bus.totalOff('single-setBomb');
		Bus.totalOff('single-bomb-explosion');
		Bus.totalOff('single-scene-start');

		GameBus.totalOff('single-bomb-plant');
		GameBus.totalOff('single-player-death');
		GameBus.totalOff('single-bomb-explode');

		Router.open('/');
	}
}

export default new SingleScene();
