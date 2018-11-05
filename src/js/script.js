import Router from './modules/Router.js';
import Bus from './modules/Bus.js';
import UserModel from './models/UserModel.js';

import MenuView from './views/MenuView.js'
import SignupView from './views/SignupView.js'
import SigninView from './views/SigninView.js'
import ProfileView from './views/ProfileView.js'
import ChangeView from './views/ChangeView.js'

UserModel._data = null;

Bus.on('error', (error) => {console.log(error);
                                return null;
                            });
Bus.on('get-user', () => {UserModel.Fetch()});
Bus.on('submit-data-signup', (data) => {UserModel.Register(data)});
Bus.on('submit-data-signin', (data) => {UserModel.Signin(data)});
Bus.on('submit-data-change', (data) => {UserModel.Change(data)});
Bus.on('wipe-views', () => {
    Router.open('/');
    Router.rerender();
});


function main() {
    Router
        .register('/', MenuView)
        .register('/signup', SignupView)
        .register('/signin', SigninView)
        .register('/profile', ProfileView)
        .register('/change', ChangeView);
        
    Router.open(window.location.pathname);
}

main();