import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import SignUpValidator from '../validators/SignUpValidator.js';

const form = require('./templates/form.pug');
const header = require('./templates/header.pug');

const data = {
	id: 'signup',
	actionError: 'signUpError',
	actionErrorMessage: 'Such user has already been created',
	fields: [
		{
			id: 'username_input',
			name: 'username',
			type: 'text',
			placeholder: 'Username',
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
			placeholder: 'Password',
			errorId: 'password_error'
		},
		{
			id: 'password_repeat_input',
			name: 'password_repeat',
			type: 'password',
			placeholder: 'Confirm password',
			errorId: 'password_repeat_error'
		}
	]
};

export default class SignupView extends BaseView {
	constructor () {
		super();
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
	}

	render (user) {
		super.render();

		if (user.is_authenticated) {
			console.log('You have been already registered and signed in!');
			return;
		}

		this.viewDiv.innerHTML += header({ title: 'Registration' });

		this._navigationController = new NavigationController();
		this._formController = new FormController('signup', SignUpValidator);

		let main = document.createElement('main');
		main.innerHTML += form(data);

		this.viewDiv.appendChild(main);

		main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

		Bus.off('done-get-user', this.render.bind(this));
	}

	static showUnsuccessMessage () {
		let errorField = document.getElementById('signUpError');
		errorField.removeAttribute('hidden');
	}
}
