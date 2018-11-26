import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';

const preloadTmpl = require('./templates/preload.pug');
const myProfileTmpl = require('./templates/myProfile.pug');
const notMyProfileTmpl = require('./templates/notMyProfile.pug');

export default class ProfileView extends BaseView {
	constructor () {
		super(myProfileTmpl);
		this._socket = new WebSocket('wss://80.252.155.65:5000');
		this._socket.onopen = function () {
			console.log('connection started');
		};
		this._navigationController = new NavigationController();
		this._currentUser = null;
		this._chatPerson = null;
		this.preload();
		Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('profile-render', this.render.bind(this));
	}

	_setCurrentUser (user) {
		this._currentUser = user;
	}

	show () {
		Bus.emit('get-user');
		Bus.emit('profile-load'); // идем в profileController и загружаем пользователя
		super.show();
		this.registerActions();
	}

	render (renderData) {
		this._chatPerson = renderData.user;
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
			if (this._currentUser.is_authenticated) {
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

	startChat (event) {
		// event.preventDefault();
		// const inf = {
		// 	type: 'make_private_chat',
		// 	data: [this._currentUser.id, this._chatPerson.id]
		// }
		// this._socket.send(JSON.stringify(inf));

		const frame = document.createElement('iframe');
		frame.wigth = 900;
		frame.height = 500;
		// frame.frameborder='0'

		const framediv = document.getElementById('for-frame');
		framediv.innerHTML = '';
		framediv.appendChild(frame);
	}

	// make_private_chat(input){
	// 	type = 'make_private_chat';
	// 	data = [input.idfrom, input.idto];
	// 	return JSON.stringify({type: type, data: data});
	// };

	registerActions () {
		this.viewDiv.addEventListener('submit', this.startChat.bind(this));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
		// const startChat = document.getElementById('popupbtn');
		// this.viewDiv.addEventListener('click', this.startChat().bind(this));
	}
}
