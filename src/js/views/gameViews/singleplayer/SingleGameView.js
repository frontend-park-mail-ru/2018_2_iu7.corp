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
	},
];

const resize = function () {
	// let y;
	// let x;
	canvas1 = document.getElementById("canvas1");
	canvas2 = document.getElementById("canvas2");
	
	canvas1.width = window.innerWidth;
	canvas1.height = window.innerHeight;

	canvas2.width = window.innerWidth;
	canvas2.height = window.innerHeight;

	// const bigStep = 100;
	// const smallStep = 10;
	// context.beginPath();
	// context.strokeStyle = '#eeeeee';
	// for (x = 0; x < canvas.width; x += smallStep) {
	// 	context.moveTo(x, 0);
	// 	context.lineTo(x, canvas.height);
	// }
	// for (y = 0; y < canvas.height; y += smallStep) {
	// 	context.moveTo(0, y);
	// 	context.lineTo(canvas.width, y);
	// }
	// context.stroke();

	// context.beginPath();
	// context.strokeStyle = '#aaaaaa';
	// for (x = 0; x < canvas.width; x += bigStep) {
	// 	context.moveTo(x, 0);
	// 	context.lineTo(x, canvas.height);
	// }
	// for (y = 0; y < canvas.height; y += bigStep) {
	// 	context.moveTo(0, y);
	// 	context.lineTo(canvas.width, y);
	// }
	// context.stroke();

	// context.strokeStyle = '#ff0000';
};


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
		this.showInfo();
		
		SingleGame.init();
		SingleGame.start();
		// resize();
	}

	showInfo() {
		document.getElementById("dropdown-game-info").style.height = "100%";
	};

	hideInfo() {
		document.getElementById("dropdown-game-info").style.height = "0%";
	};

	registerActions () {
		// this.viewDiv.onload(this.showInfo());
		// this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
