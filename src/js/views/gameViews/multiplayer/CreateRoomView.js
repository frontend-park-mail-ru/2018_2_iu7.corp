import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import CreateRoomValidator from '../../../validators/CreateRoomValidator.js';
import FormController from '../../../controllers/FormController.js';

import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';
const createRoomTmpl = require('../../templates/form.pug');
const showRoomLinkTmpl = require('../../templates/gameTemplates/showRoomLink.pug');



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
			type: 'number',
			placeholder: 'Максмальное количество игроков',
			errorId: 'max_num_players_error'
		},
		{
			id: 'time_limit_input',
			name: 'time_limit',
			type: 'number',
			placeholder: 'Длительность игры (минуты)',
			errorId: 'time_limit_error'
		},
		{
			id: 'width_input',
			name: 'width',
			type: 'number',
			placeholder: 'ширина поля',
			errorId: 'width_error'
		},
		{
			id: 'height_input',
			name: 'height',
			type: 'number',
			placeholder: 'высота поля',
			errorId: 'height_error'
		}
	]
};

export default class CreateRoomView extends BaseView {
	constructor () {
		super(createRoomTmpl);
		this._currentUser = null;
		this._registeredActions = false;
		this._navigationController = new NavigationController();
		this._formController = new FormController('createroom', CreateRoomValidator);
		Bus.on('done-get-user', this.render.bind(this));
		Bus.on('done-create-room', this.showLink.bind(this));
	}

	show () {
		console.log('create room show');
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		console.log('render create room');
		this._template = createRoomTmpl;
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
		console.log('show link');
		this._template = showRoomLinkTmpl;
		const data = {
			linkHref: `/room/${roomData.id}`
		};
		if (!this._currentUser.is_authenticated) {
			data.headerValues = notAuthMenuHeader();
			super.render(data);
		} else {
			data.headerValues = authMenuHeader(this._currentUser.id);
			super.render(data);
		}
	} 




	registerActions () {
		if (!this._registeredActions) {
			this.viewDiv.addEventListener('submit', this._formController.createRoomCallbackSubmit.bind(this._formController));
			this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
			this._registeredActions = true;
		}
	}
}
