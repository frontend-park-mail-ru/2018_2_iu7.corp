import BaseView from "./BaseView.js";
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
const changeForm = require('./templates/changeSettings.pug');
const header = require('./templates/header.pug');


export default class ChangeView extends BaseView {
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
        super.render();

        if (user.is_authenticated) {
            console.log("You are not logged in!");
            return;
        }

        this.viewDiv.innerHTML += header({title: 'Изменение настроек'});

        this._navigationController = new NavigationController();
        this._formController = new FormController('change'); 

        let main = document.createElement('main');
        main.innerHTML += changeForm();

        this.viewDiv .appendChild(main);

        main.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

        Bus.off('done-get-user', this.render.bind(this));
    }
}