import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
const chatTmpl = require('./templates/chat.pug');

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
	]
};

export default class ChatView extends BaseView {
	constructor () {
		super(chatTmpl);
		this._navigationController = new NavigationController();
		// Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		// Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render () {
		frameDiv = document.getElementById('chat-iframe');
		frame = document.createElement('iframe');
	}
}
