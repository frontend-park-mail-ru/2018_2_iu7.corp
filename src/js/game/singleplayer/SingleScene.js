import BaseScene from '../BaseScene.js';
import Bus from '../../modules/Bus.js';
import Router from '../../modules/Router.js';
import GameBus from '../GameBus.ts';
import Field from '../components/field/field.ts';
import Player from '../components/player/player.ts'
import { matr } from '../GameConfig.js';

import *  as sprites from '../SpriteImports.js';

export default class SingleScene extends BaseScene {
    constructor () {
        super();
        this._field = null;
        this._player = null;
    }

    init(firstLayer, firstLayerContext, secondLayer, secondLayerContext) {
        super.init(firstLayer, firstLayerContext, secondLayer, secondLayerContext);

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
        
        this._player = new Player(1, 1, 1, sprites.playerSprites, sprites.bombSprites, this._secondLayerContext); 
        this._field = new Field(matr, sprites.fieldSprites, this._firstLayerContext);
        // вместо передачи поля через конструктор
        this._player.setField(this._field.bricksInField);

		Bus.on('single-field', this.updateGameField.bind(this));
        Bus.on('single-user', this.updateUsers.bind(this));
        Bus.on('single-setBomb', this.updateBombs.bind(this));
        Bus.on('single-bomb-explosion', this.updateBombs.bind(this))
        Bus.on('single-scene-start', this.startLoop.bind(this));
        GameBus.on('single-player-death', this.updateGame.bind(this));
    }

    updateUsers (data) {
        // console.log(data);
        this._player.update(this._player.xPos + data.dx, this._player.yPos + data.dy, this._field.bricksInField, data.pointer);
    }

    updateBombs () {
        this._player.plantBomb();
    }

    updateGame () {
        Bus.totalOff('single-field');
        Bus.totalOff('single-user');
        Bus.totalOff('single-setBomb');
        Bus.totalOff('single-bomb-explosion')
        Bus.totalOff('single-scene-start');

        GameBus.totalOff('single-bomb-plant');
        GameBus.totalOff('single-player-death');
        GameBus.totalOff('single-bomb-explode');

        Router.open('/');
    }
}