import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';

const preloadTmpl = require('./templates/preload.pug');
const myProfileTmpl = require('./templates/myProfile.pug');
const notMyProfileTmpl = require('./templates/notMyProfile.pug');

export default class ProfileView extends BaseView {
	constructor () {
		super(myProfileTmpl);
		this._navigationController = new NavigationController();
		this._currentUser = null;
		this.preload();
		Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('profile-render', this.render.bind(this));
	}


	_setCurrentUser(user) {
		this._currentUser = user;
	}

	show () {
		Bus.emit('get-user');
		Bus.emit('profile-load'); // идем в profileController и загружаем пользователя 
		super.show();
		this.registerActions();
	}


	render (renderData) {
		if (renderData.myProfile) { // залогинен и хочет посмотреть свой профиль
			const data = {
				title: 'Profile',
				changeHref: `/change/${renderData.user.id}`,
				user: renderData.user,
				headerValues: [
					{
						label: 'Профиль',
						href: `/profile/${renderData.user.id}`
					},
					{
						label: 'Таблица лидеров',
						href: '/leaderboard'
					},
					{
						label: 'Выйти',
						href: '/signout'
					}
				]
			};
			this._template = myProfileTmpl;
			super.render(data);
		} else { // если залогинен и хочет посмотреть не свой профиль или не залогинен вовсе

			if (this._currentUser.is_authenticated){
				const data = {
					title: 'Profile',
					user: renderData.user,
					headerValues: [
						{
							label: 'Профиль',
							href: `/profile/${this._currentUser.id}`
						},
						{
							label: 'Таблица лидеров',
							href: '/leaderboard'
						},
						{
							label: 'Выйти',
							href: '/signout'
						}
					]
				};
				this._template = notMyProfileTmpl;
				super.render(data);


			} else {
				const data = {
					title: 'Profile',
					user: renderData.user,
					headerValues: [
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
					]
				};
				this._template = notMyProfileTmpl;
				super.render(data);
			}
		}
		Bus.off('profile-render', this.render.bind(this));
		Bus.off('done-get-user', this._setCurrentUser.bind(this));
	}

	preload () {
		const data = {
			title: 'Profile',
			headerValues: [
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
			]
		};
		this.viewDiv.innerHTML = '';
		this.viewDiv.innerHTML = preloadTmpl(data);
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
