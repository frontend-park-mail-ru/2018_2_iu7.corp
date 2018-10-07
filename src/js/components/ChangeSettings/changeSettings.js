'use strict'

import {errorMessage} from '../Errors/error.js'
import {AjaxModule} from '../../modules/ajax.js';
const changeSettingsForm = require('./changeSettings.pug');

const root = document.getElementById('root');
const AJAX = new AjaxModule;



export function changeSettings() {

    const changeSettingsDiv = document.createElement('div');
    changeSettingsDiv.innerHTML = changeSettingsForm({title: 'Изменение данных'});
    root.appendChild(changeSettingsDiv);
    
    const form = document.getElementById('changeSettingsForm');

    form.addEventListener('submit', function ( event ) {
        event.preventDefault();
        const email = form.elements[ 'email' ].value;
        const password = form.elements[ 'password' ].value;
        const password_repeat = form.elements[ 'password_repeat' ].value;

        if (password !== password_repeat) {
            errorMessage('Пароли не совпадают');
            return;
        }
        AJAX.doPost({
            callback (xhr) {
                root.innerHTML = '';
                // To do сообщение о успешном изменении настроек (перевод на страницу пользователя)                
            },
            path: '/change',
            body: {
                email,
                password
            }
        });
    });
}