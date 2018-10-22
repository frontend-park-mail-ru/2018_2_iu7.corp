'use strict';

import { errorMessage } from '../Errors/error.js';
import { fetchModule } from '../../modules/ajax.js';
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
		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const passwordRepeat = form.elements[ 'password_repeat' ].value;

		if (password !== passwordRepeat) {
			errorMessage('Пароли не совпадают');
			return;
		}
		fetchModule.doPost({
			path: '/change',
			body: {
				email,
				password
			}
		})
			.then(response => {
				root.innerHTML = 'hello!';
			})
			.catch((err) => {
				console.log(err);
			});
	});
}
