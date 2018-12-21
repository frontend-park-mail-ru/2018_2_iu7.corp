import BaseValidator from './BaseValidator.js';

export default class CreateRoomValidator extends BaseValidator {
	validate () {
		return super.validate(
			this._hasEmptyFields(),
			this._timeLimitCheck(),
			this._participantsCountCheck(),
			this._fieldWidthCheck(),
			this._fieldHeightCheck()
		);
	}

	_hasEmptyFields () {
		let emptyFlag = true;
		const form = document.getElementById('createroom');
		const inputs = Array.from(form.getElementsByTagName('input')).filter(
			inp => {
				return inp.name !== 'submit';
			}
		);

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

	_timeLimitCheck () {
		const time = document.getElementById('time_limit_input').value;
		if (time > 100) {
			super._setError('time_limit_error', 'слишком долго');
			return false;
		} else if (time < 5) {
			super._setError('time_limit_error', 'слишком быстро');
			return false;
		}
		return true;
	}

	_participantsCountCheck () {
		const count = document.getElementById('max_num_players_input').value;
		if (count > 4) {
			super._setError('max_num_players_error', 'слишком много игроков');
			return true;
		} else if (count < 2) {
			super._setError('max_num_players_error', 'слишком мало игроков');
			return true;
		}
		return true;
	}

	_fieldWidthCheck () {
		const width = document.getElementById('width_input').value;
		if (width > 50) {
			super._setError('width_error', 'слишком большая ширина');
			return false;
		} else if (width < 20) {
			super._setError('width_error', 'слишком маленькая ширина');
			return false;
		}
		return true;
	}

	_fieldHeightCheck () {
		const height = document.getElementById('height_input').value;
		if (height > 50) {
			super._setError('height_error', 'слишком большая высота');
			return false;
		} else if (height < 20) {
			super._setError('height_error', 'слишком маленькая высота');
			return false;
		}
		return true;
	}
}
