import { fetchModule } from '../../modules/ajax.js';
const profileTmlp = require('./profile.pug');
const notLoginEr = require('./ProfileErrors/NotLoginEr.pug');

const root = document.getElementById('root');

export function createProfile (me) {
	if (me) {
		root.innerHTML = profileTmlp({ title: 'Профиль', user: me });
	} else {
		fetchModule.doGet({ path: '/profiles/current' })
			.then(response => {
				if (response.status >= 400) {
					root.innerHTML = notLoginEr({ title: 'Профиль' });
					return;
				}

				response.json().then((user) => {
					root.innerHTML = '';
					createProfile(user);
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
