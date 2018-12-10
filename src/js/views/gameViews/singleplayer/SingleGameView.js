import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import SingleGame from '../../../game/singleplayer/SingleGame.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const canvasTmpl = require('../../templates/gameTemplates/canvas.pug');
const data = {};

data.headerMenu = [
	{
		label: 'Время',
		data: '00'
	},
	{
		label: 'Очки',
		data: '00'
	},
	{
		label: 'Мобы',
		data: '4'
	}
];

export default class SingleGameView extends BaseView {
	constructor () {
		super(canvasTmpl);
		this._navigationController = new NavigationController();
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
		// this.render();
		
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
		SingleGame.init();
		SingleGame.start();
	}

	registerActions () {
		// this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
