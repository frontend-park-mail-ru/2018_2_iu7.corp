import BaseView from './BaseView.js';
import Bus from '../modules/Bus.js';
import NavigationController from '../controllers/NavigationController.js';
import FormController from '../controllers/FormController.js';
import { authMenuHeader, notAuthMenuHeader } from '../views/dataTemplates/headerMenuData.js';

const form = require('./templates/form.pug');
const permissionMessageTmpl = require('./templates/notPermittedAction.pug');

export default class ChangeView extends BaseView {
	constructor () {
		super(form);
		this._navigationController = new NavigationController();
		this._formController = new FormController('change');
	}

	show () {
		Bus.on('done-get-user', { callbackName: 'ChangeView.render', callback: this.render.bind(this) });

		Bus.emit('get-user');
		super.show();
		this.registerActions();
	}

	render (user) {
		if (user.is_authenticated) { // если пользователь залогинен и хочет посмотреть свой профиль
			const data = {
				title: 'Настройки',
				id: 'change',
				fields: [
					{
						id: 'username_input',
						name: 'username',
						type: 'text',
						placeholder: 'Новое имя пользователя',
						errorId: 'username_error'
					},
					{
						id: 'email_input',
						name: 'email',
						type: 'email',
						placeholder: 'Новый email',
						errorId: 'email_error'
					},
					{
						id: 'password_input',
						name: 'password',
						type: 'password',
						placeholder: 'Новый пароль',
						errorId: 'password_error'
					}
				],
				headerValues: notAuthMenuHeader()
			};

			this._template = form;
			super.render(data);
		} else { // если не залогинен
			const permissionMessageData = {
				title: 'Настройки',
				message: 'Ошибка доступа, вам нельзя изменять чужие настройки',
				headerValues: authMenuHeader(this._currentUser.id)
			};
			this._template = permissionMessageTmpl;
			super.render(permissionMessageData);
		}
	}

	hide () {
		super.hide();
		Bus.off('done-get-user', 'ChangeView.render');
	}

	registerActions () {
		this.viewDiv.addEventListener('submit', this._formController.callbackSubmit.bind(this._formController));
		this.viewDiv.addEventListener('click', this._navigationController.keyPressedCallback);
	}
}
