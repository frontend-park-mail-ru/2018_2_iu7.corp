import BaseView from '../BaseView.js';
import Bus from '../../modules/Bus.js';
import NavigationController from '../../controllers/NavigationController.js';
import {authMenuHeader, notAuthMenuHeader} from '../dataTemplates/headerMenuData.js'
const createRoomTmpl = require('../templates/gameTemplates/createRoom.pug');

const data = {
    players: []
}

export default class CreateRoomView extends BaseView {
    constructor() {
        super(createRoomTmpl);
        this._navigationController = new NavigationController();
        Bus.on('done-get-user', this.render.bind(this));
    }


    show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
    }

    render(user) {
        if (!user.is_authenticated) {
            data.headerValues = notAuthMenuHeader();
			super.render(data);
        } else {    
            data.headerValues = authMenuHeader();
            super.render(data);
        }
    }
    
    registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}