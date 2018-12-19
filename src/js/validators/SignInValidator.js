import BaseValidator from './BaseValidator.js';


export default class SignInValidator extends BaseValidator {
	validate () {
		return super.validate(this._hasEmptyFields());
	}

	_hasEmptyFields () {
		let emptyFlag = true;
		const form = document.getElementById('signin');
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


    _isEmptyField (value) { // проверка на пустоту одного конкретного поля
		return value === '';
	}
}