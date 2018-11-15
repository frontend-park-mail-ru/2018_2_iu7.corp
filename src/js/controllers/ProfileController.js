import Bus from '../modules/Bus.js';
import Router from "../modules/Router.js";


export default class ProfileController {
    constructor () {
        this._targetProfileId = null;
        Bus.on("profile-set-id", this._setId.bind(this));
        Bus.on("profile-load", this._loadProfile.bind(this));
    }

    _setId(id) { //TODO перейты на ts
        if (id && id > 0) {
            this._targetProfileId = +id;
        }
    }

    _loadProfile() {
        Bus.emit('profile-fetch', this._targetProfileId);
    }

    // проверка если пользователь будучи залогининым пытается изменить профиль под другим id
    // если незалогининный пользователь пытается изменить данные то usr = {is_authenticated: false}
    // то есть usr.profiles_id - undefined и проверка завершится на первом if 
    _checkUserBeforeChange(usr) {
        if (usr.profiles_id === this._targetProfileId) { 
            const userData = {
                user: usr,
                idMatching: true
            };
            Bus.emit('verified-user-change', userData);
        } else { // пользователь пытался изменить не свои данные
            const userData = {
                user: usr,
                idMatching: false
            };
            Bus.emit('verified-user-change', userData);
        }
    }
    // говорим модели сделать запрос на сервер для изменения данных пользователя
    _makeSettingsChanges(data) {
        const userData = {
            profiles_id: this._targetProfileId,
            newData: data
        };
        Bus.emit('changes-fetch', userData);
    }
}