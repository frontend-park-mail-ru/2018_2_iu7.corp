export default class BaseView {
	constructor () {
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

	render () {
		this.viewDiv.innerHTML = '';
	}
}
