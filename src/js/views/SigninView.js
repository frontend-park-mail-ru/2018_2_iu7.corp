import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import ProfileController from '../controllers/ProfileController.js';
import ProfileModel from '../models/ProfileModel.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

const data = {
	title: 'Sign in',
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
		super(form);
		this._navigationController = new NavigationController();
		this._profileController = new ProfileController();
		this._profileModel = new ProfileModel();
		this._formController = new FormController('signin');
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
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
				title: 'Sign in',
				message: 'You have been already signed in'
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

	static showUnsuccessMessage () {
		let errorField = document.getElementById('signInError');
		errorField.removeAttribute('hidden');
	}
}
