import BaseView from '../../BaseView.js';
import Bus from '../../../modules/Bus.js';
import NavigationController from '../../../controllers/NavigationController.js';
import SingleGame from '../../../game/singleplayer/SingleGame.js';
import { authMenuHeader, notAuthMenuHeader } from '../../dataTemplates/headerMenuData.js';

const canvasTmpl = require('../../templates/gameTemplates/canvas.pug');
const data = {};

data.headerMenu = [
	{
		label: '⏱',
		data: '00'
	},
	{
		label: '👾',
		data: '4'
	}
];
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
		data: '"f"'
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
		// Bus.on('done-get-user', this.render.bind(this));

		// this.render();
	}

	show () {
		console.log('show', this._game);
		this._game = new SingleGame();
		Bus.on('done-get-user', this.render.bind(this));
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}
	hide () {
		super.hide();
		this._game._scene.clearEvents();
		this._game.end();
		delete this._game;
		Bus.totalOff('done-get-user');
	}

	render (user) {
		console.log('view render')
		if (!user.is_authenticated) {
			data.headerValues = notAuthMenuHeader();
			super.render(data);
		} else {
			data.headerValues = authMenuHeader(user.id);
			super.render(data);
		}
		this.showInfo();

		this._game.init();
		this._game.start();
		// Bus.totalOff('done-get-user');
		// resize();
	}

	showInfo () {
		document.getElementById('dropdown-game-info').style.height = '100%';
	};

	hideInfo () {
		document.getElementById('dropdown-game-info').style.height = '0%';
	};

	registerActions () {
		// this.viewDiv.onload(this.showInfo());
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
