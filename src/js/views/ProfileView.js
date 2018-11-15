import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import ProfileModel from '../models/ProfileModel.js';
import ProfileController from '../controllers/ProfileController.js';

const preloadTmpl = require('./templates/preload.pug');
const profileTmpl = require('./templates/profile.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

export default class ProfileView extends BaseView {
	constructor () {
		super(profileTmpl);
		this._profileModel = new ProfileModel(); // handle events
        this._profileController = new ProfileController();
		this._navigationController = new NavigationController();

		this.preload();
		Bus.on('done-profile-fetch', this.render.bind(this));
	}

	show () {
		// super.show();
		Bus.emit('profile-load');
		super.show();
		this.registerActions();
	}

	render (user) {
		const data = {
			title: 'Profile',
			changeHref: `/change/${user.profiles_id}`,
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

	preload() {
        const data = {
            title: 'Profile'
        };
        this.viewDiv.innerHTML = '';
        this.viewDiv.innerHTML = preloadTmpl(data);
    }

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}

}
