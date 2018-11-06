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

		this.viewDiv.innerHTML += header({ title: 'Change Settings' });

		this._navigationController = new NavigationController();
		this._formController = new FormController('change');

		const main = document.createElement('main');

		if (!user.is_authenticated) {
			const span = document.createElement('span');
			span.innerText = 'You are not singed in to change your settings';
			main.appendChild(span);
			this.viewDiv.appendChild(main);
			return;
		}

		main.innerHTML += form(data);
		this.viewDiv.appendChild(main);

		main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

		Bus.off('done-get-user', this.render.bind(this));
	}
}
