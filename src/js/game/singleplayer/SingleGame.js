import Bus from '../../modules/Bus.js';
import SingleScene from './SingleScene.js';

class SingleGame {
	constructor () {
        this._scene = new SingleScene();
        
	}

	init () {
		console.log('Game init');
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext('2d');
		this._scene.init(canvas, ctx);
		document.addEventListener('keydown', this.onKeyDown.bind(this));
    	}

    	start () {
		console.log('Game start');
		Bus.emit('single-scene-start'); // TODO заменить все события на single-событие
	}
    
    	onKeyDown (e) {
		// console.log('keycode', e.keyCode);
		if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
			Bus.emit('single-user', {dx:0, dy:-1});
		}
		if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
           		Bus.emit('single-user', {dx:1, dy:0});
		}
		if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            	Bus.emit('single-user', {dx:0, dy:1});
		}
		if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            	Bus.emit('single-user', {dx:-1, dy:0});
		}
		if (e.keyCode === 70) {
            	Bus.emit('single-setBomb');
		}
	}
}

export default new SingleGame();