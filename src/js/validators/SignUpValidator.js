import BaseValidator from './BaseValidator.js';

export default class SignUpValidator extends BaseValidator {
	validate () {
		return super.validate(
			this._hasEmptyFields(),
			this._isPasswordLongEnough(),
			this._isPasswordsMatching());
	}



	_hasEmptyFields () {
		let emptyFlag = true;
		const form = document.getElementById('signup');
		const inputs = Array.from(form.getElementsByTagName('input')).filter(
			inp => {
				return inp.name !== 'submit';
			}
		)

		for (const inp of inputs) {
			if (this._isEmptyField(inp.value)) {
				this._setError(inp.name + '_error', 'поле должно быть заполнено');
				emptyFlag = false;
			} else {
				if (!document.getElementById(inp.name + '_error').hasAttribute('hidden')) {
					document.getElementById(inp.name + '_error').setAttribute('hidden', 'hidden');
				}	
			}
		}
		return emptyFlag;
	}
	_isPasswordsMatching () { // проверка на совпадение паролей
		const pass1 = document.getElementById('password_input');
		const pass2 = document.getElementById('password_repeat_input');
		if (pass1.value !== pass2.value) {
			super._setError('password_repeat_error', 'пароли не совпадают');
			return false;
		}
		return true;
	}

	_isPasswordLongEnough () {
		const pass = document.getElementById('password_input');

		if (pass.value.length < 8) {
			super._setError('password_error', 'минимум 8 символов');
			return false;
		}
		return true;
	}

	_isEmptyField (value) { // проверка на пустоту одного конкретного поля
		return value === '';
	}
}
