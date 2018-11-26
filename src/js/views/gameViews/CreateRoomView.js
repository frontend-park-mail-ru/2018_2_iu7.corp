import BaseView from '../BaseView.js';
import Bus from '../../modules/Bus.js';
import NavigationController from '../../controllers/NavigationController.js';

import FormController from '../../controllers/FormController.js';

import { authMenuHeader, notAuthMenuHeader } from '../dataTemplates/headerMenuData.js';
const createRoomTmpl = require('../templates/form.pug');
const showRoomLinkTmpl = require('../templates/gameTemplates/showRoomLink.pug');


const userData = {
	title: 'createroom',
	id: 'createroom',
	actionError: 'createroomError',
	actionErrorMessage: 'неудалось создать игру(',
	fields: [
		{
			id: 'title_input',
			name: 'title',
			type: 'text',
			placeholder: 'название комнаты',
			errorId: 'title_error'
		},
		{
			id: 'max_num_players_input',
			name: 'max_num_players',
			type: 'text',
			placeholder: 'Максмальное количество игроков',
			errorId: 'max_num_players_error'
		},
		{
			id: 'time_input',
			name: 'time',
			type: 'text',
			placeholder: 'Длительность игры (минуты)',
			errorId: 'time_error'
		}
	]
};

export default class CreateRoomView extends BaseView {
	constructor () {
		super(createRoomTmpl);
		this._currentUser = null;
		this._navigationController = new NavigationController();
		this._formController = new FormController('createroom');
		Bus.on('done-get-user', this.render.bind(this));
		Bus.on('done-create-room', this.showLink.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		this._currentUser = user;
		if (!user.is_authenticated) {
			userData.headerValues = notAuthMenuHeader();
			super.render(userData);
		} else {
			userData.headerValues = authMenuHeader(this._currentUser.id);
			super.render(userData);
		}
	}

	showLink(roomData) {
		console.log('im working', roomData.id);
		this._template = showRoomLinkTmpl;
		// super.hide();
		const data = {
			linkHref: `/room/${roomData.id}`
		};
		if (!this._currentUser.is_authenticated) {
			console.log('im working 1', roomData.id);
			data.headerValues = notAuthMenuHeader();
			super.render(data);
		} else {
			console.log('im working 2', roomData.id);
			data.headerValues = authMenuHeader(this._currentUser.id);
			super.render(data);
		}
	} 




	registerActions () {
		this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
