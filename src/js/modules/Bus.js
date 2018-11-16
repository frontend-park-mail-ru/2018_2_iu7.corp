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
			return listener !== callback;
		});
		console.log('LISTENERS',this._listeners);
	}

	emit (event, data) {
		this._listeners[event].forEach((listener) => {
			listener.callback(data);
		});
	}
}

export default new Bus();
