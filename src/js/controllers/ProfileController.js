import Bus from '../modules/Bus.js';
import { getCookie } from '../utils.js';

export default class ProfileController {
	constructor () {
		this._targetProfileId = null;
		Bus.on('set-target-id', this._setTargetId.bind(this));
		Bus.on('profile-load', this._loadProfile.bind(this));
		Bus.on('done-profile-fetch', this._checkIdMatching.bind(this));
	}

	_setTargetId (id) { // TODO перейты на ts
		if (id && id > 0) {
			this._targetProfileId = +id;
		}
	}
	
	_loadProfile () { // говорим profileModel загрузить пользователя
		Bus.emit('profile-fetch', this._targetProfileId);
	}

	// проверяем свой ли профиль хочет посмотреть пользователь
	_checkIdMatching (data) { 
		const currentUserId = parseInt(getCookie('id'));
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
