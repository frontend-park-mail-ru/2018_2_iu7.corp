import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import ProfileController from '../controllers/ProfileController.js';
import ProfileModel from '../models/ProfileModel.js';

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
		label: 'Таблица_лидеров',
		href: '/leaderboard'
	}
];

const mainMenu = [
	{
		label: '💣 Мультиплеер',
		href: '/room'
	},
	{
		label: '💣 Одиночная игра',
		href: '/single'
	},
	{
		label: '💣 Об игре',
		href: '/about'
	}
];

export default class MenuView extends BaseView {
	constructor () {
		super(menu);

		this._navigationController = new NavigationController();

		// При создании этих объектов внутри их классов происходит подписка на события,
		// если их не создать, при вызове события,подписка на которое происходит в классах ProfileController и ProfileModel,
		// его просто не будет в объекте Bus.
		// объекты созданы в классе MenuView так как объект этого класса создается первым
		// при открытии страницы
		this._profileController = new ProfileController();
		this._profileModel = new ProfileModel();

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
			super.render({ mainMenu: mainMenu, headerValues: authLinks});
		} else {
			super.render({ mainMenu: mainMenu, headerValues: notAuthLinks });
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
