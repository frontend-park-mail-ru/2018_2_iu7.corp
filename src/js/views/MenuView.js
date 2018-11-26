import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';

import {openNav} from '../../css/styles/header/header.js';

const menu = require('./templates/menu.pug');

const notAuthLinks = [
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
];

const mainMenu = [
	{
		label: '💣 Мультиплеер',
		href: '/multiplayerMenu'
	},
	{
		label: '💣 Одиночная игра',
		href: '/single'
	},
	// {
	// 	label: '💣 Об игре',
	// 	href: '/about'
	// }
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
			];
			super.render({ mainMenu: mainMenu, headerValues: authLinks, openNav:openNav});
		} else {
			super.render({ mainMenu: mainMenu, headerValues: notAuthLinks, openNav:openNav });
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
