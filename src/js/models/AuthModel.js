import { fetchModule } from '../modules/ajax.js';
import { setCookie, getCookie, deleteCookie } from '../utils.js';
import Bus from '../modules/Bus.js';

export default class AuthModel {
	static Register (data) {
		console.log('NEW MAAAAAN')
		return fetchModule.doPost({ path: '/profiles', body: data })
			.then(response => {
				// console.log(response);
				// console.log('Registration response: ', response);
				if (response.status === 200) {
					const username = data.username;
					const password = data.password;
					Bus.emit('submit-data-signin', { username, password });
				}
				if (response.status === 409) {
					Bus.emit('unsuccess-signup');
				}
				if (response.status === 422) { // валидация на стороне сервера TODO сообщение о неправильно вводе данных
					// console.log('registration server validation: ', response.status);
					return Promise.reject(response.status);
				}
			})
			.catch((err) => {
				console.log(err)
				Bus.emit('unsuccess-signup');
			});
	}

	static Signin (data) {
		return fetchModule.doPost({ path: '/auth/session', body: data })
			.then((response) => {
				console.log('SignIN response: ', response);
				if (response.status === 200) {
					return response.json();
				}
				if (response.status === 401) {
					Bus.emit('unsuccess-signin');
				}
				if (response.status === 422) {
					Bus.emit('unsuccess-signin');
				}
			})
			.then((user) => {
				setCookie('id', user.profile_id.toString());
				setCookie('auth_token', user.auth_token);
				// setCookie('refresh_token', user.refresh_token);
				Bus.emit('wipe-views');
			})
			.catch((err) => {
				console.log(err);
			});
	}

	static Signout () {
		const authToken = getCookie('auth_token');
		const signOutHeaders = {
			'Authorization': 'Bearer ' + authToken
		};
		fetchModule.doDelete({ path: '/auth/session', headers: signOutHeaders })
			.then(response => {
				if (response.status === 200) {
					deleteCookie('id');
					deleteCookie('auth_token');
					// deleteCookie('refresh_token');
					Bus.emit('wipe-views');
				}
				if (response.status === 401) {
					Bus.emit('wipe-views');
				}
			})
			.catch((err) => {
				console.log('SIGNOUT ERR', err);
			});
	}
}
