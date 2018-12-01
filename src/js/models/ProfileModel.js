import Bus from '../modules/Bus.js';
import { fetchModule } from '../modules/ajax.js';
import { setCookie, getCookie, deleteCookie } from '../utils.js';
import Router from '../modules/Router.js';

export default class ProfileModel {
	// используется для проверки на сервере залогинен ли пользователь
	static loadCurrentProfile () {
		const currentUserId = getCookie('id');
		fetchModule.doGet({ path: '/profiles/' + currentUserId })
			.then(response => {
				// console.log(response);
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(new Error('not auth'));
			})
			.then((data) => {
				ProfileModel._currentProfle = data;
				ProfileModel._currentProfle.is_authenticated = true;
				Bus.emit('done-get-user', ProfileModel._currentProfle);
			})
			.catch((err) => {
				console.log(err);
				ProfileModel._currentProfle = { is_authenticated: false };
				Bus.emit('done-get-user', ProfileModel._currentProfle);
			});
	}

	// используется для получаения данных профиля любого пользователя
	static loadProfile (id) {
		return fetchModule.doGet({ path: `/profiles/${id}` })
			.then(response => {
				if (response.status === 200) {
					return response.json();
				}
				Bus.emit('error'); // TODO errors
			})
			.then((data) => {
				Bus.emit('done-profile-fetch', data); // говорим profileController что загрузили пользователя
			});
	}

	// используется для передачи измененных данных пользователя на сервер
	static loadProfileChanges (data) {
		const id = getCookie('id');
		let authToken = getCookie('auth_token');
		let changeHeaders = {
			'Authorization': 'Bearer ' + authToken
		};

		return fetchModule.doPatch({ path: `/profiles/${id}`, body: data, headers: changeHeaders })
			.then(response => {
				if (response.status === 200) {
					Router.open(`/profile/${id}`);
				}
				if (response.status === 401) {
					console.log('not auth')
					// const token = getCookie('refresh_token');
					// if (token) {
					// 	fetchModule.doPatch({ path : '/auth/session', body: {token} })
					// 		.then( response => {
					// 			if (response.status === 200) {
					// 				return response.json();
					// 			} else {
					// 				return Promise.reject(new Error('uncorrect refresh token'));
					// 			}
					// 		})
					// 		.then( (user) => {
					// 			deleteCookie('auth_token');
					// 			setCookie('auth_token', user.auth_token);
					// 			authToken = getCookie('auth_token');
					// 			changeHeaders = {
					// 				'Authorization': 'Bearer ' + authToken
					// 			};
					// 			fetchModule.doPatch({ path: `/profiles/${id}`, body: data, headers: changeHeaders })
					// 				.then( response => {
					// 					if (response.status === 200) {
					// 						Router.open(`/profile/${id}`);
					// 					}
					// 				})
					// 		})
					// 		.catch( (err) => {
					// 			console.log(err);
					// 		})

					// } else {
					// 	return Promise.reject(new Error('not auth'));
					// }
				}
				if (response.status === 403) {
					console.log('change Forbidden:', response.status);
				}
				if (response.status === 404) {
					console.log('change Not found:', response.status);
				}
				if (response.status === 422) {
					console.log('change Incorrect data:', response.status);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
