import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';

const about = require('./templates/about.pug');

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

const data = [
	{
		label: '💣БОМБИЧ🔥 - возраждение легендарной NES игры'
	},
	{
		label: 'Цель игры:'
	},
	{
		label: 'Победить всех противников, подорвав их бомбой.'
	},
	{
		label: 'Управление:'
	},
	{
		label: 'w (⬆️) - перейти на клетку вверх'
	},
	{
		label: 's (⬇️) - перейти на клетку вниз'
	},
	{
		label: 'a (⬅️) - перейти на клетку влево'
	},
	{
		label: 'd (➡️) - перейти на клетку вправо'
	},
	{
		label: 'пробел - заложить бомбу'
	}
];

export default class AboutView extends BaseView {
	constructor () {
		super(about);
		this._navigationController = new NavigationController();

		Bus.on('done-get-user', { callbackName : 'AboutView.render', callback : this.render.bind(this)});
	}

	show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	// так же как  в меню
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
			super.render({ aboutMenu: data, headerValues: authLinks });
		} else {
			super.render({ aboutMenu: data, headerValues: notAuthLinks });
		}
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
