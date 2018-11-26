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
		this._currentUser = null;

		this.preload();
		Bus.on('done-get-user', this._setCurrentUser.bind(this));
		Bus.on('done-leaderboard-fetch', this.render.bind(this));
	}

	_setCurrentUser(user) {
		this._currentUser = user;
	}

	/**
		 * Emits load event and shows view
		 *
		 */
	show () {
		Bus.emit('get-user');
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
			headerValues: [
				{
					label: 'Вход',
					href: '/signin'
				},
				{
					label: 'Регистрация',
					href: '/signup'
				},
				{
					label: 'Таблица лидеров',
					href: '/leaderboard'
				}
			],
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
		if (this._currentUser.is_authenticated) {
			const data = {
				headerValues: [
					{
						label: 'Профиль',
						href: `/profile/${this._currentUser.id}`
					},
					{
						label: 'Таблица лидеров',
						href: '/leaderboard'
					},
					{
						label: 'Выйти',
						href: '/signout'
					}
				],
				title: 'Leaderboard',
				usrs: users
			};
			super.render(data);
		} else {
			const data = {
				headerValues: [
					{
						label: 'Вход',
						href: '/signin'
					},
					{
						label: 'Регистрация',
						href: '/signup'
					},
					{
						label: 'Таблица лидеров',
						href: '/leaderboard'
					}
				],
				title: 'Leaderboard',
				usrs: users
			};
			super.render(data);
		}
		Bus.off('done-get-user', this._setCurrentUser.bind(this));
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
