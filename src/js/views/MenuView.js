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
		label: 'Leaderboard',
		href: '/leaderboard'
	}
];

export default class MenuView extends BaseView {
	constructor () {
		super(menu);

		this._navigationController = new NavigationController();
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (user.is_authenticated) {
			const authLinks = [
				{
					label: 'Leaderboard',
					href: '/leaderboard'
				},
				{
					label: 'Profile',
					href: `/profile/${user.id}`
				},
				{
					label: 'Sign out',
					href: '/signout'
				}
			];
			super.render({ values: authLinks });
		} else {
			super.render({ values: notAuthLinks });
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
