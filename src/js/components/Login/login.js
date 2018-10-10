import {AjaxModule} from '../../modules/ajax.js';
const loginForm = require('./login.pug');
const successMessage = require('./LoginErrors/successLogin.pug');
const unsuccessMessage = require('./LoginErrors/unsuccessLogin.pug');


const root = document.getElementById('root');
const AJAX = new AjaxModule;

export function createSignIn () {
    const loginDiv = document.createElement('div');
    loginDiv.innerHTML = loginForm({ title: 'Вход' });
    root.appendChild(loginDiv);
	const form = document.getElementById('loginForm');
	
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const password = form.elements[ 'password' ].value;

		AJAX.doPost({
			callback (response) {
				if (response.status >= 400) {
					root.innerHTML = unsuccessMessage({title: 'Вход'});
					return;
				}
				root.innerHTML = successMessage({title: 'Вход'});
			},
			path: '/auth/login',
			body: {
				username,
				password,
			},
		});
	});
}