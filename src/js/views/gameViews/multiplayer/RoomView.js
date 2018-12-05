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
		this._navigationController = new NavigationController();
        Bus.on('done-get-user', this._setCurrentUser.bind(this));
        Bus.on('done-get-target-room', this._setCurrentRoomId.bind(this));
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
		this._socket = new WebSocket(`ws://80.252.155.65:8100/multiplayer/rooms/${this._currentRoomId}/ws`);
		this.update();
        this._socket.onopen = function (event) {
			
			console.log('connection started');
			console.log(event);
		};
		// this.update();
		super.show();
		this.registerActions();
    }


    update () {
        this._socket.onmessage = function (event) {
			console.log('privet');
            console.log(event.data);
            // let incomingData = JSON.parse(event.data);
            
            // this.render(incomingData);
		};
    }

	render (data) {
		if (!this._currentUser.is_authenticated) {
			data.headerValues = notAuthMenuHeader();
			super.render(data);
		} else {
			data.headerValues = authMenuHeader(this._currentUser.id);
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
