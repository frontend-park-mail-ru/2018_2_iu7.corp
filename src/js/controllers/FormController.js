import Bus from '../modules/Bus.js';

export default class FormController {
    constructor(formName, Validator = null) {
        if (Validator) {
            this._validator = new Validator();
        }

        this._formName = formName;

    }

    callbackSubmit(event) {
        event.preventDefault();
        console.log(this);

        if (this._validator && !this._validator.validate(event.target)) {
            return;
        }

        // TODO сделать валидации 
        // TODO универсальный сборщик данныз из формы

		const username = form.elements[ 'username' ].value;
		const email = form.elements[ 'email' ].value;
		const password = form.elements[ 'password' ].value;
		const passwordRepeat = form.elements[ 'password_repeat' ].value;

        Bus.emit(
            "submit-data-" + this._formName,
            {
                username,
                email,
                password
            }
        );
    }
}