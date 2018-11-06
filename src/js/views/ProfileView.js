import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
const profileTmpl = require('./templates/profile.pug');
const header = require('./templates/header.pug');

export default class ProfileView extends BaseView {
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
		
		this.viewDiv.innerHTML += header({ title: 'Profile' });

		this._navigationController = new NavigationController();

		let main = document.createElement('main');

		if (!user.is_authenticated) {
			const span = document.createElement('span');
			span.innerText = 'You are not singed in to see your profile'
			main.appendChild(span);
			this.viewDiv.appendChild(main);
			return;
		}



		main.innerHTML += profileTmpl({ usr: user });

		this.viewDiv.appendChild(main);

		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

		Bus.off('done-get-user', this.render.bind(this));
	}
}
