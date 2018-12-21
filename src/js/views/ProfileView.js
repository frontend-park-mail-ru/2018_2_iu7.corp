import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import { authMenuHeader, notAuthMenuHeader } from '../views/dataTemplates/headerMenuData.js';

const preloadTmpl = require('./templates/preload.pug');
const myProfileTmpl = require('./templates/myProfile.pug');
const notMyProfileTmpl = require('./templates/notMyProfile.pug');

export default class ProfileView extends BaseView {
	constructor () {
		super(myProfileTmpl);
		this._navigationController = new NavigationController();
		this._currentUser = null;
		this._chatPerson = null;
		this.preload();

	}

	_setCurrentUser (user) {
		this._currentUser = user;
	}

	show () {
		Bus.on('done-get-user', { callbackName : 'ProfileView._setCurrentUser', callback : this._setCurrentUser.bind(this)});
		Bus.on('profile-render', { callbackName : 'ProfileView.render', callback : this.render.bind(this)});
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
				headerValues: authMenuHeader(renderData.user.id)
			};
			this._template = myProfileTmpl;
			super.render(data);
		} else { // если залогинен и хочет посмотреть не свой профиль или не залогинен вовсе
			if (this._currentUser.is_authenticated) {
				const data = {
					title: 'Profile',
					user: renderData.user,
					headerValues: authMenuHeader(this._currentUser.id)
				};
				this._template = notMyProfileTmpl;
				super.render(data);
			} else {
				const data = {
					title: 'Profile',
					user: renderData.user,
					headerValues: notAuthMenuHeader()
				};
				this._template = notMyProfileTmpl;
				super.render(data);
			}
		}

	}

	preload () {
		const data = {
			title: 'Profile',
			headerValues: notAuthMenuHeader()
		};
		this.viewDiv.innerHTML = '';
		this.viewDiv.innerHTML = preloadTmpl(data);
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'ProfileView._setCurrentUser');
		Bus.off('profile-render', 'ProfileView.render');
	}

	registerActions () {
		this.viewDiv.addEventListener('submit', this.startChat.bind(this));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
