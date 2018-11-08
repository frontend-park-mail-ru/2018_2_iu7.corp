import Bus from '../modules/Bus.js';

/**
 * Form controller provides callback for sending forms via events
 * @class FormController
 */
export default class FormController {
	/**
     * Creates the controller, setups the validator
     * @param {string} formName name of the form (is used when emitting events)
     * @param {Class} Validator validator component
     */
	constructor (formName, Validator) {
		if (Validator) {
			this._validator = new Validator();
		}

		this._formName = formName;
	}

	/**
     * Callback for view to apply. Takes values from form and passes it through validator if set, then emits event
     * @param {Event} event 'submit' event
     */
	callbackSubmit (event) {
		event.preventDefault();

		if (this._validator && !this._validator.validate(event.target)) {
			return;
		}

		let data = Array.from(event.target.elements)
			.reduce((acc, val) => {
				if (val.value !== '' && val.name !== 'password_repeat') {
					acc[val.name] = val.value;
				}
				return acc;
			}, {});

		Bus.emit('submit-data-' + this._formName, data);
	}
}
