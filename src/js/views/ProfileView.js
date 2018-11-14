import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
const profileTmpl = require('./templates/profile.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

export default class ProfileView extends BaseView {
	constructor () {
		super(profileTmpl);
		this._navigationController = new NavigationController();
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		const data = {
			title: 'Profile',
			usr: user
		};

		if (user.is_authenticated) {
			this._template = profileTmpl;
			super.render(data);
		} else {
			const permissionMessageData = {
				title: 'Profile',
				message: 'You are not singed in to see your profile'
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}

}
