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
	actionErrorMessage: 'Неудалось создать игру(',
	fields: [
		{
			id: 'title_input',
			name: 'title',
			type: 'text',
			placeholder: 'Название комнаты',
			errorId: 'title_error'
		},
		{
			id: 'max_num_players_input',
			name: 'max_num_players',
			type: 'range',
			min: '2',
			max: '4',
			value: '4',
			class: 'slider',
			placeholder: 'Максмальное количество игроков',
			errorId: 'max_num_players_error'
		},
		{
			id: 'time_limit_input',
			name: 'time_limit',
			type: 'range',
			min: '5',
			max: '10',
			value: '5',
			class: 'slider',
			placeholder: 'Длительность игры (минуты)',
			errorId: 'time_limit_error'
		},
		{
			id: 'width_input',
			name: 'width',
			type: 'range',
			min: '20',
			max: '100',
			value: '20',
			class: 'slider',
			placeholder: 'Ширина поля',
			errorId: 'width_error'
		},
		{
			id: 'height_input',
			name: 'height',
			type: 'range',
			min: '20',
			max: '100',
			value: '20',
			class: 'slider',
			placeholder: 'Высота поля',
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

	showLink (roomData) {
		this._template = showRoomLinkTmpl;
		const data = {
			linkHref: `/room/${roomData.id}`,
			roomNumber: roomData.id
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
