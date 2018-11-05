import BaseView from "./BaseView.js";
import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
const signinForm = require('./templates/login.pug');
const header = require('./templates/header.pug');


export default class SigninView extends BaseView {
    constructor() {
        console.log('LOGIN CONSTRUCTOR');        
        super();
        Bus.on('done-get-user', this.render.bind(this));
    }

    show() {
        Bus.emit('get-user');
        console.log('LOGIN SHOW');
        super.show();
    }

    render(user) {
        console.log('LOGIN RENDER');
        console.log('USER: ', user);
        super.render();

        if (user.is_authenticated) {
            console.log("You are already registered and even logged in!");
            return;
        }

        this.viewDiv.innerHTML += header({title: 'Вход'});

        this._navigationController = new NavigationController();
        this._formController = new FormController('signin'); 

        let main = document.createElement('main');
        main.innerHTML += signinForm();

        this.viewDiv .appendChild(main);

        main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

        Bus.off('done-get-user', this.render.bind(this));
    }
}