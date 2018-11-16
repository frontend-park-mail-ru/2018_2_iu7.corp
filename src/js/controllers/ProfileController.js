import Bus from '../modules/Bus.js';
import { getCookie } from '../utils.js';
// import { fetchModule } from '../modules/ajax.js';

export default class ProfileController {
	constructor () {
		this._targetProfileId = null;
		Bus.on('set-target-id', this._setTargetId.bind(this));
		Bus.on('profile-load', this._loadProfile.bind(this));
		Bus.on('done-profile-fetch', this._checkIdMatching.bind(this));
		Bus.on('check-user-permissions', this._checkUserPermission.bind(this));
	}

	_setTargetId (id) { // TODO перейты на ts
		if (id && id > 0) {
			this._targetProfileId = +id;
			console.log('_targetProfileId:', this._targetProfileId);
		}
	}
	
	_loadProfile () { // говорим profileModel загрузить пользователя
		Bus.emit('profile-fetch', this._targetProfileId);
	}
	_checkUserPermission () {
		const currentUserId = parseInt(getCookie('id'));
		if (currentUserId && (currentUserId === this._targetProfileId)) { // если залогинен
			const data = {
				myProfile: true
			}
			Bus.emit('done-check-permissions', data);
		} else { // если незалогинен
			const data = {
				myProfile: false
			}
			Bus.emit('done-check-permissions', data);	
		}
	}

	// проверяем свой ли профиль хочет посмотреть или изменить пользователь
	_checkIdMatching (data) { 
		const currentUserId = parseInt(getCookie('id'));
		// console.log('_checkIdMatching data', data);
		// console.log('currentUserId AND this._targetProfileId', currentUserId, this._targetProfileId);
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

	static _getCurrentUser () {
		Bus.emit('current-profile-fetch');
	}

	// говорим модели сделать запрос на сервер для изменения данных пользователя
	static _makeSettingsChanges (data) {
		Bus.emit('changes-fetch', data);
	}
}
