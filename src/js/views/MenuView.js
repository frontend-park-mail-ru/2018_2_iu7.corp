import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';

const menu = require('./templates/menu.pug');

const notAuthLinks = [
	{
		label: 'Sign in',
		href: '/signin'
	},
	{
		label: 'Sign up',
		href: '/signup'
	},
	{
		label: 'Leaders',
		href: '/leaders'
	}
];

const authLinks = [
	{
		label: 'Leaders',
		href: '/leaders'
	},
	{
		label: 'Profile',
		href: '/profile'
	},
	{
		label: 'Sign out',
		href: '/signout'
	}
];

export default class MenuView extends BaseView {
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
		this._navigationController = new NavigationController();

		let main = document.createElement('main');
		if (user.is_authenticated) {
			main.innerHTML += menu({ values: authLinks });
		} else {
			main.innerHTML += menu({ values: notAuthLinks });
		}
		this.viewDiv.appendChild(main);

		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
		Bus.off('done-get-user', this.render.bind(this));
	}
}
