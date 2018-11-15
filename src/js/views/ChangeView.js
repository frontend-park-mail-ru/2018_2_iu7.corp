import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import ProfileController from '../controllers/ProfileController.js';
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
		this._profileController = new ProfileController();
		Bus.on('done-get-user', this._profileController._checkUserBeforeChange.bind(this)); // проверка полученного пользователя
		Bus.on('verified-user-change', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user'); // получаем пользователя
		super.show();
		this.registerActions();
	}

	render (userData) {
		if (userData.user.is_authenticated) {
			if (userData.idMatching) { // если залогининный пользователь пытается изменить свои данные
				this._template = form;
				super.render(data);
			} else { // если не свои
				const permissionMessageData = {
					title: 'Change settings',
					message: 'You can not change someone`s settings'
				};
				this._template = permissionMessageTmpl;
				super.render(permissionMessageData);
			}
		} else { // если не залогинен
			const permissionMessageData = {
				title: 'Change settings',
				message: 'You are not singed in to change your settings'
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
