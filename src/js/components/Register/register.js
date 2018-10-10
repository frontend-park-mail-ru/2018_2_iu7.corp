import {errorMessage} from '../Errors/error.js';
import {AjaxModule} from '../../modules/ajax.js';
const registerForm = require('./register.pug');
const successMessage = require('./RegisterErrors/successRegister.pug');

const root = document.getElementById('root');
const AJAX = new AjaxModule;

export function createSignUp () {

    const registerDiv = document.createElement('div');
    registerDiv.innerHTML = registerForm({title: 'Регистрация'});
    root.appendChild(registerDiv);
    
    const form = document.getElementById('registerForm');

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const password_repeat = form.elements[ 'password_repeat' ].value;

		if (password !== password_repeat) {
			errorMessage('Пароли не совпадают');
			return;
		}
		AJAX.doPost({
			callback (response) {
				root.innerHTML = successMessage({title: 'Вы успешно зарегистрированы'});
				// To do сообщение о успешной регистрации (перевод на страницу пользователя)
			},
			path: '/auth/register',
			body: {
				username,
				email,
				password,
			},
		});
	});
}