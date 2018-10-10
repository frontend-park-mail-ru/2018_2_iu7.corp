import {AjaxModule} from '../../modules/ajax.js';
const profileTmlp = require('./profile.pug');
const notLoginEr = require('./ProfileErrors/NotLoginEr.pug');

const root = document.getElementById('root');
const AJAX = new AjaxModule;


export function createProfile (me) {

    if (me) {
        root.innerHTML = profileTmlp({title: 'Профиль', user: me});

	} else {
		AJAX.doGet({
			callback (response) {
				if (response.status >= 400) {
					root.innerHTML = notLoginEr({title: 'Профиль'});
					return;
				}

				response.json().then( (user) => {
					root.innerHTML = '';
					createProfile(user);
				});
			},
			path: '/profiles/current',
		});
	}
}
