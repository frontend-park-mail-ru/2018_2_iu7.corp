import Bus from '../modules/Bus.js';
import { fetchModule } from '../modules/ajax.js';

export default class ProfileModel {
    constructor () {
        Bus.on('profile-fetch', this.loadProfile.bind(this));
        Bus.on('changes-fetch', this.loadProfileChanges.bind(this));
    }

    loadProfile (id) {
        return fetchModule.doGet({path: `/profiles/${id}`})
            .then( response => {
                if (response.status === 200) {
                    return response.json();
                }
                Bus.emit('error'); // TODO errors
            })
            .then( (data) => {
                Bus.emit('done-profile-fetch', data);
            });
    }

    // TODO обработка ошибок
    loadProfileChanges (userData) {
        const id = userData.profiles_id;
        const data = userData.newData;

        return fetchModule.doPatch({path: `/profiles/${id}`, body: data})
            .then( response => {
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
            .catch( (err) => {
                console.log(err)
            })
    }
}