import Bus from './Bus.js';

class Router {
	constructor () {
		this._routes = {};
		this._currentRoute = null;
		window.addEventListener('popstate', this.popstateCallback.bind(this));
	}

	/**
     * Register a new path
     * @param {string} path - path for the View
     * @param {Class} View - class of the view
     */
	register (path, View) {
		this._routes[path] = {
			View: View,
			viewEntity: null
		};

		return this;
	}

	/**
     * @return {Object}
     * Split pathname to path and page
     * @param {string} path - path for the View
     */
	parsePath (path) {
		let aPath = path.split('/');
		return { path: `/${aPath[1]}`, page: aPath[2] };
	}

	/**
     * @return {Router}
     * Shows view linked with path and push pathname to history
     * @param {string} pathname - path for the View
     */
	open (pathname = '/') {
		this._open(pathname);
		window.history.pushState({ lastRoute: pathname }, '', pathname);
		return this;
	}

	/**
     * 
     * Shows view linked with path
     * @param {string} pathname - path for the View
     */
	_open (pathname) {
		console.log('path name', pathname);
		let { path, page } = this.parsePath(pathname);
		if (!this._routes[path]) {
			Bus.emit('error', 'no such path is registred');
			return;
		}

		let { View, viewEntity } = this._routes[path];
		if (viewEntity === null) {
			viewEntity = new View();
		}

		if (page) { // для лидерборда
			Bus.emit('leaderboard-set-page', page);
		}

		if (viewEntity._isHidden) { // если страница не была показана
			if (this._currentRoute) {
				this._routes[this._currentRoute].viewEntity.hide(); // прячем страничку на которой находились
			}
			this._currentRoute = path;
			viewEntity.show(); // показываем новую страницу
		} else if (path === this._currentRoute) {
			this.rerender();
		}

		this._routes[path] = { View, viewEntity };
	}

	/**
     * 
     * Allows to redraw open view
     */
	rerender () {
		this._routes[this._currentRoute].viewEntity.show();
	}

	/**
     * @return {String} path for the view
     * Get path for View
     * @param {Class} View View's class
     */
	getPathTo (View) {
		for (let key in Object.getOwnPropertyNames(this._routes)) {
			if (this._routes[key].View === View) {
				return key;
			}
		}
	}

	/**
     * 
     * work with history.api
     * @param {event} event popstate
     */
	popstateCallback (event) {
		event.preventDefault();
		if (event.state.lastRoute) {
			this._open(event.state.lastRoute);
		}
	}
}

export default new Router();
