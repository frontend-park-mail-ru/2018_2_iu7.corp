export default class BaseValidator {
    validate (...validations) {
        validations.forEach( (validation) => {
            if (!validation) {
                return false
            }
            return true;
        })
    }


    _setError (id, error) {
		let errorField = document.getElementById(id);
		errorField.innerText = error;
		errorField.removeAttribute('hidden');
	}
}