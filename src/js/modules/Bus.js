import { type } from "os";

// export class Bus {
// 	constructor () {
// 		this._listeners = {};
// 	}

// 	on (event, callback) {
// 		if (!this._listeners[event]) {
// 			this._listeners[event] = [];
// 		}
// 		this._listeners[event].push({ callback });
// 	}

// 	off (event, callback) {
// 		this._listeners[event] = this._listeners[event].filter((listener) => {
// 			return listener.callback !== callback;
// 		});

// 	}

// 	totalOff (event) {
// 		this._listeners[event] = [];
// 	}

// 	emit (event, data) {
// 		this._listeners[event].forEach((listener) => {
// 			listener.callback(data);
// 		});
// 	}
// }

// export default new Bus();


export class Bus {
	constructor () {
		this._listeners = {};
	}

	on (event, callbackData) {
		if (!this._listeners[event]) {
			this._listeners[event] = [];
		}
		this._listeners[event].push(callbackData);
	}

	off (event, callbackName) {
		this._listeners[event] = this._listeners[event].filter((listener) => {
			return listener.callbackName !== callbackName;
		});
	}

	totalOff (event) {
		this._listeners[event] = [];
	}

	emit (event, data) {
		this._listeners[event].forEach((listener) => {
			listener.callback(data);
		});
	}
}

export default new Bus();
