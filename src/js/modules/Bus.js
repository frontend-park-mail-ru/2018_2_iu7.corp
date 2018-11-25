export class Bus {
	constructor () {
		this._listeners = {};
	}

	on (event, callback) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push({ callback });		
	}

	off (event, callback) {
		this._listeners[event] = this._listeners[event].filter((listener) => {
			return listener.callback !== callback;
		});
	}

	emit (event, data) {
		this._listeners[event].forEach((listener) => {
			listener.callback(data);
		});
		
	}
}

export default new Bus();
