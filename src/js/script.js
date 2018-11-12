import Router from './modules/Router.js';
import Bus from './modules/Bus.js';
import UserModel from './models/UserModel.js';

import MenuView from './views/MenuView.js';
import SignupView from './views/SignupView.js';
import SigninView from './views/SigninView.js';
import 'babel-polyfill';

import ProfileView from './views/ProfileView.js';
import ChangeView from './views/ChangeView.js';
import LeaderboardView from './views/LeaderboardView.js';

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
	['/leaderboard', LeaderboardView]].forEach((route) => {Router.register(route[0],route[1])})

	Router.open(window.location.pathname);
}

main();
