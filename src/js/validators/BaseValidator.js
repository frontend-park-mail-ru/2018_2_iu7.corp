export default class BaseValidator {
	validate (...validations) {
		for (const validation of validations) {
			if (!validation) {
				return false;
			}
		}
		return true;
	}

	_setError (id, error) {
		let errorField = document.getElementById(id);
		errorField.innerText = error;
		errorField.removeAttribute('hidden');
	}
}
