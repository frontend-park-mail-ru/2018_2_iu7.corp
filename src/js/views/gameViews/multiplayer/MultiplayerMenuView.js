import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';
const multiplayerMenuTmpl = require('../../templates/gameTemplates/multiplayerMenu.pug');

const data = {};

export default class MultiplayerMenuView extends BaseView {
	constructor () {
		super(multiplayerMenuTmpl);
		this._navigationController = new NavigationController();
	}

	show () {
		Bus.on('done-get-user', { callbackName : 'MultiplayerMenuView.render', callback : this.render.bind(this)});
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (!user.is_authenticated) {
			data.headerValues = notAuthMenuHeader();
			super.render(data);
		} else {
			data.headerValues = authMenuHeader(user.id);
			super.render(data);
		}
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'MultiplayerMenuView.render');

	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
