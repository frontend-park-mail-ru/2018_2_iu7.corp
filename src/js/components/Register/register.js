import { errorMessage } from '../Errors/error.js';
import { fetchModule } from '../../modules/ajax.js';
import { createMenu } from '../Menu/menu.js';
const registerForm = require('./register.pug');

const root = document.getElementById('root');

export function createSignUp () {
	const registerDiv = document.createElement('div');
	registerDiv.innerHTML = registerForm({ title: 'Регистрация' });
	root.appendChild(registerDiv);

	const form = document.getElementById('registerForm');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const passwordRepeat = form.elements[ 'password_repeat' ].value;

		if (password !== passwordRepeat) {
			errorMessage('Пароли не совпадают');
			return;
		}

		fetchModule.doPost({
			path: '/auth/register',
			body: {
				username,
				email,
				password
			}
		})
		.then(response => { // TODO посмотреть что будет при сабмите путой формы
			fetchModule.doPost({
				path: '/auth/login',
				body: {
					username,
					password
				}
			})
			.then(response => {
				root.innerHTML = '';
				createMenu();
			})
		})
		.catch((err) => {
			console.log(err);
		});
	});
}
