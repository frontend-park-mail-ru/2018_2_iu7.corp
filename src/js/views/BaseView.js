import '../../css/styles/main/main.css';
import '../../css/styles/header/header.css';
import '../../css/styles/dropdown/dropdown.css';
import '../../css/styles/grid/grid.css';
import '../../css/styles/menu/menu.css';
import '../../css/styles/chat/chat.css';
import '../../css/styles/fonts/Rubik/rubik.css';
import '../../css/styles/input/input.css';
import '../../css/styles/input/slider.css';

export default class BaseView {
	constructor (template) {
		this._template = template;

		this.viewDiv = document.createElement('div');
		BaseView.rootToRender.appendChild(this.viewDiv);
		this._isHidden = true;
	}

	static get rootToRender () {
		return document.getElementById('root');
	}

	show () {
		this._isHidden = false;
		BaseView.rootToRender.appendChild(this.viewDiv);
	}

	hide () {
		this._isHidden = true;
		document.getElementById('root').innerHTML = '';
	}

	render (context) {
		this.viewDiv.innerHTML = '';
		const main = document.createElement('main');
		main.innerHTML = this._template(context);
		this.viewDiv.appendChild(main);
	}
}
