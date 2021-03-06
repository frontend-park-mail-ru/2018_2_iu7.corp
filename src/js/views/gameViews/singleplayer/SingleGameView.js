import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import SingleGame from '../../../game/singleplayer/SingleGame.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const canvasTmpl = require('../../templates/gameTemplates/canvas.pug');
const data = {};

data.helpValues = [
	{
		label: 'Цель игры',
		data: 'Уничтожить всех врагов'
	},
	{
		label: 'Перемещение персонажа',
		data: '"wasd" или стрелочки'
	},
	{
		label: 'Поставить бомбу',
		data: 'Пробел или Enter'
	},
	{
		label: 'Для сенсорных устройств',
		data: 'джостик слева и кнопка справа'
	},
	{
		label: 'Радиус бомбы',
		data: '2 клетки'
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
		this.showInfo();

		SingleGame.init();
		SingleGame.start();
		// resize();
	}

	showInfo () {
		document.getElementById('dropdown-game-info').style.width = '100%';
	};

	hideInfo () {
		document.getElementById('dropdown-game-info').style.width = '0%';
	};

	registerActions () {
		// this.viewDiv.onload(this.showInfo());
		// this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
