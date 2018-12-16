import BaseValidator from './BaseValidator.js';

export default class CreateRoomValidator extends BaseValidator {
	validate () {
		return super.validate(this._timeLimitCheck(),
			this._participantsCountCheck(),
			this._fieldWidthCheck(),
			this._fieldHeightCheck());
	}

	_timeLimitCheck () {
		const time = document.getElementById('time_limit_input').value;
		if (time > 100) {
			super._setError('time_limit_error', 'слишком долго');
			return true;
		} else if (time < 5) {
			super._setError('time_limit_error', 'слишком быстро');
			return true;
		}
		return false;
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
		return false;
	}

	_fieldWidthCheck () {
		const width = document.getElementById('width_input').value;
		if (width > 50) {
			super._setError('width_error', 'слишком большая ширина');
			return true;
		} else if (width < 20) {
			super._setError('width_error', 'слишком маленькая ширина');
			return true;
		}
		return false;
	}

	_fieldHeightCheck () {
		const height = document.getElementById('height_input').value;
		if (height > 50) {
			super._setError('height_error', 'слишком большая высота');
			return true;
		} else if (height < 20) {
			super._setError('height_error', 'слишком маленькая высота');
			return true;
		}
		return false;
	}
}
