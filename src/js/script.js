import 'babel-polyfill';

import Router from './modules/Router.js';
import Bus from './modules/Bus.js';
import UserModel from './models/UserModel.js';

import MenuView from './views/MenuView.js';
import SignupView from './views/SignupView.js';
import SigninView from './views/SigninView.js';


import ProfileView from './views/ProfileView.js';
import ChangeView from './views/ChangeView.js';
import LeaderboardView from './views/LeaderboardView.js';


if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js', { scope: '/' })
		.then(function(registration) {
			console.log('SW registration OK:', registration);
		})
		.catch(function(err) {
			console.log('SW registration FAIL:', err);
		});
}


UserModel._data = null;

Bus.on('unsuccess-signup', () => { SignupView.showUnsuccessMessage(); });
Bus.on('unsuccess-signin', () => { SigninView.showUnsuccessMessage(); });
Bus.on('get-user', () => { UserModel.Fetch(); });
Bus.on('submit-data-signup', (data) => { UserModel.Register(data); });
Bus.on('submit-data-signin', (data) => { UserModel.Signin(data); });
Bus.on('submit-data-change', (data) => { UserModel.Change(data); });
Bus.on('user-signout', () => { UserModel.Signout(); });
Bus.on('wipe-views', () => {
	Router.open('/');
	Router.rerender();
});
Bus.on('error', (error) => {
	console.log(error);
	return null;
});

function main () {
	Router
		.register('/', MenuView)
		.register('/signup', SignupView)
		.register('/signin', SigninView)
		.register('/profile', ProfileView)
        .register('/change', ChangeView)
        .register('/leaderboard', LeaderboardView);

	Router.open(window.location.pathname);
}

main();
