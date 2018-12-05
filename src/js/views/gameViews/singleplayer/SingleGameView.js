import BaseView from '../../BaseView.js';
import SingleGame from '../../../game/singleplayer/SingleGame.js';
const canvasTmpl = require('../../templates/gameTemplates/canvas.pug');

export default class SingleGameView extends BaseView {
	constructor () {
		super(canvasTmpl);
	}

	show () {
		super.show();
		this.render();
		SingleGame.init();
		SingleGame.start();
	}

	render () {
		const data = {
			title: 'Game'
		};
		super.render(data);
	}
}

// вьюха для сингла
