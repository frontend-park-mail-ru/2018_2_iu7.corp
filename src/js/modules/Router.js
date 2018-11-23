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
		let queryParams = {
			path: null,
			id: null,
			page_index: null
		};

		if (path.includes('page_index')) {
			const query = path.split('?');
			queryParams.path = query[0];
			const params = query[1].split('&');
			params.forEach((p) => {
				let pair = p.split('=');
				queryParams[pair[0]] = pair[1];
			});
			return queryParams;
		} else {
			let aPath = path.split('/');
			queryParams.path = `/${aPath[1]}`;
			queryParams.id = aPath[2];
			return queryParams;
		}
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
		// console.log('pathname', pathname);
		let { path, id, page_index } = this.parsePath(pathname);
		// console.log(path, id, page_index);
		if (!this._routes[path]) {
			Bus.emit('error', 'no such path is registred');
			return;
		}

		let { View, viewEntity } = this._routes[path];
		if (viewEntity === null) {
			viewEntity = new View();
		}

		if (page_index) { // для лидерборда
			Bus.emit('leaderboard-set-page', page_index);
		}

		if (id) { // устанавливаем id нужного пользователя через контроллер
			Bus.emit('set-target-id', id);
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
