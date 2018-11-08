// TODO сделать базовый класс formValidate и наследовать от него классы для валидаций форм
// регистрации логина и изменеения настроек

export default class SignUpValidator {
	validate (form) {
		let isValid = true;
		const inputs = form.getElementsByTagName('input');
		for (const inp of inputs) {
			if (inp.name !== 'submit') {
				if (this._isEmpty(inp.value)) {
					this._setError(inp.name + '_error', 'This field must be filled');
					isValid = false;
				} else { // если при повторном сабмите поле заполнилось ошибку нужно убрать
					if (!document.getElementById(inp.name + '_error').hasAttribute('hidden')) {
						document.getElementById(inp.name + '_error').setAttribute('hidden', 'hidden');
					}
				}
			}
		}

		const pass1 = document.getElementById('password_input');
		const pass2 = document.getElementById('password_repeat_input');

		if (pass1.value !== '' || pass2.value !== '') {
			if (!this._isMatch(pass1.value, pass2.value)) {
				this._setError('password_repeat_error', 'Passwords do not match');
				isValid = false;
			}
		}

		return isValid;
	}

	_isEmpty (value) {
		if (value === '') {
			return true;
		}
		return false;
	}

	_setError (id, error) {
		let errorField = document.getElementById(id);
		errorField.innerText = error;
		errorField.removeAttribute('hidden');
	}

	_isMatch (pass1, pass2) {
		if (pass1 !== pass2) {
			return false;
		}
		return true;
	}
}
