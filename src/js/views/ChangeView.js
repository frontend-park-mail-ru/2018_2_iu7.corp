import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';

const form = require('./templates/form.pug');
const header = require('./templates/header.pug');

const data = {
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
		// {
		//     id: 'password_input',
		//     name: 'password',
		//     type: 'password',
		//     placeholder: 'New password',
		//     errorId: 'password_error'
		// },
		// {
		//     id: 'password_repeat_input',
		//     name: 'password_repeat',
		//     type: 'password',
		//     placeholder: 'Confirm password',
		//     errorId: 'password_repeat_error'
		// }
	]
};

export default class ChangeView extends BaseView {
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

		if (!user.is_authenticated) {
			console.log('You are not logged in!');
			return;
		}

		this.viewDiv.innerHTML += header({ title: 'Change Settings' });

		this._navigationController = new NavigationController();
		this._formController = new FormController('change');

		let main = document.createElement('main');
		main.innerHTML += form(data);

		this.viewDiv.appendChild(main);

		main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

		Bus.off('done-get-user', this.render.bind(this));
	}
}
