import NavigationController from '../controllers/NavigationController.js';
import LeaderboardController from '../controllers/LeaderboardController.js';
import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import LeaderboardModel from '../models/LeaderboardModel.js';

const header = require('./templates/header.pug');
const leaderboardTmpl = require('./templates/leaderboard.pug');

/**
 * View of the "Leaderboard" page
 * @class LeaderboardView
 * @extends BaseView
 */
export default class LeaderboardView extends BaseView {
    /**
     * Creates view and registres view events
     */
    constructor() {
        super();
        this._leaderboardModel = new LeaderboardModel(); // handle events
        this._leaderboardController = new LeaderboardController();
        this._navigationController = new NavigationController();

        this.render();
        Bus.on('done-leaderboard-fetch', this.renderUsers.bind(this));
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        super.show();
        Bus.emit('leaderboard-load');
    }

    /**
     * Resets page number to 1
     * @return {undefined}
     */
    hide() {
        Bus.emit('leaderboard-set-page', 1);
        super.hide();
    }

    /**
     * Render header and loading
     * @return {undefined}
     */
    render() { 
        super.render();

        this.viewDiv.innerHTML += header({ title: 'Leaderboard' });
        let main = document.createElement('main');
        const loading = document.createElement('p');
        loading.innerText = 'Loading leaderboard';
        main.appendChild(loading);
        this.viewDiv.appendChild(main);

    }

    /**
     * Render list of users
     * @param {Array} users List of users on this page
     * @return {undefined}
     */
    renderUsers(users) {
        this.viewDiv.getElementsByTagName('main')[0].innerHTML = '';
        this.viewDiv.getElementsByTagName('main')[0].innerHTML = leaderboardTmpl({usrs: users.profiles});
        this.registerEvents();
    }

    /**
     * Register events for NavigationController and LeaderboardController to handle
     * @return {undefined}
     */
    registerEvents() {
        document.getElementById('prev_page_link').
            addEventListener('click', this._leaderboardController.paginationPrevCallback.bind(this._leaderboardController));
        document.getElementById('next_page_link').
            addEventListener('click', this._leaderboardController.paginationNextCallback.bind(this._leaderboardController));

        this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback.bind(this._navigationController));
    }
}