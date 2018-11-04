import { fetchModule } from '../../modules/ajax.js';
import { createMenu } from '../Menu/menu';
const loginForm = require('./login.pug');
const unsuccessMessage = require('./LoginErrors/unsuccessLogin.pug');

const root = document.getElementById('root');

export function createSignIn () {
	const loginDiv = document.createElement('div');
	loginDiv.innerHTML = loginForm({ title: 'Вход' });
	root.appendChild(loginDiv);
	const form = document.getElementById('loginForm');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const password = form.elements[ 'password' ].value;

		fetchModule.doPost({
			path: '/auth/login',
			body: {
				username,
				password
			}
		})
		.then(response => {
			if (response.status !== 200) {
				return Promise.reject(new Error('unsuccess auth'));
			}
			root.innerHTML = '';
			createMenu()
		})
		.catch((err) => {
			console.log(err);
			root.innerHTML = unsuccessMessage({ title: 'Вход' });
		});
	});
}
