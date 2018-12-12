import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import Socket from '../../../modules/Socket.js';
import NavigationController from '../../../controllers/NavigationController.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const roomTmpl = require('../../templates/gameTemplates/room.pug');

// const data = {};

export default class RoomView extends BaseView {
	constructor () {
        super(roomTmpl);
        this._currentUser = null;
		this._currentRoomId = null;
		this._connection = new Socket();
		this._navigationController = new NavigationController();
        Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('done-get-target-room', this._setCurrentRoomId.bind(this));
		Bus.on('multiplayer-room', this.render.bind(this));
    }
    

    _setCurrentUser (user) {
		this._currentUser = user;
    }    _setCurrentUser (user) {
		this._currentUser = user;
    }
    
    _setCurrentRoomId (id) {
		this._currentRoomId = id;
	}

	show () {
		// console.log('roomView show');
        Bus.emit('get-user');
		Bus.emit('get-target-room');
		Bus.emit('start-connection');
		this._connection.connectionOpen();
		
		this.update();
		super.show();
		this.registerActions();
    }

	render (user) {
		console.log("LOG user in render: ", user)
		const data = {};
		if (!user.is_authenticated) {
			
			data.headerValues = notAuthMenuHeader();
			console.log('common', data)
			super.render(data);
		} else {
			user.headerValues = authMenuHeader(user.id);
			super.render(data);
		}
	}
	hide () {
		super.hide();
		this._connection.connectionClosed();
		console.log('connection closed')
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
