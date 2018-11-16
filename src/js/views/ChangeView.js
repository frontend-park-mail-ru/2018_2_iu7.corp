import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import ProfileController from '../controllers/ProfileController.js';
import ProfileModel from '../models/ProfileModel.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

const data = {
	title: 'Change Settings',
	id: 'change',
	fields: [
		{
			id: 'username_input',
			name: 'username',
			type: 'text',
			placeholder: 'New username',
			errorId: 'username_error'
		},
		{
			id: 'email_input',
			name: 'email',
			type: 'email',
			placeholder: 'New email',
			errorId: 'email_error'
		}
	]
};

export default class ChangeView extends BaseView {
	constructor () {
		super(form);
		this._navigationController = new NavigationController();
		this._formController = new FormController('change');
		this._profileModel = new ProfileModel();
		this._profileController = new ProfileController();
		console.log('CHANGE ON PROFILE-RENDER: ');
		Bus.on('done-check-permissions', this.render.bind(this));
	}

	show () {
		console.log('CHANGE SHOW');
		Bus.emit('check-user-permissions'); // говорим profileController проверить может ли пользователь изменять данные
		super.show();
		this.registerActions();
	}

	render(renderData) {
		if (renderData.myProfile) { // если пользователь залогинен и хочет посмотреть свой профиль
			this._template = form;
			super.render(data);
		} else { // если не залогинен 
			const permissionMessageData = {
				title: 'Change settings',
				message: 'You can not change someone`s settings'
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
		Bus.off('done-check-permissions', this.render.bind(this));
	}


	registerActions () {
		this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
