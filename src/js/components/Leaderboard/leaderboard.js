'use strict'
import {AjaxModule} from '../../modules/ajax.js';
const leaderboardTmpl = require('./leaderboard.pug');



const root = document.getElementById('root');
const AJAX = new AjaxModule;
export function createLeaderboard (users) {
	if (users) {
		root.innerHTML = leaderboardTmpl({ title: 'Лидер борд', usrs: users.profiles });
	} else {
		const em = document.createElement('em');
		em.textContent = 'Loading';
        root.appendChild(em);
        
		AJAX.doGet({
			callback (xhr) {
				const users = JSON.parse(xhr.responseText);
                root.innerHTML = '';
				createLeaderboard(users);
			},
			path: '/profiles/leaderboard/pages/1',
		});
    }
}