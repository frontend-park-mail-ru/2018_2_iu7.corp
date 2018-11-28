import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

export default class ChangeView extends BaseView {
	constructor () {
		super(form);
		this._navigationController = new NavigationController();
		this._formController = new FormController('change');
		Bus.on('done-get-user', this.render.bind(this));
	}

	show () {
		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (user.is_authenticated) { // если пользователь залогинен и хочет посмотреть свой профиль
			const data = {
				title: 'Change Settings',
				id: 'change',
				fields: [
					{
						id: 'username_input',
						name: 'username',
						type: 'text',
						placeholder: 'New username',
						errorId: 'username_error'
					},
					{
						id: 'email_input',
						name: 'email',
						type: 'email',
						placeholder: 'New email',
						errorId: 'email_error'
					},
					{
						id: 'password_input',
						name: 'password',
						type: 'email',
						placeholder: 'New password',
						errorId: 'password_error'
					}
				],
				headerValues: [
					{
						label: 'Профиль',
						href: `/profile/${user.id}`
					},
					{
						label: 'Таблица лидеров',
						href: '/leaderboard'
					},
					{
						label: 'Выйти',
						href: '/signout'
					}
				]
			};

			this._template = form;
			super.render(data);
		} else { // если не залогинен
			const permissionMessageData = {
				title: 'Change settings',
				message: 'You can not change someone`s settings',
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
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
		Bus.off('done-get-user', this.render.bind(this));
	}

	registerActions () {
		this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
