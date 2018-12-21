import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import SignUpValidator from '../validators/SignUpValidator.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

const data = {
	headerValues: [
		{
			label: 'Вход',
			href: '/signin'
		},
		{
			label: 'Регистрация',
			href: '/signup'
		},
		{
			label: 'Таблица лидеров',
			href: '/leaderboard'
		}
	],
	title: 'Registration',
	id: 'signup',
	actionError: 'signUpError',
	actionErrorMessage: 'Такой пользователь уже существует',
	fields: [
		{
			id: 'username_input',
			name: 'username',
			type: 'text',
			placeholder: 'Имя пользователя',
			errorId: 'username_error'
		},
		{
			id: 'email_input',
			name: 'email',
			type: 'email',
			placeholder: 'Email',
			errorId: 'email_error'
		},
		{
			id: 'password_input',
			name: 'password',
			type: 'password',
			placeholder: 'Пароль',
			errorId: 'password_error'
		},
		{
			id: 'password_repeat_input',
			name: 'password_repeat',
			type: 'password',
			placeholder: 'Подтвердите пароль',
			errorId: 'password_repeat_error'
		}
	]
};

export default class SignupView extends BaseView {
	constructor () {
		super(form);
		this._navigationController = new NavigationController();
		this._formController = new FormController('signup', SignUpValidator);
		this._registeredActions = false;
	}

	show () {
		Bus.on('done-get-user', { callbackName : 'SignupView.render', callback : this.render.bind(this)});
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
				headerValues: [
					{
						label: 'Профиль',
						href: `/profile/${user.id}`
					},
					{
						label: 'Таблица лидеров',
						href: '/leaderboard'
					},
					{
						label: 'Выйти',
						href: '/signout'
					}
				],
				title: 'Регистрация',
				message: 'Вы уже зарегистрированны и вошли в систему'
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'SignupView.render');
	}

	registerActions () {
		if (!this._registeredActions) {
			this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
			this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
			this._registeredActions = true;
		}
	}

	static showUnsuccessMessage () {
		const errorField = document.getElementById('signUpError');
		// errorField.innerText = message
		errorField.removeAttribute('hidden');
	}
}
