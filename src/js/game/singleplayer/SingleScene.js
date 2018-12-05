import BaseScene from '../BaseScene.js';
import Bus from '../../modules/Bus.js';
import Field from '../components/field/field.ts';
import Player from '../components/player/player.ts'
import { matr } from '../GameConfig.js';

export default class SingleScene extends BaseScene {
    constructor () {
        super();
        this._field = null;
		this._player = null;
    }

    init(canvas, ctx) {
        super.init(canvas, ctx);
        this._field = new Field(matr, this._ctx);
		this._player = new Player(1, 1, 1, this._ctx); 
		Bus.on('single-field', this.updateGameField.bind(this));
		Bus.on('single-user', this.updateUsers.bind(this));
		Bus.on('single-scene-start', this.startLoop.bind(this));
    }

    updateUsers (data) {
        this._player.update(this._player.xPos + data.dx, this._player.yPos + data.dy, this._field.bricksInField);
    }
}