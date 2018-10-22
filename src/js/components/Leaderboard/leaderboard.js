import { fetchModule } from '../../modules/ajax.js';
const leaderboardTmpl = require('./leaderboard.pug');

const root = document.getElementById('root');

export function createLeaderboard (users) {
	if (users) {
		root.innerHTML = leaderboardTmpl({ title: 'Лидер борд', usrs: users.profiles });
	} else {
		const em = document.createElement('em');
		em.textContent = 'Loading';
		root.appendChild(em);

		fetchModule.doGet({ path: '/profiles/leaderboard/pages/1' })
			.then(response => {
				response.json()
					.then((users) => {
						root.innerHTML = '';
						createLeaderboard(users);
					})
					.catch((err) => {
						console.log(err);
					});
			});
	}
}
