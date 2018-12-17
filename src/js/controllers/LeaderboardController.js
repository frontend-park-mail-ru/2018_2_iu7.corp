import Bus from '../modules/Bus.js';
import Router from '../modules/Router.js';

/**
 * Leaderboard controller provides callbacks for pagination on Leaderboard page
 * @class LeaderboardController
 */
export default class LeaderboardController {
	/**
     * Creates the controller and setups the events on Bus
     */
	constructor () {
		this._currentPage = 1;

		Bus.on('leaderboard-next-page', this._nextPage.bind(this));
		Bus.on('leaderboard-prev-page', this._prevPage.bind(this));
		Bus.on('leaderboard-set-page', this._setPage.bind(this));
		Bus.on('leaderboard-load', this._loadPage.bind(this));
	}

	/**
     *
     * Emits event on Leaderboard Model
     * @private
     */
	_loadPage () {
		Bus.emit('leaderboard-fetch', this._currentPage);
	}

	/**
     *
     * Increments page counter and navigates to next page
     * @private
     */
	_nextPage () {
		this._currentPage += 1;
		Router.open(`/leaderboard/${this._currentPage}`);
	}

	/**
     *
     * Decrements page counter and navigates to prev page if possible
     * @private
     */
	_prevPage () {
		if (this._currentPage > 1) {
			this._currentPage -= 1;
		}
		Router.open(`/leaderboard/${this._currentPage}`);
	}

	/**
     * @param {string|number} page page number
     * Sets page counter to specific number
     * @private
     */
	_setPage (page) { // TODO перейты на ts
		if (page > 0) {
			this._currentPage = +page;
		}
	}

	/**
     * @return {undefined}
     * @param {Event} event "click" event
     * Callback for views to apply. Emits next page event
     */
	paginationNextCallback (event) {
		event.preventDefault();
		event.stopImmediatePropagation();

		Bus.emit('leaderboard-next-page');
	}

	/**
     * @return {undefined}
     * @param {Event} event "click" event
     * Callback for views to apply. Emits prev page event
     */
	paginationPrevCallback (event) {
		event.preventDefault();
		event.stopImmediatePropagation();

		Bus.emit('leaderboard-prev-page');
	}
}
