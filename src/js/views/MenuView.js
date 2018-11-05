import BaseView from "./BaseView.js";
import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';
import NavigationController from '../controllers/NavigationController.js'

const menu = require('./templates/menu.pug');

const notAuthLinks = [
    {
        label: 'Вход',
        href: '/login'        
    },
    {
        label: 'Регистрация',
        href: '/signup'        
    },
    {
        label: 'Лидеры',
        href: '/leaders'        
    }
]


const authLinks = [
    {
        label: 'Лидеры',
        href: '/leaders'        
    },
    {
        label: 'Мой профиль',
        href: '/profile'        
    },
    {
        label: 'Выйти',
        href: '/logout'        
    }
]



export default class MenuView extends BaseView {
    constructor() {
        console.log('MENU CONSTRUCTOR');
        super()
        Bus.on('done-get-user', this.render.bind(this));
    }

    show() {
        console.log('MENU SHOW');
        Bus.emit('get-user');
        super.show();
    }

    render(user) {
        console.log('MENU RENDER');
        super.render();
        this._navigationController = new NavigationController();

        if (user.is_authenticated) {
            this.viewDiv.innerHTML += menu({values: authLinks})
        } else {
            this.viewDiv.innerHTML += menu({values: notAuthLinks})
        }

        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
        Bus.off('done-get-user', this.render.bind(this));
    }
}
