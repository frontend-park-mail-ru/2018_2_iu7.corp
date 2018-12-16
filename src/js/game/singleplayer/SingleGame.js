import Bus from '../../modules/Bus.js';
import SingleScene from './SingleScene.js';
import Controls from '../controls/Controls.js';

class SingleGame {
	constructor () {
		this._scene = new SingleScene();
		this._registeredActions = false;
		this.halfWidth = window.innerWidth/2;
		this._controls = new Controls();
        
	}

	resize(){
		console.log("wsgdgff")
		/// TODO resize canvas
		this._scene.resize();
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

		this._scene.init(firstLayer, firstLayerContext, secondLayer, secondLayerContext);
		this._controls.init(controlsLayer);
    }

    start () {
		console.log('Game start');
		Bus.emit('single-scene-start');
	}
}

export default new SingleGame();