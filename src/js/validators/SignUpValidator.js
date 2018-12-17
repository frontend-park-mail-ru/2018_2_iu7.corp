// TODO сделать базовый класс formValidate и наследовать от него классы для валидаций форм
// регистрации логина и изменеения настроек

export default class SignUpValidator {
	validate (form) {
		if (this._hasEmptyFields(form)) {
			return false;
		}

		const pass1 = document.getElementById('password_input');
		const pass2 = document.getElementById('password_repeat_input');

		if (!this._isPasswordsMatching(pass1, pass2)) {
			return false;
		}

		if (!this._isPasswordLongEnough(pass1)) {
			return false;
		}
		return true;
	}

	_hasEmptyFields (form) { // есть ли в форме пустые поля
		return	Array.from(form.getElementsByTagName('input')).some((inp) => {
			if (inp.name !== 'submit') {
				if (this._isEmptyField(inp.value)) {
					this._setError(inp.name + '_error', 'This field must be filled');
				} else { // если при повторном сабмите поле заполнилось ошибку нужно убрать
					if (!document.getElementById(inp.name + '_error').hasAttribute('hidden')) {
						document.getElementById(inp.name + '_error').setAttribute('hidden', 'hidden');
					}
				}
			}
		});
	}

	_isPasswordsMatching (pass1, pass2) { // проверка на совпадение паролей
		if (pass1.value !== pass2.value) {
			this._setError('password_repeat_error', 'Passwords do not match');
			return false;
		}
		return true;
	}

	_isPasswordLongEnough (pass) {
		if (pass.value.length < 8) {
			this._setError('password_error', 'Password must be at least 8 characters');
			return false;
		}
		return true;
		// console.log(pass.value);
		// console.log(typeof (pass.value));
	}

	_isEmptyField (value) { // проверка на пустоту одного конкретного поля
		return value === '';
	}

	_setError (id, error) {
		let errorField = document.getElementById(id);
		errorField.innerText = error;
		errorField.removeAttribute('hidden');
	}
}
