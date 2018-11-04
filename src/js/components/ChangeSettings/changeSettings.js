import { errorMessage } from '../Errors/error.js';
import { fetchModule } from '../../modules/ajax.js';
import { createProfile } from '../Profile/profile.js';
const changeSettingsForm = require('./changeSettings.pug');

const root = document.getElementById('root');
// const AJAX = new AjaxModule;

export function changeSettings () {
	const changeSettingsDiv = document.createElement('div');
	changeSettingsDiv.innerHTML = changeSettingsForm({ title: 'Изменение данных' });
	root.appendChild(changeSettingsDiv);

	const form = document.getElementById('changeSettingsForm');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const password = form.elements[ 'password' ].value;
		const passwordRepeat = form.elements[ 'password_repeat' ].value;

		if (password !== passwordRepeat) {
			errorMessage('Пароли не совпадают');
			return;
		}

		const newData = Array.from(form.elements)
			.reduce((acc, val) => {
				if (val.value !== '' && val.name !== 'password_repeat') {
					acc[val.name] = val.value;
				}
				return acc;
			}, {});

		fetchModule.doPut({
			path: '/profiles/current',
			body: newData
		})
		.then(response => {
			root.innerHTML = '';
			createProfile();
		})
		.catch((err) => {
			console.log(err);
		});
	});
}
