import BaseValidator from './BaseValidator.js';

export default class SignUpValidator extends BaseValidator {
	validate () {
		return super.validate(this._hasEmptyFields(),
			this._isPasswordLongEnough(),
			this._isPasswordsMatching());
	}

	_hasEmptyFields () { // есть ли в форме пустые поля
		const form = document.getElementById('signup');
		return	Array.from(form.getElementsByTagName('input')).some((inp) => {
			if (inp.name !== 'submit') {
				if (this._isEmptyField(inp.value)) {
					super._setError(inp.name + '_error', 'поле должно быть заполнено');
				} else { // если при повторном сабмите поле заполнилось ошибку нужно убрать
					if (!document.getElementById(inp.name + '_error').hasAttribute('hidden')) {
						document.getElementById(inp.name + '_error').setAttribute('hidden', 'hidden');
					}
				}
			}
		});
	}

	_isPasswordsMatching () { // проверка на совпадение паролей
		const pass1 = document.getElementById('password_input');
		const pass2 = document.getElementById('password_repeat_input');
		if (pass1.value !== pass2.value) {
			super._setError('password_repeat_error', 'пароли не совпадают');
			return true;
		}
		return false;
	}

	_isPasswordLongEnough () {
		const pass = document.getElementById('password_input');

		if (pass.value.length < 8) {
			super._setError('password_error', 'минимум 8 символов');
			return true;
		}
		return false;
	}

	_isEmptyField (value) { // проверка на пустоту одного конкретного поля
		return value === '';
	}
}
