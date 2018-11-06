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

        let data = Array.from(event.target.elements).
        reduce((acc, val) => {
            if (val.value !== "" && val.name !== "password_repeat") {
                acc[val.name] = val.value;
            }
            return acc;
        }, {});

        console.log('this._formName', this._formName);
        console.log(data);

        Bus.emit("submit-data-" + this._formName, data);
    }
}