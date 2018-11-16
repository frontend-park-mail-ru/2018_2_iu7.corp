import NavigationController from '../controllers/NavigationController.js';
import LeaderboardController from '../controllers/LeaderboardController.js';
import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import LeaderboardModel from '../models/LeaderboardModel.js';

const leaderboardTmpl = require('./templates/leaderboard.pug');
const preloadTmpl = require('./templates/preload.pug');

/**
 * View of the "Leaderboard" page
 * @class LeaderboardView
 * @extends BaseView
 */
export default class LeaderboardView extends BaseView {
	/**
     * Creates view and registres view events
     */
	constructor () {
		super(leaderboardTmpl);
		this._leaderboardModel = new LeaderboardModel(); // handle events
		this._leaderboardController = new LeaderboardController();
		this._navigationController = new NavigationController();

		this.preload();
		Bus.on('done-leaderboard-fetch', this.render.bind(this));
	}

	/**
     * Emits load event and shows view
     *
     */
	show () {
		super.show();
		Bus.emit('leaderboard-load');
	}

	/**
     * Resets page number to 1
     *
     */
	hide () {
		Bus.emit('leaderboard-set-page', 1);
		super.hide();
	}

	/**
     * Render loading page
     *
     */
	preload () {
		const data = {
			title: 'Leaderboard'
		};
		this.viewDiv.innerHTML = '';
		this.viewDiv.innerHTML = preloadTmpl(data);
	}

	/**
     * Render list of users
     * @param {Array} users List of users on this page
     */
	render (users) {
		const data = {
			title: 'Leaderboard',
			usrs: users
		};
		super.render(data);
		this.registerActions();
	}

	/**
     * Register events for NavigationController and LeaderboardController to handle
     *
     */
	registerActions () {
		document.getElementById('prev_page_link')
			.addEventListener('click', this._leaderboardController.paginationPrevCallback.bind(this._leaderboardController));
		document.getElementById('next_page_link')
			.addEventListener('click', this._leaderboardController.paginationNextCallback.bind(this._leaderboardController));

		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback.bind(this._navigationController));
	}
}
