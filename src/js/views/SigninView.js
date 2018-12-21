import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import { authMenuHeader, notAuthMenuHeader } from '../views/dataTemplates/headerMenuData.js';
import SignInValidator from '../validators/SignInValidator.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

const data = {
	headerValues: notAuthMenuHeader(),
	title: 'Вход',
	id: 'signin',
	actionError: 'signInError',
	actionErrorMessage: 'Неверные логин или пароль',
	fields: [
		{
			id: 'username_input',
			name: 'username',
			type: 'text',
			placeholder: 'Имя пользователя',
			errorId: 'username_error'
		},
		{
			id: 'password_input',
			name: 'password',
			type: 'password',
			placeholder: 'Пароль',
			errorId: 'password_error'
		}
	]
};

export default class SigninView extends BaseView {
	constructor () {
		super(form);
		this._navigationController = new NavigationController();
		this._formController = new FormController('signin', SignInValidator); // TODO добавить валидатор на пустую форму
		this._registeredActions = false;
	}

	show () {
		Bus.on('done-get-user', { callbackName : 'SigninView.render', callback : this.render.bind(this)});
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (!user.is_authenticated) {
			this._template = form;
			super.render(data);
		} else {
			const permissionMessageData = {
				headerValues: authMenuHeader(user.id),
				title: 'Вход',
				message: 'Вы уже вошли в свой профиль'
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'SigninView.render');
	}

	registerActions () {
		if (!this._registeredActions) {
			this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
			this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
			this._registeredActions = true;
		}
	}

	static showUnsuccessMessage () {
		let errorField = document.getElementById('signInError');
		errorField.removeAttribute('hidden');
	}
}
