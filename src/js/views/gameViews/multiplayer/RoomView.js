import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const roomTmpl = require('../../templates/gameTemplates/room.pug');

// const data = {};

export default class RoomView extends BaseView {
	constructor () {
        super(roomTmpl);
        this._currentUser = null;
		this._currentRoomId = null;
		this._socket = null;
		this._incomingData = null;
		this._navigationController = new NavigationController();
        // Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('done-get-target-room', this._setCurrentRoomId.bind(this));
		Bus.on('done-get-user', this.render.bind(this));
    }
    

    _setCurrentUser (user) {
		this._currentUser = user;
    }
    
    _setCurrentRoomId (id) {
		this._currentRoomId = id;
	}

	show () {
		console.log('roomView show');
        Bus.emit('get-user');
        Bus.emit('get-target-room');
		console.log('rooom',this._currentRoomId);
		// ws://80.252.155.65:8100/multiplayer/rooms/${this._currentRoomId}/ws
		this._socket = new WebSocket(`ws://80.252.155.65:8100/multiplayer/rooms/${this._currentRoomId}/ws`);
		// this.update();
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
		super.show();
		this.registerActions();
    }


    update () {
        this._socket.onmessage = function (event) {
			console.log('privet');
            console.log(event.data);
			this._incomingData = JSON.parse(event.data);
			console.log('income: ', this._incomingData)
            
            
		};
		// this.render(incomingData);
    }

	render (user) {
		console.log("LOG user in render: ", user)
		const data = {};
		if (!user.is_authenticated) {
			
			data.headerValues = notAuthMenuHeader();
			data.roomData = this._incomingData;
			console.log('common', data)
			super.render(data);
		} else {
			user.headerValues = authMenuHeader(user.id);
			super.render(data);
		}
	}
	hide () {
		super.hide();
		this._socket.close();
		console.log('connection closed')
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
