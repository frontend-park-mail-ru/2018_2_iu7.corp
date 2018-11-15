import Router from './modules/Router.js';
import Bus from './modules/Bus.js';
import AuthModel from './models/AuthModel.js';

import MenuView from './views/MenuView.js';
import SignupView from './views/SignupView.js';
import SigninView from './views/SigninView.js';
import 'babel-polyfill';

import ProfileView from './views/ProfileView.js';
import ChangeView from './views/ChangeView.js';
import LeaderboardView from './views/LeaderboardView.js';
import ProfileController from './controllers/ProfileController.js';


Bus.on('unsuccess-signup', () => { SignupView.showUnsuccessMessage(); });
Bus.on('unsuccess-signin', () => { SigninView.showUnsuccessMessage(); });
Bus.on('get-user', () => { ProfileController._getCurrentUser(); });
Bus.on('submit-data-signup', (data) => { AuthModel.Register(data); });
Bus.on('submit-data-signin', (data) => { AuthModel.Signin(data); });
Bus.on('submit-data-change', (data) => { ProfileController._makeSettingsChanges(data); });
Bus.on('user-signout', () => { AuthModel.Signout(); });
Bus.on('wipe-views', () => {
	Router.open('/');
});
Bus.on('error', (error) => {
	console.log(error);
	return null;
});

function main () {
	[['/', MenuView],
		['/signup', SignupView],
		['/signin', SigninView],
		['/profile', ProfileView],
		['/change', ChangeView],
		['/leaderboard', LeaderboardView]].forEach((route) => { Router.register(route[0], route[1]); });

	console.log(window.location.pathname);
	Router.open(window.location.pathname);
}

main();
