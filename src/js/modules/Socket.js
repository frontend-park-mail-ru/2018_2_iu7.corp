export default class Socket {
    constructor (roomId) {
        this._socket = null;
        this._roomId = roomId;
    }

    connectionOpen () {
        this._socket = new WebSocket(`ws://80.252.155.65:8100/multiplayer/rooms/${this._roomId}/ws`);
        this._socket.onopen = function (event) {
			
			console.log('connection started');
			console.log(event);

			let tmpMsq = {
				type: 'auth',
				data: {
					auth_token: "kek",
					user_agent: "lol"
				} 
			}
			
			this.send(JSON.stringify(tmpMsq));
			console.log("Msg been sent")
			
        };
        this.update();
    }

    connectionClosed () {
        this._socket.close();
    }
    
    update () {
        this._socket.onmessage = function (event) {
			console.log('privet');
            console.log(event.data);
            Bus.emit('multiplayer-' + event.data.type, event.data);
			// this._incomingData = JSON.parse(event.data);
			// console.log('income: ', this._incomingData); 
		};
    }
}