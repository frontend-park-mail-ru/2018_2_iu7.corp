import { fetchModule } from '../modules/ajax.js';
import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';

export default class UserModel {
	static Fetch () {

		if (UserModel._data === null) {
			UserModel._data = { is_authenticated: false };
			Bus.emit('done-get-user', UserModel._data);
		}
		else {
			Bus.emit('done-get-user', UserModel._data);
		}
		// if (UserModel._data !== null) { // если пользователь уже был получен
		// 	Bus.emit('done-get-user', UserModel._data);
		// 	return;
		// }

		// console.log('server fetchiung user', UserModel._data);

		// fetchModule.doGet({ path: '/profiles/current' })
		// 	.then(response => {
		// 		if (response.status === 200) {
		// 			return response.json();
		// 		}
		// 		return Promise.reject(new Error('not auth'));
		// 	})
		// 	.then((user) => {
		// 		UserModel._data = user;
		// 		UserModel._data.is_authenticated = true;
		// 		Bus.emit('done-get-user', UserModel._data);
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 		UserModel._data = { is_authenticated: false };
		// 		Bus.emit('done-get-user', UserModel._data);
		// 	});
	}

	static Register (data) {
		return fetchModule.doPost({ path: '/profiles', body: data })
			.then( response => {
				console.log('Registration response: ', response);
				if (response.status === 200) {
					const username = data.username;
					const password = data.password;
					Bus.emit('submit-data-signin', { username, password });
				}
				if (response.status === 409) {
					Bus.emit('unsuccess-signup');
				}
				if (response.status === 422) { // валидация на стороне сервера TODO сообщение о неправильно вводе данных
					console.log('registration server validation: ', response.status);
					return Promise.reject(response.status);
				}
			})
			.catch( (err) => {
				console.log('Register err: ', err);
			}) 


		// return fetchModule.doPost({ path: '/profiles', body: data })
		// 	.then(response => {
		// 		if (response.status === 422) {
		// 			console.log('Register status: ', response.status);
		// 			return Promise.reject(response.status);
		// 		}
		// 		if (response.status === 200) {
		// 			UserModel._data = null;
		// 			const username = data.username;
		// 			const password = data.password;
		// 			Bus.emit('submit-data-signin', { username, password });
		// 		}
		// 		if (response.status === 409) {
		// 			UserModel._data = null;
		// 			Bus.emit('unsuccess-signup');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.log('Register err: ', err);
		// 	});
	}

	static Signin (data) {
		return fetchModule({ path: '/auth/session', body: data })
			.then( response => {
				console.log('SignIN response: ', response);
				if (response.status === 200) {
					return response.json();
				}
				if (response.status === 401) {
					Bus.emit('unsuccess-signin');
				}
				if (response.status === 422) {
					return Promise.reject(response.status);
				}
			})
			.then( (user) => {
				console.log('SignIN user:', user);
				UserModel._data = user;
				UserModel._data.is_authenticated = true;
				Bus.emit('wipe-views');
			})
			.catch( (err) => {
				console.log('SignIN err: ', err);
			});
		// return fetchModule.doPost({ path: '/auth/login', body: data })
		// 	.then(response => {
		// 		if (response.status === 200) {
		// 			UserModel._data = null;
		// 			Bus.emit('wipe-views');
		// 		}
		// 		if (response.status === 404 || response.status === 400) {
		// 			UserModel._data = null;
		// 			Bus.emit('unsuccess-signin');
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	}

	static Profile (profile_id) {
		return fetchModule.doGet()
	}

	// TODO больше проверок
	static Change (data) {
		fetchModule.doPut({ path: '/profiles/current', body: data })
			.then(response => {
				if (response.status === 400) {
					console.log(response.status);
				}

				if (response.status === 200) {
					UserModel._data = null;
					Router.open('/profile');
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}

	static Signout () {
		if (UserModel._data !== null) {
			fetchModule.doPost({ path: '/auth/logout' })
				.then(response => {
					if (response.status === 200) {
						UserModel._data = null;
						Bus.emit('wipe-views');
					} else {
						return Promise.reject(new Error(response.status));
					}
				})
				.catch((err) => {
					Bus.emit('wipe-views', err);
				});
		}
	}
}
