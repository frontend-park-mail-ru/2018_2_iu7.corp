import 'babel-polyfill';

import Router from './modules/Router.js';
import Bus from './modules/Bus.js';

import AuthModel from './models/AuthModel.js';
import GameModel from './models/GameModel.js';

import MenuView from './views/MenuView.js';
import SignupView from './views/SignupView.js';
import SigninView from './views/SigninView.js';
import SingleGameView from './views/gameViews/singleplayer/SingleGameView.js';

import ProfileView from './views/ProfileView.js';
import ChangeView from './views/ChangeView.js';
import LeaderboardView from './views/LeaderboardView.js';
// import MultiPlayerView from './views/gameViews/multiplayer/MultiPlayerView.js'

import MultiplayerMenuView from './views/gameViews/multiplayer/MultiplayerMenuView.js';
import CreateRoomView from './views/gameViews/multiplayer/CreateRoomView.js';
import RoomView from './views/gameViews/multiplayer/RoomView.js';

import ProfileController from './controllers/ProfileController.js';
import GameController from './controllers/GameController.js';
import ProfileModel from './models/ProfileModel.js';

Bus.on('profile-fetch', { callbackName : 'ProfileModel.loadProfile', callback :(id) => { ProfileModel.loadProfile(id); }});
Bus.on('changes-fetch', { callbackName : 'ProfileModel.loadProfileChanges', callback : (data) => { ProfileModel.loadProfileChanges(data); }});
Bus.on('current-profile-fetch',  { callbackName : 'ProfileModel.loadCurrentProfile', callback : () => { ProfileModel.loadCurrentProfile(); }});

Bus.on('set-target-id', { callbackName : 'ProfileController._setTargetId', callback : (id) => { ProfileController._setTargetId(id); }});
Bus.on('profile-load', { callbackName : 'ProfileController._loadProfile', callback : () => { ProfileController._loadProfile(); }});
Bus.on('done-profile-fetch', { callbackName : 'ProfileController._checkIdMatching', callback : (data) => { ProfileController._checkIdMatching(data); }});
Bus.on('get-user', { callbackName : 'ProfileController._getCurrentUser', callback : () => { ProfileController._getCurrentUser(); }});

Bus.on('set-target-room', { callbackName : 'GameController._setTargetGameId', callback : (id) => { GameController._setTargetGameId(id); }});
Bus.on('get-target-room', { callbackName : 'GameController._getTargetGameId', callback : () => { GameController._getTargetGameId(); }});

Bus.on('unsuccess-signup', { callbackName : 'SignupView.showUnsuccessMessage', callback : () => { SignupView.showUnsuccessMessage(); }});
Bus.on('unsuccess-signin', { callbackName : 'SigninView.showUnsuccessMessage', callback : () => { SigninView.showUnsuccessMessage(); }});
Bus.on('submit-data-signup', { callbackName : 'AuthModel.Register', callback : (data) => { AuthModel.Register(data); }});
Bus.on('submit-data-signin', { callbackName : 'AuthModel.Signin', callback : (data) => { AuthModel.Signin(data); }});
Bus.on('submit-data-change', { callbackName : 'ProfileController._makeSettingsChanges', callback : (data) => { ProfileController._makeSettingsChanges(data); }});
Bus.on('submit-data-createroom', { callbackName : 'GameModel.CreateRoom', callback : (data) => { GameModel.CreateRoom(data); }});
Bus.on('user-signout', { callbackName : 'AuthModel.Signout', callback : () => { AuthModel.Signout(); }});
Bus.on('wipe-views', { callbackName : 'wipe', callback : () => {
	Router.open('/');
}});
Bus.on('error', { callbackName : 'wipe', callback : (error) => {
	console.log(error);
	return null;
}});

function main () {
	[['/', MenuView],
		['/signup', SignupView],
		['/signin', SigninView],
		['/profile', ProfileView],
		['/change', ChangeView],
		['/single', SingleGameView],
		['/multiplayerMenu', MultiplayerMenuView],
		['/createroom', CreateRoomView],
		['/room', RoomView],
		['/leaderboard', LeaderboardView]
		// ['/multiplayer', MultiPlayerView]
	].forEach((route) => { Router.register(route[0], route[1]); });

	Router.open(window.location.pathname);
}

main();
