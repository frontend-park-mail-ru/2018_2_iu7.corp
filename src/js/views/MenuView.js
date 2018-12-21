import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import '../../css/styles/dropdown/dropdown.js';
import '../../css/styles/input/slider.js';
import { authMenuHeader, notAuthMenuHeader } from '../views/dataTemplates/headerMenuData.js';

const menu = require('./templates/menu.pug');

const mainMenu = [
	{
		label: 'Мультиплеер',
		href: '/multiplayerMenu'
	},
	{
		label: 'Одиночная игра',
		href: '/single'
	}
	// {
	// 	label: '💣 Об игре',
	// 	href: '/about'
	// }
];

export default class MenuView extends BaseView {
	constructor () {
		super(menu);
		this._navigationController = new NavigationController();
	}

	show () {
		Bus.on('done-get-user', { callbackName: 'MenuView.render', callback: this.render.bind(this) });
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (user.is_authenticated) {
			super.render({ mainMenu: mainMenu, headerValues: authMenuHeader(user.id) });
		} else {
			super.render({ mainMenu: mainMenu, headerValues: notAuthMenuHeader() });
		}
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'MenuView.render');
	}

	registerActions () {
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
