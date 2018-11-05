import BaseView from "./BaseView.js";
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
const profileTmpl = require('./templates/profile.pug');
const header = require('./templates/header.pug');


export default class ProfileView extends BaseView {
    constructor() {
        console.log('PROFILE CONSTRUCTOR');        
        super();
        Bus.on('done-get-user', this.render.bind(this));
    }

    show() {
        Bus.emit('get-user');
        console.log('PROFILE SHOW');
        super.show();
    } 
     
    render(user) {
        console.log('PROFILE RENDER');
        super.render();

        if (!user.is_authenticated) {
            console.log("You are not logged in!");
            return;
        }

        this.viewDiv.innerHTML += header({title: 'Профиль'});

        this._navigationController = new NavigationController();

        let main = document.createElement('main');
        main.innerHTML += profileTmpl({usr: user});

        this.viewDiv .appendChild(main);

        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);

        Bus.off('done-get-user', this.render.bind(this));
    }

}
