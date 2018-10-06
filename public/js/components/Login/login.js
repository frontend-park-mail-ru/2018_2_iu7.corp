'use strict'

const CORS_URL = "https://strategio-api.now.sh";
const AJAX = window.AjaxModule;

const loginForm = require('./login.pug');
const root = document.getElementById('root');

export function createSignIn () {
    const loginDiv = document.createElement('div');
    loginDiv.innerHTML = loginForm();
    root.appendChild(loginDiv);
    const form = document.getElementById('loginForm');
	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const password = form.elements[ 'password' ].value;

		AJAX.doPost({
			callback (xhr) {
				root.innerHTML = '';
				createProfile();
			},
			path: CORS_URL+'/auth/login',
			body: {
				username,
				password,
			},
		});
	});
}