import Bus from '../../modules/Bus.js';
import SingleScene from './SingleScene.js';

export default class SingleGame {
	constructor () {
		this._scene = new SingleScene();
		this._registeredActions = false;
	}

	init () {
		console.log('Game init');
		const firstLayer = document.getElementById('canvas1');
		const firstLayerContext = firstLayer.getContext('2d');

		const secondLayer = document.getElementById('canvas2');
		const secondLayerContext = secondLayer.getContext('2d');

		firstLayer.width = window.innerWidth;
		firstLayer.height = window.innerHeight// * 0.7;

		secondLayer.width = window.innerWidth;
		secondLayer.height = window.innerHeight //* 0.7;

		this._scene.init(firstLayer, firstLayerContext, secondLayer, secondLayerContext);
		if (!this._registeredActions) {
			document.body.addEventListener('keydown', this.onKeyDown.bind(this), true);
			this._registeredActions = true;
		}
	}

	start () {
		console.log('Game start');
		Bus.emit('single-scene-start');
	}

    onKeyDown (e) {
		// console.log('keycode', e.keyCode);
		if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
			Bus.emit('single-user', { dx: 0, dy: -1 });
		}
		if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
           		Bus.emit('single-user', { dx: 1, dy: 0 });
		}
		if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            	Bus.emit('single-user', { dx: 0, dy: 1 });
		}
		if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            	Bus.emit('single-user', { dx: -1, dy: 0 });
		}
		if (e.keyCode === 70) {
            	Bus.emit('single-setBomb');
		}
	}

	end () {
		console.log('end');
		document.body.removeEventListener('keydown', this.onKeyDown.bind(this), true);
	}
}

// export default new SingleGame();
