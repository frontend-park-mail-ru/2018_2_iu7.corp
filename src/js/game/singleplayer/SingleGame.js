import Bus from '../../modules/Bus.js';
import SingleScene from './SingleScene.js';
import Controls from '../controls/Controls.js';

export default class SingleGame {
	constructor () {
		this._scene = new SingleScene();
		this._registeredActions = false;
		this._controls = new Controls('singleplayer'); // режим контролов влиет на тип отправки сообщения в Bus
	}

	init () {
		console.log('Game init');

		const controlsLayer = document.getElementById('canvasControls');
		const firstLayer = document.getElementById('canvas1');
		const firstLayerContext = firstLayer.getContext('2d');

		const secondLayer = document.getElementById('canvas2');
		const secondLayerContext = secondLayer.getContext('2d');
		

		const width = window.innerWidth;
		const height = window.innerHeight * 0.8;
		
		firstLayer.width = width;
		firstLayer.height = height;

		secondLayer.width = width;
		secondLayer.height = height;

		controlsLayer.width = width;
		controlsLayer.height = height;

		controlsLayer.width = window.innerWidth;
		controlsLayer.height = window.innerHeight;

		this._scene.init(firstLayer, firstLayerContext, secondLayer, secondLayerContext);
		if (!this._registeredActions) {
			this._controls.init(controlsLayer);
			this._registeredActions = true;
		}
	}

    start () {
		console.log('Game start');
		Bus.emit('single-scene-start');
	}

}

// export default new SingleGame();
