'use strict';
import { createSignIn } from './components/Login/login.js';
import { createSignUp } from './components/Register/register.js';
import { createLeaderboard } from './components/Leaderboard/leaderboard.js';
import { createProfile } from './components/Profile/profile.js';
import { createMenu } from './components/Menu/menu.js';
import { changeSettings } from './components/ChangeSettings/changeSettings.js';
import { fetchModule } from './modules/ajax.js';

const root = document.getElementById('root');


function logOut() {
	fetchModule.doPost({path: '/auth/logout'})
		.then(response => {
			if (response.status === 200) {
				createMenu();
			} else {
				return Promise.reject(new Error(response.status));
			}
		}).
		catch((err) => {
			console.log(err);
			createMenu();
		});
}

const pages = {
	menu: createMenu,
	login: createSignIn,
	register: createSignUp,
	leaders: createLeaderboard,
	profile: createProfile,
	change: changeSettings,
	logout: logOut
};

createMenu();

root.addEventListener('click', function (event) {
	if (!(event.target instanceof HTMLAnchorElement)) {
		return;
	}

	event.preventDefault();
	const link = event.target;

	console.log({
		href: link.href
	});

	root.innerHTML = '';

	pages[ link.getAttribute('href') ]();
});
