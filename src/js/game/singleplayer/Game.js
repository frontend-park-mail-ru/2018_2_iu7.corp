import Bus from '../modules/Bus.js';
import Scene from './Scene.js';

class Game {
	constructor () {
        this._scene = new Scene();
        
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
		// this._socket.send('ready');
		// this.update();
		Bus.emit('scene-start'); // TODO заменить все события на single-событие
	}
    
    onKeyDown (e) {
		console.log('keycode', e.keyCode);
		if (e.keyCode === 38 /* up */ || e.keyCode === 87 /* w */ || e.keyCode === 90 /* z */) {
            Bus.emit('user', {dx:0, dy:1});
            // this._socket.send("up");
			// this.update();
		}
		if (e.keyCode === 39 /* right */ || e.keyCode === 68 /* d */) {
            Bus.emit('user', {dx:1, dy:0});
			// this._socket.send("right");
			// this.update();
		}
		if (e.keyCode === 40 /* down */ || e.keyCode === 83 /* s */) {
            Bus.emit('user', {dx:0, dy:-1});
			// this._socket.send("down");
			// this.update();
		}
		if (e.keyCode === 37 /* left */ || e.keyCode === 65 /* a */ || e.keyCode === 81 /* q */) {
            Bus.emit('user', {dx:-1, dy:0});
			// this._socket.send("left");
			// this.update();
		}
	}
}