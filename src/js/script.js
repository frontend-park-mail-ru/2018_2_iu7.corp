'use strict';
import {createSignIn} from './components/Login/login.js';
import {createSignUp} from './components/Register/register.js';
import {createLeaderboard} from './components/Leaderboard/leaderboard.js';
import {createProfile} from './components/Profile/profile.js';
import {createMenu} from './components/Menu/menu.js';
import {changeSettings} from './components/ChangeSettings/changeSettings.js';

const root = document.getElementById('root');

const pages = {
	menu: createMenu,
	login: createSignIn,
	register: createSignUp,
	leaders: createLeaderboard,
	profile: createProfile,
	change: changeSettings
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
