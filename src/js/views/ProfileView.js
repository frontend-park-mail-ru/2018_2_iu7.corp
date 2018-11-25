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

		this.preload();
		Bus.on('profile-render', this.render.bind(this));
	}

	show () {
		console.log('PROFILE SHOW');
		console.log(Bus._listeners);
		Bus.emit('profile-load'); // идем в profileController и загружаем пользователя 
		super.show();
		this.registerActions();
	}


	render (renderData) {
		if (renderData.myProfile) { // залогинен и хочет посмотреть свой профиль
			const data = {
				title: 'Profile',
				changeHref: `/change/${renderData.user.id}`,
				user: renderData.user
			};
			this._template = myProfileTmpl;
			super.render(data);
		} else { // если залогинен и хочет посмотреть не свой профиль или не залогинен вовсе
			const data = {
				title: 'Profile',
				user: renderData.user
			};
			this._template = notMyProfileTmpl;
			super.render(data);
		}
		Bus.off('profile-render', this.render.bind(this));
	}

	preload () {
		const data = {
			title: 'Profile'
		};
		this.viewDiv.innerHTML = '';
		this.viewDiv.innerHTML = preloadTmpl(data);
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}