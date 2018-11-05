import BaseView from "./BaseView.js";
import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';
import NavigationController from '../controllers/NavigationController.js'
import FormController from '../controllers/FormController.js'
const signupForm = require('./templates/register.pug');
const header = require('./templates/header.pug');


export default class SignupView extends BaseView {
    constructor() {
        console.log('REGISTER CONSTRUCTOR');
        super();
        Bus.on('done-get-user', this.render.bind(this));
    }

    show() {
        console.log('REGISTER SHOW');
        Bus.emit('get-user');
        super.show();
    }

    render(user) {
        console.log('REGISTER RENDER');
        super.render();

        if (user.is_authenticated) {
            console.log("You are already registered and even logged in!");
            return;
        }

        this.viewDiv.innerHTML += header({title: 'Регистрация'});

        this._navigationController = new NavigationController();
        this._formController = new FormController("signup"); 

        let main = document.createElement('main');
        main.innerHTML += signupForm();

        this.viewDiv .appendChild(main);

        main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

        Bus.off('done-get-user', this.render.bind(this));
    }
}