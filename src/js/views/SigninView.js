import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
const form = require('./templates/form.pug');
const header = require('./templates/header.pug');

const data = {
	id: 'signin',
	actionError: 'signInError',
	actionErrorMessage: 'Incorrect login or password',
	fields: [
		{
			id: 'username_input',
			name: 'username',
			type: 'text',
			placeholder: 'Username',
			errorId: 'username_error'
		},
		{
			id: 'password_input',
			name: 'password',
			type: 'password',
			placeholder: 'Password',
			errorId: 'password_error'
		}
	]
};

export default class SigninView extends BaseView {
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
			console.log('You are already registered and even logged in!');
			return;
		}

		this.viewDiv.innerHTML += header({ title: 'Login' });

		this._navigationController = new NavigationController();
		this._formController = new FormController('signin');

		let main = document.createElement('main');
		main.innerHTML += form(data);

		this.viewDiv.appendChild(main);

		main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

		Bus.off('done-get-user', this.render.bind(this));
	}

	static showUnsuccessMessage () {
		let errorField = document.getElementById('signInError');
		errorField.removeAttribute('hidden');
	}
}
