import Bus from '../modules/Bus.js';
import { fetchModule } from '../modules/ajax.js';

/**
 * Leaderboard model
 * @class LeaderboardModel
 */
export default class LeaderboardModel {
	/**
     * Creates the model
     */
	constructor () {
		Bus.on('leaderboard-fetch', this.loadUsers.bind(this));
	}

	/**
     * @param {string|number} page Page number
     * @return {Promise} return
     */
	loadUsers (page) {
		return fetchModule.doGet({ path: `/profiles?page_index=${page}` })
			.then((resp) => {
				if (resp.status === 200) {
					return resp.json();
				}
				Bus.emit('error'); // TODO errors
			})
			.then((data) => {
				// console.log(data);
				// console.log('TYPEOF', typeof(data));
				Bus.emit('done-leaderboard-fetch', data);
			});
	}
}
