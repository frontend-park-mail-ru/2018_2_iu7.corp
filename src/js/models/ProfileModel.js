import Bus from '../modules/Bus.js';
import { fetchModule } from '../modules/ajax.js';
import { getCookie } from '../utils.js';
import Router from '../modules/Router.js';

export default class ProfileModel {
	constructor () {
		Bus.on('profile-fetch', this.loadProfile.bind(this));
		Bus.on('changes-fetch', this.loadProfileChanges.bind(this));
		Bus.on('current-profile-fetch', this.loadCurrentProfile.bind(this));
	}

	loadCurrentProfile() {
		if (ProfileModel._currentProfle) {
			Bus.emit('done-get-user', ProfileModel._currentProfle);
			return;
		}
		const currentUserId = getCookie('id');
		fetchModule.doGet({ path: '/profiles/' + currentUserId })
			.then(  response => {
				if (response.status === 200) {
					return response.json();
				}
				return Promise.reject(new Error('not auth'));
			})
			.then( (data) => {
				ProfileModel._currentProfle = data;
				ProfileModel._currentProfle.is_authenticated = true;
				Bus.emit('done-get-user', ProfileModel._currentProfle);	
			})
			.catch( (err) => {
				console.log(err);
				ProfileModel._currentProfle = { is_authenticated: false };
				Bus.emit('done-get-user', ProfileModel._currentProfle);
			});
	}
	

	loadProfile (id) { // грузим пользователя
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

	// TODO обработка ошибок
	loadProfileChanges (userData) {
		const id = userData.id;
		const data = userData.newData;

		return fetchModule.doPatch({ path: `/profiles/${id}`, body: data })
			.then(response => {
				if (response.status === 200) {
					Router.open(`/profiles/${id}`);
				}
				if (response.status === 401) {
					console.log('change Not auth:', response.status);
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
