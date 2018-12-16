// import Bus from '../../modules/Bus.js';
// import MultiPlayerScene from './MultiPlayerScene.js';

// class MultiPlayerGame {
// 	constructor () {
// 		this._scene = new MultiPlayerScene();
// 		// this._registeredActions = false;
// 	}

// 	init () {
// 		console.log('Multiplayer Game init');
// 		const firstLayer = document.getElementById('canvas1');
// 		const firstLayerContext = firstLayer.getContext('2d');

// 		const secondLayer = document.getElementById('canvas2');
// 		const secondLayerContext = secondLayer.getContext('2d');

// 		firstLayer.width = window.innerWidth;
// 		firstLayer.height = window.innerHeight //* 0.7;

// 		secondLayer.width = window.innerWidth;
// 		secondLayer.height = window.innerHeight //* 0.7;

// 		this._scene.init(firstLayer, firstLayerContext, secondLayer, secondLayerContext);
// 		// if (!this._registeredActions) {
// 		// 	document.addEventListener('keydown', this.onKeyDown.bind(this));
// 		// 	this._registeredActions = true;
// 		// }
// 	}

// 	start () {
// 		console.log('Multiplayer Game start');
// 		Bus.emit('multiplayer-scene-start');
// 	}

// 	// onKeyDown (e) {
// 	// 	// console.log('keycode', e.keyCode);
// 	// 	if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
// 	// 		Bus.emit('multi-user', { dx: 0, dy: -1, pointer: 1 });
// 	// 	}
// 	// 	if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
//     //        		Bus.emit('multi-user', { dx: 1, dy: 0, pointer: 2 });
// 	// 	}
// 	// 	if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
//     //         	Bus.emit('multi-user', { dx: 0, dy: 1, pointer: 3 });
// 	// 	}
// 	// 	if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
//     //         	Bus.emit('multi-user', { dx: -1, dy: 0, pointer: 4 });
// 	// 	}
// 	// 	if (e.keyCode === 70) {
//     //         	Bus.emit('multi-setBomb');
// 	// 	}
// 	// }
// }

// export default new MultiPlayerGame();