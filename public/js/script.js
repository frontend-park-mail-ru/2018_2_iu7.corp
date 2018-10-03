'use strict';

import {
	BoardComponent,
	RENDER_TYPES,
} from './components/Board/Board.mjs';

const CORS_URL = "https://strategio-api.now.sh";

const root = document.getElementById('root');
const AJAX = window.AjaxModule;

function createMenuLink () {
	const menuLink = document.createElement('a');
	menuLink.href = menuLink.dataset.href = 'menu';

	menuLink.textContent = 'Back to main menu';

	return menuLink;
}

function createMenu () {
	const menuSection = document.createElement('section');
	menuSection.dataset.sectionName = 'menu';

	const logo = document.createElement('div');
	logo.id = 'logo';
	const logoHeader = document.createElement('h1');
	logoHeader.textContent = 'Our game';

	logo.appendChild(logoHeader);


	const main = document.createElement('div');
	main.id = 'main';
	const mainInner = document.createElement('div');

	main.appendChild(mainInner);

	const titles = {
		login: 'Sign in',
		register: 'Sign up',
		leaders: 'Leaders',
		profile: 'Profile'
	};


	Object.entries(titles).forEach(function (entry) {
		const href = entry[ 0 ];
		const title = entry[ 1 ];

		const a = document.createElement('a');
		a.href = href;
		a.dataset.href = href;
		a.textContent = title;
		a.classList.add('menu-button');

		mainInner.appendChild(a);
	});


	menuSection.appendChild(logo);
	menuSection.appendChild(main);

	root.appendChild(menuSection);
}

function createSignIn () {
	const signInSection = document.createElement('section');
	signInSection.dataset.sectionName = 'login';

	const header = document.createElement('h1');
	header.textContent = 'Sign In';


	const form = document.createElement('form');

	const inputs = [
		{
			name: 'username',
			type: 'text',
			placeholder: 'username'
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Password'
		},
		{
			name: 'submit',
			type: 'submit'
		}
	];

	inputs.forEach(function (item) {
		const input = document.createElement('input');

		input.name = item.name;
		input.type = item.type;

		input.placeholder = item.placeholder;

		form.appendChild(input);
		form.appendChild(document.createElement('br'));
	});

	signInSection.appendChild(header);
	signInSection.appendChild(form);
	signInSection.appendChild(createMenuLink());

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const password = form.elements[ 'password' ].value;

		AJAX.doPost({
			callback (xhr) {
				root.innerHTML = '';
				createProfile();
			},
			path: CORS_URL+'/auth/login',
			body: {
				username,
				password,
			},
		});
	});

	root.appendChild(signInSection);
}

function createSignUp () {
	const signUpSection = document.createElement('section');
	signUpSection.dataset.sectionName = 'register';

	const header = document.createElement('h1');
	header.textContent = 'register';


	const form = document.createElement('form');

	const inputs = [
		{
			name: 'username',
			type: 'text',
			placeholder: 'Username'
		},
		{
			name: 'email',
			type: 'email',
			placeholder: 'Email'
		},
		{
			name: 'password',
			type: 'password',
			placeholder: 'Password'
		},
		{
			name: 'password_repeat',
			type: 'password',
			placeholder: 'Repeat Password'
		},
		{
			name: 'submit',
			type: 'submit'
		}
	];

	inputs.forEach(function (item) {
		const input = document.createElement('input');

		input.name = item.name;
		input.type = item.type;

		input.placeholder = item.placeholder;

		form.appendChild(input);
		form.appendChild(document.createElement('br'));
	});

	signUpSection.appendChild(header);
	signUpSection.appendChild(form);
	signUpSection.appendChild(createMenuLink());

	form.addEventListener('submit', function (event) {
		event.preventDefault();

		const username = form.elements[ 'username' ].value;
		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const password_repeat = form.elements[ 'password_repeat' ].value;

		if (password !== password_repeat) {
			alert('Passwords is not equals');

			return;
		}

		AJAX.doPost({
			callback (xhr) {
				root.innerHTML = '';
				createProfile();
			},
			path: CORS_URL+'/auth/register',
			body: {
				username,
				email,
				password,
			},
		});
	});

	root.appendChild(signUpSection);
}

function createLeaderboard (users) {
	const leaderboardSection = document.createElement('section');
	leaderboardSection.dataset.sectionName = 'leaderboard';

	const header = document.createElement('h1');
	header.textContent = 'Leaders';

	leaderboardSection.appendChild(header);
	leaderboardSection.appendChild(createMenuLink());
	leaderboardSection.appendChild(document.createElement('br'));
	const tableWrapper = document.createElement('div');
	leaderboardSection.appendChild(tableWrapper);

	if (users) {
		const board = new BoardComponent({el: tableWrapper, type: RENDER_TYPES.STRING});
		board.data = users;
		board.render();
	} else {
		const em = document.createElement('em');
		em.textContent = 'Loading';
		leaderboardSection.appendChild(em);

		AJAX.doGet({
			callback (xhr) {
				console.log(xhr.responseText);
				const users = JSON.parse(xhr.responseText);
				root.innerHTML = '';
				createLeaderboard(users);
			},
			path: CORS_URL+'/profiles/leaderboard/pages/1',
		});
	}

	root.appendChild(leaderboardSection);
}

function createProfile (me) {
	const profileSection = document.createElement('section');
	profileSection.dataset.sectionName = 'profile';

	const header = document.createElement('h1');
	header.textContent = 'Profile';

	profileSection.appendChild(header);
	profileSection.appendChild(createMenuLink());

	if (me) {
		const p = document.createElement('p');

		const div1 = document.createElement('div');
		div1.textContent = `Email ${me.username}`;
		const div2 = document.createElement('div');
		div2.textContent = `Age ${me.email}`;
		const div3 = document.createElement('div');
		div3.textContent = `Score ${me.score}`;

		p.appendChild(div1);
		p.appendChild(div3);
		p.appendChild(div3);

		profileSection.appendChild(p);
	} else {
		AJAX.doGet({
			callback (xhr) {
				if (!xhr.responseText) {
					alert('Unauthorized');
					root.innerHTML = '';
					createMenu();
					return;
				}

				const user = JSON.parse(xhr.responseText);
				root.innerHTML = '';
				createProfile(user);
			},
			path: CORS_URL+'/profiles/current',
		});
	}

	root.appendChild(profileSection);
}

const pages = {
	menu: createMenu,
	login: createSignIn,
	register: createSignUp,
	leaders: createLeaderboard,
	profile: createProfile
};

createMenu();

root.addEventListener('click', function (event) {
	if (!(event.target instanceof HTMLAnchorElement)) {
		return;
	}

	event.preventDefault();
	const link = event.target;

	console.log({
		href: link.href,
		dataHref: link.dataset.href
	});

	root.innerHTML = '';

	pages[ link.dataset.href ]();
});
