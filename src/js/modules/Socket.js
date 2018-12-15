import { setCookie, getCookie, deleteCookie } from '../utils.js';
import Bus from '../modules/Bus.js';
import Router from './Router.js';

export default class Socket {

	constructor () {
		this._socket = null;
		Bus.on('multiplayer-send-message', this.sendMessage.bind(this));
	}

	setRoomId (roomId) {
		this._roomId = roomId;
	}

	connectionOpen () {
		this._socket = new WebSocket(`ws://80.252.155.65:8100/multiplayer/rooms/${this._roomId}/ws`);
		this._socket.onopen = function (event) {
			console.log('connection started');
			let tmpMsq = {
				type: 'auth',
				data: {
					auth_token: 'kek',
					user_agent: 'lol'
				}
			};

			this.send(JSON.stringify(tmpMsq));
		};
		this.update();
	}

	connectionClosed () {
		this._socket.close();
	}

	update () {
		this._socket.onmessage = function (event) {
			const response = JSON.parse(event.data);

			if (response.type === 'room'){
				// console.log('room data', response);
				Bus.emit('multiplayer-' + response.type + '-' + response.data.state, response.data);
			} 

			else if (response.type === 'object') {
				// console.log('object data', response);
				// console.log(Bus._listeners);
				Bus.emit('multiplayer-' + response.type + '-' + response.data.object_type, response.data);
			} 
			else if (response.type === 'ticker') {
				console.log('ticker data', )
			}
		};
	}

	sendMessage(message) {
		this._socket.send(message);
	}


	startGame () {
		this._socket.send('game.start');
	}


	stopGame () {
		this._socket.send('game.end');
	}
}
