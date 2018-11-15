import Bus from '../modules/Bus.js';
import { getCookie } from '../utils.js';
// import { fetchModule } from '../modules/ajax.js';

export default class ProfileController {
	constructor () {
		this._targetProfileId = null;
		// ProfileController._currentUser = {is_authenticated: false};
		Bus.on('set-target-id', this._setTargetId.bind(this));
		// Bus.on('set-current-user', this._setCurrentUser.bind(this));
		Bus.on('profile-load', this._loadProfile.bind(this));
		Bus.on('done-profile-fetch', this._checkIdMatching.bind(this));
		Bus.on('check-user-permissions', this._checkIdMatching.bind(this));
	}

	// _setCurrentUser(user) {
	// 	ProfileController._currentUser = user;
	// 	ProfileController._currentUser.is_authenticated = true;
	// 	console.log('_currentUser:', ProfileController._currentUser);
	// }

	_setTargetId (id) { // TODO перейты на ts
		if (id && id > 0) {
			this._targetProfileId = +id;
			console.log('_targetProfileId:', this._targetProfileId);
		}
	}

	_loadProfile () { // говорим profileModel загрузить пользователя
		Bus.emit('profile-fetch', this._targetProfileId);
	}

	// проверяем свой ли профиль хочет посмотреть или изменить пользователь
	_checkIdMatching (data) { 
		const currentUserId = parseInt(getCookie('id'));
		console.log('_checkIdMatching data', data);
		console.log('currentUserId AND this._targetProfileId', currentUserId, this._targetProfileId);
		if (currentUserId) { // если залогинен
			if (currentUserId === this._targetProfileId) { // если хочет что-то сделать со своим профилем
				const renderData = {
					user: data,
					myProfile: true
				}
				Bus.emit('profile-render', renderData);
			} else { // если хочет что-то сделать не со своим профилем
				const renderData = {
					user: data,
					myProfile: false
				}
				Bus.emit('profile-render', renderData);
			}
		} else { // если незалогинен
			const renderData = {
				user: data,
				myProfile: false
			}
			Bus.emit('profile-render', renderData);	
		}
	}

	// // получаем данные текущего пользователя
	// static _getCurrentUser () {
	// 	console.log('ProfileController._currentUser _getCurrentUser', ProfileController._currentUser);
	// 	Bus.emit('done-get-user', ProfileController._currentUser);
	// }

	static _getCurrentUser () {
		Bus.emit('current-profile-fetch');
	}

	// говорим модели сделать запрос на сервер для изменения данных пользователя
	static _makeSettingsChanges (data) {
		const userData = {
			id: this._targetProfileId,
			newData: data
		};
		Bus.emit('changes-fetch', userData);
	}
}
