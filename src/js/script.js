import Router from './modules/Router.js';
import Bus from './modules/Bus.js';
import UserModel from './models/UserModel.js';

import MenuView from './views/MenuView.js'

UserModel._data = null;

Bus.on('get-user', () => {UserModel.Fetch()});


function main() {
    Router
        .register('/', MenuView);

    Router.open(window.location.pathname);
}

main();